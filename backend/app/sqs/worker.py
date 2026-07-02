import asyncio
import json
from datetime import datetime, timezone

from beanie import PydanticObjectId
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

from .handle_failures import (
    handle_note_generation_failure, 
    handle_theory_generation_failure,
    handle_prompt_optimization_failure
)

class NonRetryableJobError(Exception):
    """Terminal job failures that should be acknowledged immediately without retry."""


def _parse_object_id(raw_id: str, field_name: str) -> PydanticObjectId:
    try:
        return PydanticObjectId(raw_id)
    except Exception as exc:
        raise NonRetryableJobError(f"Invalid {field_name}: {raw_id}") from exc


async def _fetch_with_retries(fetch_fn, entity_name: str, entity_id: str, attempts: int = 8, delay_seconds: float = 1.5):
    """Helper to poll database when consumer runs slightly faster than producer writes."""
    for attempt in range(attempts):
        entity = await fetch_fn()
        if entity is not None:
            return entity
        if attempt < attempts - 1:
            await asyncio.sleep(delay_seconds)
    return None


# ==========================================
# DSA NOTES GENERATOR EXECUTOR
# ==========================================
async def execute_note_generation(message: dict) -> None:
    note_id = message["note_id"]
    user_id = _parse_object_id(message["user_id"], "user_id")

    note = await _fetch_with_retries(lambda: Note.get(note_id), "DSA Note", note_id)
    if not note:
        raise NonRetryableJobError(f"Note {note_id} missing from MongoDB after retries.")

    if note.user_id != user_id:
        await handle_note_generation_failure(note_id, "User identifier verification mismatch.")
        return

    prompt = generate_note_prompt(
        problem_link=message["problemLink"],
        language=message["language"],
        userNotes=message.get("userNotes", ""),
    )

    try:
        ai_data = await generate_content(
            system=NOTE_SYSTEM_PROMPT,
            prompt=prompt,
            json_response=True,
        )

        note_json = ai_data.get("note", {})
        
        # Populate structured schemas
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

    except Exception as e:
        print(f"[Worker Error] Note generation failed for ID {note_id}: {e}")
        await handle_note_generation_failure(note_id, f"Generation Engine Fail: {e}")
        raise e


# ==========================================
# THEORY GENERATOR EXECUTOR
# ==========================================
async def execute_theory_generation(message: dict) -> None:
    theory_id = message["theory_id"]
    user_id = _parse_object_id(message["user_id"], "user_id")

    theory = await _fetch_with_retries(lambda: Theory.get(theory_id), "Theory note", theory_id)
    if not theory:
        raise NonRetryableJobError(f"Theory record {theory_id} missing from MongoDB after retries.")

    if theory.user_id != user_id:
        await handle_theory_generation_failure(theory_id, "User identifier verification mismatch.")
        return

    prompt = generate_theory_prompt(
        topic=message["topic"],
        code_language=message.get("code_language"),
        instructions=message.get("instructions") 
    )

    try:
        content = await generate_content(
            system=THEORY_SYSTEM_PROMPT,
            prompt=prompt,
        )

        theory.content = content.strip()
        theory.status = TheoryStatus.draft
        theory.updatedAt = datetime.now(timezone.utc)
        await theory.save()
        
    except Exception as e:
        print(f"[Worker Error] Theory generation failed for ID {theory_id}: {e}")
        await handle_theory_generation_failure(theory_id, f"Generation Stream Fault: {e}")
        raise e


# ==========================================
# PROMPT OPTIMIZATION EXECUTOR
# ==========================================
async def execute_prompt_optimization(message: dict) -> None:
    job_id = message["job_id"]
    
    job = await _fetch_with_retries(lambda: TempPromptJob.get(job_id), "Transient prompt tracker", job_id)
    if not job:
        raise NonRetryableJobError(f"Transient prompt tracker {job_id} missing or expired.")

    system_instruction = (
        "You are an expert prompt engineer. Take the user's unorganized notes, "
        "rough requirements, or messy copy-pastes about a topic and convert them into an optimized, "
        "highly clear markdown list of instructions. Use simple, everyday, accessible language. "
        "Ensure it tells the AI to explain basics cleanly, show memory layouts using descriptive text configurations, "
        "and provide working code block traces. Output ONLY the optimized markdown instructions. Do not include introductory text."
    )

    user_content = (
        f"Topic: {message['topic']}\n"
        f"Programming Code Language: {message.get('code_language') or 'Not specified'}\n"
        f"Rough Notes/Requirements:\n\"\"\"\n{message['instructions']}\n\"\"\""
    )

    try:
        optimized = await generate_content(
            system=system_instruction,
            prompt=user_content,
        )

        job.optimized_instructions = optimized.strip()
        job.status = TheoryStatus.final
        await job.save()

    except Exception as e:
        print(f"[Worker Error] Prompt optimization failed for Job ID {job_id}: {e}")
        await handle_prompt_optimization_failure(job_id, f"Prompt Optimization Stream Fault: {e}")
        raise e