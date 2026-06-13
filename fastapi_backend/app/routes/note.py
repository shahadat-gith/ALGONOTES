import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy.orm import selectinload
from google.genai import types

from app.models import User, Problem, Note
from app.schemas import SaveNoteRequest
from app.constants import generate_note_prompt
from app.utils import track_user_activity_task
from app.middlewares import get_current_user
from app.database import get_session
from app.config import ai_client


router = APIRouter(prefix="/notes", tags=["AI Study Notes Generator"])


@router.post("/generate/{problem_id}")
async def generate_ai_note(
    problem_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
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

    prompt = generate_note_prompt(problem)

    try:
        response = await ai_client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        note_data = json.loads(response.text) if response.text else {}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI Engine failure parsing generation blocks: {str(e)}"
        )

    return {
        "success": True,
        "message": "Study notes drafted successfully via AI engine.",
        "draft": {
            "problem_id": problem_id,
            "user_id": current_user.id,
            **note_data,
            "status": "draft"
        }
    }


@router.post("/save")
async def save_note(
    payload: SaveNoteRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not payload.problem_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Problem id is missing."
        )

    problem_statement = select(Problem).where(
        Problem.id == payload.problem_id,
        Problem.user_id == current_user.id
    )
    problem_result = await session.execute(problem_statement)
    if not problem_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem reference not found."
        )

    note_statement = select(Note).where(
        Note.problem_id == payload.problem_id,
        Note.user_id == current_user.id
    )
    note_result = await session.execute(note_statement)
    note = note_result.scalar_one_or_none()
    
    is_new_note = note is None

    if is_new_note:
        note = Note(
            problem_id=payload.problem_id,
            user_id=current_user.id
        )

    note.bruteForce = [block.model_dump() for block in payload.bruteForce]
    note.optimalApproach = [block.model_dump() for block in payload.optimalApproach]
    note.algorithm = [step.model_dump() for step in payload.algorithm]
    note.dryRun = [step.model_dump() for step in payload.dryRun]
    note.edgeCases = [case.model_dump() for case in payload.edgeCases]

    note.status = payload.status or "draft"
    note.lastEditedAt = datetime.now(timezone.utc)

    if not is_new_note:
        flag_modified(note, "bruteForce")
        flag_modified(note, "optimalApproach")
        flag_modified(note, "algorithm")
        flag_modified(note, "dryRun")
        flag_modified(note, "edgeCases")

    session.add(note)
    await session.commit()
    await session.refresh(note)

    # Calling the background task runner wrapper
    if is_new_note:
        background_tasks.add_task(
            track_user_activity_task,  # <-- Using the wrapper
            current_user.id, 
            "note"
        )

    return {
        "success": True,
        "message": f"Note saved successfully as a {note.status}.",
        "note": note
    }




@router.get("/user")
async def get_all_notes_by_user(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    statement = (
        select(Note)
        .where(Note.user_id == current_user.id)
        .options(selectinload(Note.problem))
        .order_by(Note.createdAt.desc())
    )

    results = await session.execute(statement)
    notes = results.scalars().all()

    formatted_notes = []

    for n in notes:
        note_dict = n.model_dump()

        if n.problem:
            note_dict["problem"] = {
                "id": n.problem.id,
                "title": n.problem.title,
                "platform": n.problem.platform,
                "difficulty": n.problem.difficulty,
                "language": n.problem.language
            }

        formatted_notes.append(note_dict)

    return {
        "success": True,
        "count": len(formatted_notes),
        "notes": formatted_notes
    }


@router.post("/regenerate/{problem_id}")
async def regenerate_ai_note(
    problem_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    problem_stmt = select(Problem).where(
        Problem.id == problem_id,
        Problem.user_id == current_user.id
    )

    p_result = await session.execute(problem_stmt)
    problem = p_result.scalar_one_or_none()

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem entry reference not found."
        )

    update_prompt = generate_note_prompt(problem)

    try:
        response = await ai_client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=update_prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        refreshed_note_data = json.loads(response.text) if response.text else {}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI Engine failure parsing generation blocks: {str(e)}"
        )

    note_stmt = select(Note).where(
        Note.problem_id == problem_id,
        Note.user_id == current_user.id
    )

    n_result = await session.execute(note_stmt)
    note = n_result.scalar_one_or_none()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No existing note record was found to update. Try generating a draft instead."
        )

    note.bruteForce = refreshed_note_data.get("bruteForce", [])
    note.optimalApproach = refreshed_note_data.get("optimalApproach", [])
    note.algorithm = refreshed_note_data.get("algorithm", [])
    note.dryRun = refreshed_note_data.get("dryRun", [])
    note.edgeCases = refreshed_note_data.get("edgeCases", [])
    note.lastEditedAt = datetime.utcnow()

    flag_modified(note, "bruteForce")
    flag_modified(note, "optimalApproach")
    flag_modified(note, "algorithm")
    flag_modified(note, "dryRun")
    flag_modified(note, "edgeCases")

    session.add(note)
    await session.commit()
    await session.refresh(note)

    return {
        "success": True,
        "message": "AI study block successfully updated and synchronized.",
        "note": note
    }


@router.get("/{problem_id}")
async def get_note_by_problem(
    problem_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    statement = select(Note).where(
        Note.problem_id == problem_id,
        Note.user_id == current_user.id
    )

    result = await session.execute(statement)
    note = result.scalar_one_or_none()

    if not note:
        return {
            "success": False,
            "message": "No saved notes exist yet for this specified execution item.",
            "note": None
        }

    return {
        "success": True,
        "note": note
    }




@router.get("/{note_id}")
async def get_note_by_id(
    note_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    query = select(Note).where(
        Note.id == note_id,
        Note.user_id == current_user.id
    )

    result = await session.execute(query)
    note = result.scalar_one_or_none()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    return {
        "success": True,
        "note": note
    }