# app/sqs/workers.py

import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Dict, Any

from beanie import PydanticObjectId
from pydantic import ValidationError

from app.database import init_db, close_db
from app.llm.response import generate_content
from app.prompts import (
    NOTE_SYSTEM_PROMPT,
    THEORY_SYSTEM_PROMPT,
    generate_note_prompt,
    generate_theory_prompt,
)
from app.models import Note, Theory, TempPromptJob
from app.models.theory import TheoryStatus
from app.models.note import NoteStatus
from app.schemas.note import ProblemDetailSchema, NoteContentSchema

logger = logging.getLogger(__name__)

class NonRetryableJobError(Exception):
    """Terminal job failures that should be acknowledged immediately without retry."""

# ==========================================
# DATABASE UTILITIES & FAILURE HANDLERS
# ==========================================

def _parse_object_id(raw_id: str, field_name: str) -> PydanticObjectId:
    try:
        return PydanticObjectId(raw_id)
    except Exception as exc:
        raise NonRetryableJobError(f"Invalid {field_name}: {raw_id}") from exc

async def _fetch_with_retries(fetch_fn, attempts: int = 8, delay_seconds: float = 1.5):
    for attempt in range(attempts):
        entity = await fetch_fn()
        if entity is not None:
            return entity
        if attempt < attempts - 1:
            await asyncio.sleep(delay_seconds)
    return None

async def handle_note_failure(note_id: str, reason: str):
    note = await Note.get(note_id)
    if note:
        note.status = NoteStatus.failed
        note.updatedAt = datetime.now(timezone.utc)
        await note.save()
    logger.error(f"[Job Failure] Note {note_id} failed: {reason}")

async def handle_theory_failure(theory_id: str, reason: str):
    theory = await Theory.get(theory_id)
    if theory:
        theory.status = TheoryStatus.failed
        theory.updatedAt = datetime.now(timezone.utc)
        await theory.save()
    logger.error(f"[Job Failure] Theory {theory_id} failed: {reason}")

async def handle_prompt_failure(job_id: str, reason: str):
    job = await TempPromptJob.get(job_id)
    if job:
        job.status = TheoryStatus.failed
        job.error_message = reason
        await job.save()
    logger.error(f"[Job Failure] Prompt Job {job_id} failed: {reason}")

# ==========================================
# CORE JOB EXECUTORS
# ==========================================

async def execute_note_generation(message: dict) -> None:
    note_id = message["note_id"]
    user_id = _parse_object_id(message["user_id"], "user_id")

    note = await _fetch_with_retries(lambda: Note.get(note_id))
    if not note:
        raise NonRetryableJobError(f"Note {note_id} missing from database.")
    if note.user_id != user_id:
        await handle_note_failure(note_id, "User verification mismatch.")
        return

    prompt = generate_note_prompt(
        problem_link=message["problemLink"],
        language=message["language"],
        user_notes=message.get("userNotes", ""),
    )
    
    ai_data = await generate_content(
        system=NOTE_SYSTEM_PROMPT,
        prompt=prompt,
        json_response=True,
    )
    note_json = ai_data.get("note", {})
    
    note.problem = ProblemDetailSchema(**ai_data.get("problem", {}))
    note.note = NoteContentSchema(
        intuition=note_json.get("intuition", ""),
        edgeCases=note_json.get("edgeCases", []),
        mistakesToAvoid=note_json.get("mistakesToAvoid", []),
        dryRun=note_json.get("dryRun", []),
        bruteForce=note_json.get("bruteForce"),
        better=note_json.get("better"),
        optimalApproach=note_json.get("optimalApproach")
    )
    note.userNotes = ai_data.get("userNotes", "").strip()
    note.status = NoteStatus.draft
    note.updatedAt = datetime.now(timezone.utc)
    await note.save()

async def execute_theory_generation(message: dict) -> None:
    theory_id = message["theory_id"]
    user_id = _parse_object_id(message["user_id"], "user_id")

    theory = await _fetch_with_retries(lambda: Theory.get(theory_id))
    if not theory:
        raise NonRetryableJobError(f"Theory {theory_id} missing from database.")
    if theory.user_id != user_id:
        await handle_theory_failure(theory_id, "User verification mismatch.")
        return

    prompt = generate_theory_prompt(
        topic=message["topic"],
        code_language=message.get("code_language"),
        instructions=message.get("instructions")
    )
    
    content = await generate_content(system=THEORY_SYSTEM_PROMPT, prompt=prompt)
    theory.content = content.strip()
    theory.status = TheoryStatus.draft
    theory.updatedAt = datetime.now(timezone.utc)
    await theory.save()

async def execute_prompt_optimization(message: dict) -> None:
    job_id = message["job_id"]
    job = await _fetch_with_retries(lambda: TempPromptJob.get(job_id))
    if not job:
        raise NonRetryableJobError(f"Prompt Job {job_id} missing or expired.")

    system_instruction = (
        "You are an expert prompt engineer. Take the user's unorganized notes,rough requirements, or messy copy-pastes about a topic and convert them into an optimized, highly clear prompt.Output ONLY the optimized prompt. Do not include introductory text."
    )
    user_content = (
        f"Topic: {message['topic']}\n"
        f"Programming Code Language: {message.get('code_language') or 'Not specified'}\n"
        f"Rough Notes/Requirements:\n\"\"\"\n{message['instructions']}\n\"\"\""
    )
    
    optimized = await generate_content(system=system_instruction, prompt=user_content)
    job.optimized_instructions = optimized.strip()
    job.status = TheoryStatus.final
    await job.save()

# ==========================================
# ROUTING & MAIN ENTRANCE HANDLERS
# ==========================================

JOB_REGISTRY = {
    "dsa": {"executor": execute_note_generation, "id_field": "note_id", "failure_handler": handle_note_failure},
    "theory": {"executor": execute_theory_generation, "id_field": "theory_id", "failure_handler": handle_theory_failure},
    "optimize_prompt": {"executor": execute_prompt_optimization, "id_field": "job_id", "failure_handler": handle_prompt_failure},
}

async def route_and_process_job(message: dict) -> None:
    """Routes incoming jobs and handles internal task validation or exceptions cleanly."""
    job_type = message.get("type", "dsa")
    if job_type not in JOB_REGISTRY:
        raise ValueError(f"Unsupported job type: {job_type}")

    config = JOB_REGISTRY[job_type]
    target_id = message.get(config["id_field"])
    
    try:
        await config["executor"](message)
    except (ValidationError, KeyError, NonRetryableJobError) as e:
        await config["failure_handler"](target_id, f"Payload Validation Fault: {e}")
    except Exception as e:
        await config["failure_handler"](target_id, f"Runtime Background Processing Error: {e}")
        raise e

async def start_async_queue_handler(event, context):
    """The central entrance point for parsing worker batch events (e.g., Lambda invokes)."""
    await init_db()
    batch_item_failures = []
    
    try:
        for record in event.get("Records", []):
            try:
                message = json.loads(record["body"])
                await route_and_process_job(message)
            except Exception as e:
                message_id = record.get("messageId")
                logger.critical(f"[SQS Critical] Failed message processing for ID {message_id}: {e}")
                if message_id:
                    batch_item_failures.append({"itemIdentifier": message_id})
                    
        return {"batchItemFailures": batch_item_failures}
    finally:
        await close_db()

def handler(event, context):
    """Synchronous AWS Lambda entry point wrapper."""
    return asyncio.run(start_async_queue_handler(event, context))