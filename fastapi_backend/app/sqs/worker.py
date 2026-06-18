import asyncio
import json
from datetime import datetime, timezone

from beanie import PydanticObjectId
from google.genai import types
from google.genai import Client  # Import the Client class to safely instantiate per loop context

from app.prompts import generate_note_prompt, generate_theory_prompt
from app.models import Note, Theory
from app.models.note import NoteStatus
from app.models.theory import TheoryStatus, TempPromptJob
from app.schemas.note import ProblemDetailSchema, NoteContentSchema

from .handle_failures import (
    handle_note_generation_failure, 
    handle_theory_generation_failure,
    handle_prompt_optimization_failure
)


# ==========================================
# DSA NOTES GENERATOR EXECUTOR
# ==========================================
async def execute_note_generation(message: dict):
    note_id = message["note_id"]
    user_id = PydanticObjectId(message["user_id"])

    note = await Note.get(note_id)
    if not note:
        raise ValueError(f"Note {note_id} missing completely from MongoDB.")

    if note.user_id != user_id:
        await handle_note_generation_failure(note_id, "User identifier verification mismatch.")
        return

    prompt = generate_note_prompt(
        problem_link=message["problemLink"],
        userCode=message["userCode"],
        language=message["language"],
        userNotes=message.get("userNotes", ""),
    )

    # Local instantiation guarantees capturing the live event loop in Lambda contexts
    ai_client = Client()

    response = await ai_client.aio.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )

    if not response.text:
        raise ValueError("Gemini engine interface returned an empty text string container.")

    ai_data = json.loads(response.text)
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
    print(f"[Worker Pipeline] DSA Note processed and saved successfully: {note_id}")


# ==========================================
# THEORY GENERATOR EXECUTOR
# ==========================================
async def execute_theory_generation(message: dict):
    theory_id = message["theory_id"]
    user_id = PydanticObjectId(message["user_id"])

    theory = await Theory.get(theory_id)
    if not theory:
        raise ValueError(f"Theory record {theory_id} missing completely from MongoDB.")

    if theory.user_id != user_id:
        await handle_theory_generation_failure(theory_id, "User identifier verification mismatch.")
        return

    prompt = generate_theory_prompt(
        topic=message["topic"],
        code_language=message.get("code_language", "C++"),
        instructions=message.get("instructions") 
    )

    try:
        # Local instantiation to resolve closed loop re-use crashes
        ai_client = Client()

        response = await ai_client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        if not response.text:
            raise ValueError("Gemini engine interface returned an empty text string container.")

        theory.content = response.text.strip()
        theory.status = TheoryStatus.draft
        theory.updatedAt = datetime.now(timezone.utc)
        await theory.save()
        print(f"[Worker Pipeline] Theory note processed and saved successfully: {theory_id}")
        
    except Exception as e:
        await handle_theory_generation_failure(theory_id, f"Generation Stream Fault: {str(e)}")


# ==========================================
# PROMPT OPTIMIZATION EXECUTOR
# ==========================================
async def execute_prompt_optimization(message: dict):
    job_id = message["job_id"]
    
    job = await TempPromptJob.get(job_id)
    if not job:
        raise ValueError(f"Transient prompt tracker {job_id} missing or expired.")

    system_instruction = (
        "You are an expert prompt engineer. Take the user's unorganized notes, "
        "rough requirements, or messy copy-pastes about a topic and convert them into an optimized, "
        "highly clear markdown list of instructions. Use simple, everyday, accessible language. "
        "Ensure it tells the AI to explain basics cleanly, show memory layouts using descriptive text configurations, "
        "and provide working code block traces. Output ONLY the optimized markdown instructions. Do not include introductory text."
    )

    user_content = (
        f"Topic: {message['topic']}\n"
        f"Programming Code Language: {message['code_language']}\n"
        f"Rough Notes/Requirements:\n\"\"\"\n{message['instructions']}\n\"\"\""
    )

    try:
        # Initializing client right within the scope block maps perfectly to the currently alive runtime loop
        ai_client = Client()

        response = await ai_client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_content,
            config=types.GenerateContentConfig(system_instruction=system_instruction)
        )

        if not response.text:
            raise ValueError("Gemini interface engine returned an empty prompt response string context.")

        job.optimized_instructions = response.text.strip()
        job.status = TheoryStatus.final
        await job.save()
        print(f"[Worker Pipeline] Prompt optimization complete for transient job: {job_id}")

    except Exception as e:
        await handle_prompt_optimization_failure(job_id, f"Prompt Optimization Stream Fault: {str(e)}")