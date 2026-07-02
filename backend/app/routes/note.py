from math import ceil
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from beanie.operators import In

from app.models import User, Note
from app.models.note import NoteStatus
from app.schemas.note import (
    NoteResponse, 
    NoteUpdate, 
    GenerateNoteRequest, 
    ProblemDetailSchema, 
    NoteContentSchema
)
from app.middlewares import get_current_user
from app.sqs import enqueue_note_generation

router = APIRouter(
    prefix="/notes",
    tags=["Study Notes"]
)

# ==========================================
# AI GENERATION ACTIONS
# ==========================================

@router.post("/generate", status_code=status.HTTP_202_ACCEPTED, tags=["AI Actions"])
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
        userNotes=payload.userNotes,
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )

    await new_note.insert()
    note_id = str(new_note.id)

    try:
        await enqueue_note_generation(
            note_id=note_id,
            user_id=current_user.id,
            problem_link=payload.problemLink,
            language=payload.language,
            user_notes=payload.userNotes,
        )

    except Exception:
        await new_note.delete()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to queue AI generation job.",
        )

    return {
        "success": True,
        "message": "AI note generation queued.",
        "status": NoteStatus.processing,
        "id": note_id,
    }


@router.get("/status/{note_id}", tags=["AI Actions"])
async def check_note_generation_status(
    note_id: str,
    current_user: User = Depends(get_current_user),
):
    note = await Note.get(note_id)

    if not note or note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found.",
        )

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


# ==========================================
# STANDARD CRUD OPERATIONS
# ==========================================

@router.get("/user", response_model=dict, tags=["Coding Notes"])
async def get_all_notes_by_user(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=50),
    search: Optional[str] = Query(default=None),
    current_user: User = Depends(get_current_user),
):
    skip = (page - 1) * size

    find_query = Note.find(
        Note.user_id == current_user.id,
        In(Note.status, [NoteStatus.draft, NoteStatus.final])
    )

    if search and search.strip():
        term = search.strip()
        find_query = find_query.find({
            "$or": [
                {"language": {"$regex": term, "$options": "i"}},
                {"problem.title": {"$regex": term, "$options": "i"}},
                {"problem.platform": {"$regex": term, "$options": "i"}},
                {"problem.difficulty": {"$regex": term, "$options": "i"}},
            ]
        })

    total_items = await find_query.count()
    notes = await (
        find_query
        .sort(-Note.createdAt)
        .skip(skip)
        .limit(size)
        .to_list()
    )

    total_pages = ceil(total_items / size) if total_items else 1

    return {
        "success": True,
        # Corrected: Explicitly serializes using by_alias=True to preserve '_id' strings in the array list mapping frame
        "notes": [NoteResponse.model_validate(note).model_dump(by_alias=True) for note in notes],
        "pagination": {
            "totalItems": total_items,
            "totalPages": total_pages,
            "currentPage": page,
            "pageSize": size,
            "hasNext": page < total_pages,
            "hasPrevious": page > 1,
        },
    }


@router.get("/{note_id}", response_model=dict, tags=["Coding Notes"])
async def get_note_by_note_id(
    note_id: str,
    current_user: User = Depends(get_current_user),
):
    note = await Note.get(note_id)

    if not note or note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found.",
        )

    if note.status == NoteStatus.processing:
        raise HTTPException(
            status_code=status.HTTP_202_ACCEPTED,
            detail="Note generation is still processing.",
        )

    return {
        "success": True,
        # Corrected: Serialized explicitly with alias constraints
        "note": NoteResponse.model_validate(note).model_dump(by_alias=True),
    }


@router.put("/{note_id}", response_model=dict, tags=["Coding Notes"])
async def update_note(
    note_id: str,
    payload: NoteUpdate,
    current_user: User = Depends(get_current_user),
):
    note = await Note.get(note_id)

    if not note or note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found.",
        )

    if payload.status is not None:
        note.status = payload.status
    if payload.problem is not None:
        note.problem = payload.problem
    if payload.language is not None:
        note.language = payload.language
    if payload.userCode is not None:
        note.userCode = payload.userCode
    if payload.userNotes is not None:
        note.userNotes = payload.userNotes

    if payload.note is not None:
        update_data = payload.note.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(note.note, key, value)

    note.updatedAt = datetime.now(timezone.utc)
    await note.save()

    return {
        "success": True,
        "message": f"Note updated successfully as {note.status}.",
        # Corrected: Serialized explicitly with alias constraints
        "note": NoteResponse.model_validate(note).model_dump(by_alias=True)
    }


@router.delete("/{note_id}", response_model=dict, tags=["Coding Notes"])
async def delete_note(
    note_id: str,
    current_user: User = Depends(get_current_user),
):
    note = await Note.get(note_id)

    if not note or note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found.",
        )

    await note.delete()

    return {
        "success": True,
        "message": "Note deleted successfully.",
    }