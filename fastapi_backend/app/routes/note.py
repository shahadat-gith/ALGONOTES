from math import ceil
from datetime import datetime, timezone
from typing import Optional 

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query, status
from sqlmodel import select, func, or_  
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm.attributes import flag_modified

from app.models import User, Note
from app.schemas import SaveNoteRequest
from app.middlewares import get_current_user
from app.database import get_session


router = APIRouter(prefix="/notes", tags=["Study Notes Management"])


# ==========================================
# UPDATE NOTE
# ==========================================
@router.put("/{note_id}")
async def update_note(
    note_id: str,
    payload: SaveNoteRequest,
    background_tasks: BackgroundTasks,
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
            detail="Note not found.",
        )

    # Encapsulates the complete payload sent from your schemas
    note.problem = payload.problem.model_dump()
    note.note = payload.note.model_dump()
    note.language = payload.language
    note.userCode = payload.userCode
    note.status = payload.status
    note.lastEditedAt = datetime.now(timezone.utc)

    flag_modified(note, "problem")
    flag_modified(note, "note")

    session.add(note)
    await session.commit()
    await session.refresh(note)

    return {
        "success": True,
        "message": f"Note updated successfully as {note.status}.",
        "note": note,
    }




@router.get("/user")
async def get_all_notes_by_user(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=50),
    search: Optional[str] = Query(default=None, description="Search term for notes"),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    offset_value = (page - 1) * size

    # 1. Base query requirements
    base_filters = [
        Note.user_id == current_user.id,
        Note.status != "processing"
    ]

    # 2. Add search parameters dynamically using SQL iLike pattern matches
    if search:
        search_pattern = f"%{search}%"
        base_filters.append(
            or_(
                Note.language.ilike(search_pattern),
                # Extracts values from JSONB layout maps safely to apply partial string matches
                Note.problem["title"].astext.ilike(search_pattern),
                Note.problem["platform"].astext.ilike(search_pattern),
                Note.problem["difficulty"].astext.ilike(search_pattern)
            )
        )

    # 3. Calculate accurate total items count matching search filters
    count_statement = select(func.count()).select_from(Note).where(*base_filters)
    count_result = await session.execute(count_statement)
    total_items = count_result.scalar() or 0

    # 4. Fetch the paginated dataset slice matching criteria from Supabase
    data_statement = (
        select(Note)
        .where(*base_filters)
        .order_by(Note.createdAt.desc())
        .offset(offset_value)
        .limit(size)
    )
    result = await session.execute(data_statement)
    notes = result.scalars().all()

    formatted_notes = []
    for note in notes:
        formatted_notes.append({
            "id": note.id,
            "noteId": note.noteId,
            "status": note.status,
            "language": note.language,
            "problem": {
                "title": note.problem.get("title", ""),
                "platform": note.problem.get("platform", ""),
                "difficulty": note.problem.get("difficulty", ""),
                "problemLink": note.problem.get("problemLink", ""),
                "topics": note.problem.get("topics", []),
            },
            "createdAt": note.createdAt,
            "lastEditedAt": note.lastEditedAt,
        })

    total_pages = ceil(total_items / size) if total_items > 0 else 1

    return {
        "success": True,
        "notes": formatted_notes,
        "pagination": {
            "totalItems": total_items,
            "totalPages": total_pages,
            "currentPage": page,
            "pageSize": size,
            "hasNext": page < total_pages,
            "hasPrevious": page > 1
        }
    }

# ==========================================
# GET SINGLE NOTE DETAILS (Returns All Data)
# ==========================================
@router.get("/{note_id}")
async def get_note_by_note_id(
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
            detail="Note not found.",
        )

    # Inform client to stay on loading/polling state if still cooking
    if note.status == "processing":
        raise HTTPException(
            status_code=status.HTTP_202_ACCEPTED,
            detail="Note generation task is still processing."
        )
        
    if note.status == "failed":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="AI generation failed for this problem."
        )

    # Returns entire model including raw testCases, constraints, note lists, descriptions
    return {
        "success": True,
        "note": note, 
    }


# ==========================================
# DELETE NOTE
# ==========================================
@router.delete("/{note_id}")
async def delete_note(
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
            detail="Note not found.",
        )

    await session.delete(note)
    await session.commit()

    return {
        "success": True,
        "message": "Note deleted successfully.",
    }