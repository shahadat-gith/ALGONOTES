# app/sqs/worker.py

import asyncio
import json
from datetime import datetime, timezone

from beanie import PydanticObjectId
from google.genai import types

from app.config import ai_client
from app.prompts import generate_note_prompt, generate_theory_prompt
from app.models import Note, Theory
from app.models.note import NoteStatus
from app.models.theory import TheoryStatus
from app.schemas.note import ProblemDetailSchema, NoteContentSchema

from .handle_failures import handle_note_generation_failure, handle_theory_generation_failure


# ==========================================
# DSA NOTES EXECUTION PIPELINE
# ==========================================
async def execute_note_generation(message: dict):
    """
    Processes raw coding code inputs, passes instructions to Gemini,
    and updates the core database document with structured analysis metrics.
    """
    note_id = message["note_id"]
    user_id = PydanticObjectId(message["user_id"])

    # --- RACE CONDITION BUFFER ENGINE ---
    note = None
    retries = 3
    for attempt in range(retries):
        note = await Note.get(note_id)
        if note:
            break
        if attempt < retries - 1:
            print(f"[Worker Buffer] Note {note_id} not found in DB yet. Retrying in 1s... ({attempt + 1}/{retries})")
            await asyncio.sleep(1)

    if not note:
        raise ValueError(f"Note {note_id} missing completely from MongoDB collections after verification retries.")
    # ------------------------------------

    if note.user_id != user_id:
        await handle_note_generation_failure(note_id, "User identifier verification mismatch.")
        return

    # Call the clean, separate prompt module file logic
    prompt = generate_note_prompt(
        problem_link=message["problemLink"],
        userCode=message["userCode"],
        language=message["language"],
        userNotes=message.get("userNotes", ""),
    )

    response = await ai_client.aio.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )

    if not response.text:
        raise ValueError("Gemini engine interface returned an empty text string container.")

    ai_data = json.loads(response.text)
    note_json = ai_data.get("note", {})
    
    # Safely map decoupled data maps into defined model entities
    note.problem = ProblemDetailSchema(**ai_data.get("problem", {}))
    
    # Explicit mapping fallback logic completely isolates summary key fields away from validation runs
    note.note = NoteContentSchema(
        intuition=note_json.get("intuition", ""),
        edgeCases=note_json.get("edgeCases", []),
        mistakesToAvoid=note_json.get("mistakesToAvoid", []),
        dryRun=note_json.get("dryRun", []),
        bruteForce=note_json.get("bruteForce"),
        better=note_json.get("better"),
        optimalApproach=note_json.get("optimalApproach")
    )
    
    # Save the expanded layman translation cleanly to root level property
    note.userNotes = ai_data.get("userNotes", "").strip()
    
    note.status = NoteStatus.draft
    note.updatedAt = datetime.now(timezone.utc)
    await note.save()
    print(f"[Worker Pipeline] DSA Note processed and saved successfully: {note_id}")


# ==========================================
# THEORY NOTES EXECUTION PIPELINE
# ==========================================
async def execute_theory_generation(message: dict):
    """
    Generates rigorous academic masterclass study guides over core subjects 
    and saves output records onto targeted MongoDB collections fields.
    """
    theory_id = message["theory_id"]
    user_id = PydanticObjectId(message["user_id"])

    # --- RACE CONDITION BUFFER ENGINE ---
    theory = None
    retries = 3
    for attempt in range(retries):
        theory = await Theory.get(theory_id)
        if theory:
            break
        if attempt < retries - 1:
            print(f"[Worker Buffer] Theory {theory_id} not found in DB yet. Retrying in 1s... ({attempt + 1}/{retries})")
            await asyncio.sleep(1)

    if not theory:
        raise ValueError(f"Theory record {theory_id} missing completely from MongoDB collections after verification retries.")
    # ------------------------------------

    if theory.user_id != user_id:
        await handle_theory_generation_failure(theory_id, "User identifier verification mismatch.")
        return

    # Call the clean, separate theory prompt file logic
    prompt = generate_theory_prompt(topic=message["topic"])

    response = await ai_client.aio.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )

    if not response.text:
        raise ValueError("Gemini engine interface returned an empty text string container.")

    ai_data = json.loads(response.text)
    
    theory.content = ai_data.get("content", "")
    theory.status = TheoryStatus.draft
    theory.updatedAt = datetime.now(timezone.utc)
    await theory.save()
    print(f"[Worker Pipeline] CS Theory Guide processed and saved successfully: {theory_id}")