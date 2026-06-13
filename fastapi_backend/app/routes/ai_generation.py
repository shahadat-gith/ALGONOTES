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
async def call_gemini_and_save_task(problem_id: int, user_id: int, prompt: str):
    """
    Runs in an isolated async context. Awaits Gemini's generation, 
    parses the content, and updates the database record. 
    Completely deletes the record if the generation process crashes.
    """
    async with async_session_maker() as session:
        try:
            # 1. Dispatch the asynchronous request to the Gemini API
            response = await ai_client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )

            note_data = json.loads(response.text) if response.text else {}
            
            # 2. Re-fetch the lock/placeholder note record inside this transaction context
            statement = select(Note).where(Note.problem_id == problem_id, Note.user_id == user_id)
            result = await session.execute(statement)
            note = result.scalar_one_or_none()

            if note:
                # Map structured data arrays safely
                note.bruteForce = note_data.get("bruteForce", [])
                note.optimalApproach = note_data.get("optimalApproach", [])
                note.algorithm = note_data.get("algorithm", [])
                note.dryRun = note_data.get("dryRun", [])
                note.edgeCases = note_data.get("edgeCases", [])
                
                # Flip state flag to unlock the frontend polling screen barrier
                note.status = "draft" 
                note.lastEditedAt = datetime.now(timezone.utc)

                # Force dirty-state flags since SQLAlchemy cannot natively track JSON mutation changes
                flag_modified(note, "bruteForce")
                flag_modified(note, "optimalApproach")
                flag_modified(note, "algorithm")
                flag_modified(note, "dryRun")
                flag_modified(note, "edgeCases")

                session.add(note)
                await session.commit()

        except Exception as e:
            print(f"Background AI generation failed for problem {problem_id}: {str(e)}")
            
            # 💡 CLEANUP IN CASE OF FAILURE: Purge the temporary shell record completely
            try:
                statement = select(Note).where(Note.problem_id == problem_id, Note.user_id == user_id)
                result = await session.execute(statement)
                note = result.scalar_one_or_none()
                
                if note:
                    await session.delete(note)
                    await session.commit()
                    print(f"Successfully purged invalid placeholder record for problem {problem_id}")
            except Exception as db_err:
                print(f"Failed to execute critical failure recovery deletion: {str(db_err)}")





# --- INTERACTIVE ROUTES ---

@router.post("/generate/{problem_id}", status_code=status.HTTP_202_ACCEPTED)
async def generate_ai_note(
    problem_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    # 1. Verify that the target problem exists and belongs to the authenticated user
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

    # 2. Strict Duplicate Prevention: Block execution if notes already exist for this problem
    note_statement = select(Note).where(Note.problem_id == problem_id, Note.user_id == current_user.id)
    note_result = await session.execute(note_statement)
    existing_note = note_result.scalar_one_or_none()

    if existing_note:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Notes have already been generated for this problem. Multiple generations are restricted."
        )

    # 3. Create a clean temporary processing shell record in the database
    # This acts as an API barrier and sets the state for your frontend polling hook
    new_note = Note(
        problem_id=problem_id,
        user_id=current_user.id,
        status="processing",
        bruteForce=[],
        optimalApproach=[],
        algorithm=[],
        dryRun=[],
        edgeCases=[]
    )

    session.add(new_note)
    await session.commit()
    await session.refresh(new_note)

    # 4. Generate the payload prompt context
    prompt = generate_note_prompt(problem)

    # 5. Offload task to run safely outside the HTTP response thread lifecycle
    asyncio.create_task(
        call_gemini_and_save_task(
            problem_id=problem_id,
            user_id=current_user.id,
            prompt=prompt
        )
    )

    # 6. Hand over control back to React instantly (Takes ~15ms)
    return {
        "success": True,
        "message": "AI assistant is now writing your study notes in the background.",
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

    # If the row doesn't exist (or was deleted by the background catch block on failure),
    # tell the frontend smoothly that nothing is active.
    if not note:
        return {
            "success": True,
            "status": "not_started",
            "draft": None
        }

    return {
        "success": True,
        "status": note.status,  # Will evaluate as "processing" or "draft"
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