from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlmodel import select, or_
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm.attributes import flag_modified

from app.models import User, Note
from app.services import upload_to_cloudinary, delete_from_cloudinary
from app.middlewares import get_current_user
from app.database import get_session


router = APIRouter(prefix="/users", tags=["Users Profile Deck"])


# ==========================================
# GET CURRENT USER DETAILS
# ==========================================
@router.get("/me")
async def get_current_user_details(
    current_user: User = Depends(get_current_user)
):
    sanitized_user = current_user.model_dump(
        exclude={
            "password",
            "forgotPasswordOptions",
            "verificationOptions"
        }
    )

    return {
        "success": True,
        "user": sanitized_user
    }


# ==========================================
# UPDATE PROFILE
# ==========================================
@router.put("/profile")
async def update_profile(
    name: Optional[str] = Form(None),
    username: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if username:
        clean_username = username.strip().lower()

        statement = select(User).where(
            User.username == clean_username,
            User.id != current_user.id
        )

        result = await session.execute(statement)

        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username is already taken by another profile."
            )

        current_user.username = clean_username

    if name:
        current_user.name = name.strip()

    if file:
        avatar_opts = dict(current_user.avatar or {})

        if avatar_opts.get("public_id"):
            await delete_from_cloudinary(avatar_opts["public_id"])

        upload_result = await upload_to_cloudinary(
            file,
            folder="algonotes/users"
        )

        img_url = (
            upload_result.get("secure_url")
            if isinstance(upload_result, dict)
            else getattr(upload_result, "secure_url", "")
        )

        img_id = (
            upload_result.get("public_id")
            if isinstance(upload_result, dict)
            else getattr(upload_result, "public_id", "")
        )

        current_user.avatar = {
            "url": img_url,
            "public_id": img_id
        }

        flag_modified(current_user, "avatar")

    session.add(current_user)
    await session.commit()
    await session.refresh(current_user)

    sanitized_user = current_user.model_dump(
        exclude={
            "password",
            "forgotPasswordOptions",
            "verificationOptions"
        }
    )

    return {
        "success": True,
        "message": "Profile updated successfully.",
        "user": sanitized_user
    }


# ==========================================
# GLOBAL WORKSPACE SEARCH UTILITY
# ==========================================
@router.get("/search")
async def search_workspace(
    q: str = "",
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not q:
        return {
            "success": True,
            "results": []
        }

    search_pattern = f"%{q}%"

    note_statement = (
        select(Note)
        .where(
            Note.user_id == current_user.id,
            Note.status != "processing",
            or_(
                Note.language.ilike(search_pattern),
                Note.problem["title"].astext.ilike(search_pattern),
                Note.problem["platform"].astext.ilike(search_pattern),
                Note.problem["difficulty"].astext.ilike(search_pattern)
            )
        )
        .order_by(Note.createdAt.desc())
        .limit(8)
    )

    note_results = await session.execute(note_statement)
    notes = note_results.scalars().all()

    formatted_notes = []

    for n in notes:
        problem = n.problem or {}
        note_content = n.note or {}

        title = problem.get("title") or "Untitled Problem"
        snippet = "Open Study Note"

        optimal_blocks = note_content.get("optimalApproach", [])
        summary_blocks = note_content.get("summary", [])
        intuition_blocks = note_content.get("intuition", [])

        if optimal_blocks:
            snippet = optimal_blocks[0].get("text") or optimal_blocks[0].get("code") or snippet
        elif summary_blocks:
            snippet = summary_blocks[0].get("text") or snippet
        elif intuition_blocks:
            snippet = intuition_blocks[0].get("text") or snippet

        formatted_notes.append(
            {
                "name": f"{title} Notes",
                "path": f"/notes/{n.noteId}",
                "type": "note",
                "desc": f"{snippet[:52]}..." if len(snippet) > 55 else snippet
            }
        )

    return {
        "success": True,
        "results": formatted_notes
    }