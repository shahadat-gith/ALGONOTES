# app/routes/note.py

from math import ceil
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.models import User, Note
from app.models.note import NoteStatus
from app.schemas.note import NoteResponse, NoteUpdate, NoteContentUpdate
from app.middlewares import get_current_user


router = APIRouter(
    prefix="/notes",
    tags=["Study Notes"]
)


@router.put("/{note_id}", response_model=dict)
async def update_note(
    note_id: str,
    payload: NoteUpdate,  # Upgraded to our clean partial update schema
    current_user: User = Depends(get_current_user),
):
    note = await Note.get(note_id)

    if not note or note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found.",
        )

    # Apply top-level field updates dynamically if provided
    if payload.status is not None:
        note.status = payload.status
    if payload.problem is not None:
        note.problem = payload.problem
    if payload.language is not None:
        note.language = payload.language
    if payload.userCode is not None:
        note.userCode = payload.userCode

    # Elegant deep partial patching for the embedded note contents
    if payload.note is not None:
        update_data = payload.note.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(note.note, key, value)

    note.updatedAt = datetime.now(timezone.utc)
    await note.save()

    return {
        "success": True,
        "message": f"Note updated successfully as {note.status}.",
        # Leveraging Pydantic validation cleanly on return
        "note": NoteResponse.model_validate(note)
    }


@router.get("/user", response_model=dict)
async def get_all_notes_by_user(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=50),
    search: Optional[str] = Query(default=None),
    current_user: User = Depends(get_current_user),
):
    skip = (page - 1) * size

    # Type-safe Beanie query targeting native fields/enums
    find_query = Note.find(
        Note.user_id == current_user.id,
        In(Note.status, [NoteStatus.draft, NoteStatus.final])
    )

    # Integrate text-search cleanly if provided
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
        # Auto-serializes structural arrays using Pydantic, purging null blocks instantly
        "notes": [NoteResponse.model_validate(note) for note in notes],
        "pagination": {
            "totalItems": total_items,
            "totalPages": total_pages,
            "currentPage": page,
            "pageSize": size,
            "hasNext": page < total_pages,
            "hasPrevious": page > 1,
        },
    }


@router.get("/{note_id}", response_model=dict)
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

    # Use the programmatic Enum value for verification safety
    if note.status == NoteStatus.processing:
        raise HTTPException(
            status_code=status.HTTP_202_ACCEPTED,
            detail="Note generation is still processing.",
        )

    return {
        "success": True,
        "note": NoteResponse.model_validate(note),
    }


@router.delete("/{note_id}", response_model=dict)
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

# Helper mapping import for Beanie query structures
from beanie.operators import In