import json
import asyncio
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm.attributes import flag_modified
from google.genai import types

from app.models import User, Problem, Note
from app.constants import generate_note_prompt
from app.middlewares import get_current_user
from app.database import get_session
from app.database.session import async_session_maker  
from app.config import ai_client

router = APIRouter(prefix="/ai", tags=["AI Note Generation Stream"])


# --- ASYNC BACKGROUND WORKER ---
async def call_gemini_and_save_task(problem_id: int, user_id: int, prompt: str, was_new_note: bool, original_status: str = "draft"):
    """
    Runs in an isolated async context. Awaits Gemini's generation, 
    parses the content, and updates the database record. Cleans up cleanly on failure.
    """
    async with async_session_maker() as session:
        try:
            response = await ai_client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )

            note_data = json.loads(response.text) if response.text else {}
            
            statement = select(Note).where(Note.problem_id == problem_id, Note.user_id == user_id)
            result = await session.execute(statement)
            note = result.scalar_one_or_none()

            if note:
                note.bruteForce = note_data.get("bruteForce", [])
                note.optimalApproach = note_data.get("optimalApproach", [])
                note.algorithm = note_data.get("algorithm", [])
                note.dryRun = note_data.get("dryRun", [])
                note.edgeCases = note_data.get("edgeCases", [])
                
                note.status = "draft" 
                note.lastEditedAt = datetime.now(timezone.utc)

                flag_modified(note, "bruteForce")
                flag_modified(note, "optimalApproach")
                flag_modified(note, "algorithm")
                flag_modified(note, "dryRun")
                flag_modified(note, "edgeCases")

                session.add(note)
                await session.commit()

        except Exception as e:
            print(f"Background AI generation failed for problem {problem_id}: {str(e)}")
            
            # 💡 THE FIX: Dynamic Database Cleanup / Rollback on Error
            try:
                statement = select(Note).where(Note.problem_id == problem_id, Note.user_id == user_id)
                result = await session.execute(statement)
                note = result.scalar_one_or_none()
                
                if note:
                    if was_new_note:
                        # If it was a brand new note shell, delete it completely so no junk entries remain
                        await session.delete(note)
                        print(f"Cleaned up temporary note record for problem {problem_id}")
                    else:
                        # If it was an existing note, restore its previous successful state
                        note.status = original_status
                        session.add(note)
                        print(f"Rolled back note record status to '{original_status}' for problem {problem_id}")
                    
                    await session.commit()
            except Exception as db_err:
                print(f"Failed to execute failure recovery transaction: {str(db_err)}")


# --- INTERACTIVE ROUTES ---

@router.post("/generate/{problem_id}", status_code=status.HTTP_202_ACCEPTED)
async def generate_ai_note(
    problem_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Smart unified endpoint. Handles initial generation and regenerations smoothly,
    tracking previous states to support structural rollbacks on background failures.
    """
    # 1. Verify problem presence
    statement = select(Problem).where(
        Problem.id == problem_id,
        Problem.user_id == current_user.id
    )
    result = await session.execute(statement)
    problem = result.scalar_one_or_none()

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem reference not found."
        )

    # 2. Check if a note already exists
    note_statement = select(Note).where(Note.problem_id == problem_id, Note.user_id == current_user.id)
    note_result = await session.execute(note_statement)
    note = note_result.scalar_one_or_none()

    was_new_note = note is None
    original_status = "draft" if was_new_note else note.status

    if was_new_note:
        # Create temporary processing shell
        note = Note(
            problem_id=problem_id,
            user_id=current_user.id,
            status="processing",
            bruteForce=[],
            optimalApproach=[],
            algorithm=[],
            dryRun=[],
            edgeCases=[]
        )
    else:
        # Set existing note back to processing state
        note.status = "processing"

    session.add(note)
    await session.commit()
    await session.refresh(note)

    prompt = generate_note_prompt(problem)

    # 3. Offload task with tracking flags
    asyncio.create_task(
        call_gemini_and_save_task(
            problem_id,
            current_user.id,
            prompt,
            was_new_note=was_new_note,
            original_status=original_status
        )
    )

    return {
        "success": True,
        "message": "AI assistant is now writing your notes in the background.",
        "status": "processing"
    }


@router.get("/status/{problem_id}")
async def check_note_generation_status(
    problem_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Fast status polling route for the frontend loading screen.
    """
    statement = select(Note).where(
        Note.problem_id == problem_id,
        Note.user_id == current_user.id
    )
    result = await session.execute(statement)
    note = result.scalar_one_or_none()

    # If row was deleted due to background failure, notify frontend smoothly
    if not note:
        return {
            "success": True,
            "status": "not_started",
            "draft": None
        }

    return {
        "success": True,
        "status": note.status,  # "processing", "draft", or "failed"
        "draft": {
            "problem_id": problem_id,
            "user_id": current_user.id,
            "bruteForce": note.bruteForce,
            "optimalApproach": note.optimalApproach,
            "algorithm": note.algorithm,
            "dryRun": note.dryRun,
            "edgeCases": note.edgeCases,
            "status": note.status
        } if note.status == "draft" else None
    }