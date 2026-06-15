import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlmodel import select, delete
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm.attributes import flag_modified
from pydantic import ValidationError
from google.genai import types

from app.models import User, Note
from app.schemas import GenerateNoteRequest
from app.schemas.note import ProblemDetailSchema, NoteContentSchema
from app.constants import generate_note_prompt
from app.middlewares import get_current_user
from app.database import get_session
from app.database.session import async_session_maker
from app.config import ai_client


router = APIRouter(prefix="/ai", tags=["AI Note Generation"])


# ==========================================
# BACKGROUND AI WORKER
# ==========================================

async def call_gemini_and_save_task(
    note_id: str,
    user_id: int,
    problem_link: str,
    user_code: str,
    language: str,
):
    async with async_session_maker() as session:
        try:
            prompt = generate_note_prompt(
                problem_link=problem_link,
                user_code=user_code,
                language=language,
            )

            response = await ai_client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                ),
            )

            ai_data = json.loads(response.text) if response.text else {}

            validated_problem = ProblemDetailSchema(**ai_data.get("problem", {}))
            validated_note = NoteContentSchema(**ai_data.get("note", {}))

            problem_data = validated_problem.model_dump()
            note_data = validated_note.model_dump()

            statement = select(Note).where(
                Note.noteId == note_id,
                Note.user_id == user_id,
            )

            result = await session.execute(statement)
            note = result.scalar_one_or_none()

            if not note:
                return

            note.problem = problem_data
            note.note = note_data
            note.status = "draft"
            note.lastEditedAt = datetime.now(timezone.utc)

            flag_modified(note, "problem")
            flag_modified(note, "note")

            session.add(note)
            await session.commit()

        except (json.JSONDecodeError, ValidationError) as parse_err:
            print(
                f"LLM structural parsing validation failed for note {note_id}: "
                f"{str(parse_err)}"
            )
            await session.rollback()
            await _delete_failed_note(note_id, user_id)

        except Exception as e:
            print(f"AI generation pipeline failed for note {note_id}: {str(e)}")
            await session.rollback()
            await _delete_failed_note(note_id, user_id)


async def _delete_failed_note(note_id: str, user_id: int):
    async with async_session_maker() as session:
        try:
            stmt = delete(Note).where(
                Note.noteId == note_id,
                Note.user_id == user_id,
            )

            await session.execute(stmt)
            await session.commit()

            print(f"Deleted failed note entry: {note_id}")

        except Exception as db_err:
            await session.rollback()
            print(f"Critical: failed to delete failed note {note_id}: {str(db_err)}")


# ==========================================
# GENERATE NOTE
# ==========================================

@router.post("/generate", status_code=status.HTTP_202_ACCEPTED)
async def generate_ai_note(
    payload: GenerateNoteRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    placeholder_problem = ProblemDetailSchema(
        problemLink=payload.problemLink
    ).model_dump()

    new_note = Note(
        user_id=current_user.id,
        status="processing",
        problem=placeholder_problem,
        note={},
        language=payload.language,
        userCode=payload.userCode,
    )

    session.add(new_note)
    await session.commit()
    await session.refresh(new_note)

    background_tasks.add_task(
        call_gemini_and_save_task,
        note_id=new_note.noteId,
        user_id=current_user.id,
        problem_link=payload.problemLink,
        user_code=payload.userCode,
        language=payload.language,
    )

    return {
        "success": True,
        "message": "AI note generation started.",
        "status": "processing",
        "noteId": new_note.noteId,
    }


# ==========================================
# CHECK GENERATION STATUS
# ==========================================

@router.get("/status/{note_id}")
async def check_note_generation_status(
    note_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    statement = select(Note).where(
        Note.noteId == note_id,
        Note.user_id == current_user.id,
    )

    result = await session.execute(statement)
    note = result.scalar_one_or_none()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    return {
        "success": True,
        "status": note.status,
    }