import json
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from pydantic import ValidationError
from google.genai import types

from app.models import User, Note
from app.models.note import NoteStatus
from app.schemas.note import (
    GenerateNoteRequest,
    ProblemDetailSchema,
    NoteContentSchema,
)
from app.constants.prompts import generate_note_prompt
from app.middlewares import get_current_user
from app.config import ai_client


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


async def handle_generation_failure(note_id: str, error_message: str):
    """Marks the processing note as failed instead of silently deleting it."""
    try:
        note = await Note.get(note_id)
        if note:
            note.status = NoteStatus.failed
            note.updatedAt = datetime.now(timezone.utc)
            await note.save()
            print(f"[AI Error] Note {note_id} marked as failed. Reason: {error_message}")
    except Exception as e:
        print(f"CRITICAL: Failed to mark note {note_id} as failed: {str(e)}")


async def call_gemini_and_save_task(
    note_id: str,
    user_id: Any,
    problem_link: str,
    user_code: str,
    language: str,
):
    try:
        prompt = generate_note_prompt(
            problem_link=problem_link,
            user_code=user_code,
            language=language,
        )

        # Non-blocking async API call to Gemini using the 2026 google-genai SDK
        response = await ai_client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            ),
        )

        if not response.text:
            raise ValueError("Gemini returned an empty response body.")

        ai_data = json.loads(response.text)

        # Strict validation checks against our optimized schemas
        validated_problem = ProblemDetailSchema(**ai_data.get("problem", {}))
        validated_note = NoteContentSchema(**ai_data.get("note", {}))

        note = await Note.get(note_id)
        if not note or note.user_id != user_id:
            return

        # Populating clean models—Pydantic configs drop any internal null fields
        note.problem = validated_problem
        note.note = validated_note
        note.status = NoteStatus.draft
        note.updatedAt = datetime.now(timezone.utc)

        await note.save()
        print(f"AI note generated successfully: {note_id}")

    except (json.JSONDecodeError, ValidationError, ValueError) as e:
        await handle_generation_failure(note_id, f"Validation/Parsing failed: {str(e)}")

    except Exception as e:
        await handle_generation_failure(note_id, f"Runtime generation exception: {str(e)}")


@router.post("/generate", status_code=status.HTTP_202_ACCEPTED, response_model=dict)
async def generate_ai_note(
    payload: GenerateNoteRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
):
    # Setup initial placeholder document
    new_note = Note(
        user_id=current_user.id,
        status=NoteStatus.processing,
        problem=ProblemDetailSchema(problemLink=payload.problemLink),
        note=NoteContentSchema(),
        language=payload.language,
        userCode=payload.userCode,
    )

    await new_note.insert()
    note_id = str(new_note.id)

    background_tasks.add_task(
        call_gemini_and_save_task,
        note_id=note_id,
        user_id=current_user.id,
        problem_link=payload.problemLink,
        user_code=payload.userCode,
        language=payload.language,
    )

    return {
        "success": True,
        "message": "AI note generation started.",
        "status": NoteStatus.processing,
        "id": note_id,
    }


@router.get("/status/{note_id}", response_model=dict)
async def check_note_generation_status(
    note_id: str,
    current_user: User = Depends(get_current_user),
):
    note = await Note.get(note_id)

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found."
        )

    if note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to requested note resource."
        )

    return {
        "success": True,
        "status": note.status,
        "id": str(note.id),
    }