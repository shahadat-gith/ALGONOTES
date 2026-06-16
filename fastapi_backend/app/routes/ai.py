# app/routes/ai.py

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.models import User, Note
from app.models.note import NoteStatus
from app.schemas.note import GenerateNoteRequest, ProblemDetailSchema, NoteContentSchema
from app.middlewares import get_current_user
from app.services import send_ai_generation_job


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


@router.post("/generate", status_code=status.HTTP_202_ACCEPTED)
async def generate_ai_note(
    payload: GenerateNoteRequest,
    current_user: User = Depends(get_current_user),
):
    new_note = Note(
        user_id=current_user.id,
        status=NoteStatus.processing,
        problem=ProblemDetailSchema(problemLink=payload.problemLink),
        note=NoteContentSchema(),
        language=payload.language,
        userCode=payload.userCode,
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )

    await new_note.insert()

    note_id = str(new_note.id)

    try:
        send_ai_generation_job(
            note_id=note_id,
            user_id=str(current_user.id),
            problem_link=payload.problemLink,
            user_code=payload.userCode,
            language=payload.language,
        )

    except Exception:
        await new_note.delete()

        raise HTTPException(
            status_code=500,
            detail="Failed to queue AI generation job.",
        )

    return {
        "success": True,
        "message": "AI note generation queued.",
        "status": NoteStatus.processing,
        "id": note_id,
    }






@router.get("/status/{note_id}")
async def check_note_generation_status(
    note_id: str,
    current_user: User = Depends(get_current_user),
):
    note = await Note.get(note_id)

    if not note or note.user_id != current_user.id:
        raise HTTPException(
            status_code=404,
            detail="Note not found.",
        )

    # If the background worker marked it as failed, attach a helpful message
    if note.status == NoteStatus.failed:
        return {
            "success": True,
            "status": "failed",
            "message": "AI is currently experiencing high demand. Please try again in a few minutes.",
            "id": str(note.id),
        }

    return {
        "success": True,
        "status": note.status,
        "id": str(note.id),
    }