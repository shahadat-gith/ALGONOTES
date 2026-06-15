# app/routes/user.py

from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form

from app.models import User, Note
from app.schemas.user import UserResponse
from app.services import upload_to_cloudinary, delete_from_cloudinary
from app.middlewares import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


def serialize_user(user: User) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        username=user.username,
        avatar={
            "url": user.avatar.url,
            "public_id": user.avatar.public_id,
        },
        verificationOptions={
            "status": user.verificationOptions.status,
        }
    )


@router.get("/me")
async def get_current_user_details(
    current_user: User = Depends(get_current_user)
):
    return {
        "success": True,
        "user": serialize_user(current_user)
    }


@router.put("/profile")
async def update_profile(
    name: Optional[str] = Form(None),
    username: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user)
):
    if username:
        clean_username = username.strip().lower()

        existing_user = await User.find_one(
            User.username == clean_username,
            User.id != current_user.id
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already taken."
            )

        current_user.username = clean_username

    if name:
        current_user.name = name.strip()

    if file:
        if current_user.avatar.public_id:
            await delete_from_cloudinary(
                current_user.avatar.public_id
            )

        upload_result = await upload_to_cloudinary(
            file,
            folder="algonotes/users"
        )

        current_user.avatar.url = upload_result.get("secure_url", "")
        current_user.avatar.public_id = upload_result.get("public_id", "")

    current_user.updatedAt = datetime.now(timezone.utc)
    await current_user.save()

    return {
        "success": True,
        "message": "Profile updated successfully.",
        "user": serialize_user(current_user)
    }


@router.get("/search")
async def search_workspace(
    q: str = "",
    current_user: User = Depends(get_current_user)
):
    if not q.strip():
        return {
            "success": True,
            "results": []
        }

    search_regex = {
        "$regex": q.strip(),
        "$options": "i"
    }

    # Query targets matching platform indexes seamlessly
    notes = await Note.find(
        Note.user_id == current_user.id,
        Note.status != "processing",
        {
            "$or": [
                {"language": search_regex},
                {"problem.title": search_regex},
                {"problem.platform": search_regex},
                {"problem.difficulty": search_regex},
            ]
        }
    ).sort(-Note.createdAt).limit(8).to_list()

    results = []

    for note in notes:
        title = note.problem.title or "Untitled Problem"
        snippet = "Open Study Note"
        content = note.note

        # Failsafe snippet finder matching complex model hierarchies
        # 1. Look in structural optimal/brute schemas first
        found = False
        for approach in [content.optimalApproach, content.bruteForce]:
            if approach and approach.description and len(approach.description) > 0:
                paragraph = approach.description[0]
                if paragraph and (paragraph.text or paragraph.code):
                    snippet = paragraph.text or paragraph.code
                    found = True
                    break
        
        # 2. Look in flat string arrays if approach is empty
        if not found:
            for text_list in [content.summary, content.intuition]:
                if text_list and len(text_list) > 0 and isinstance(text_list[0], str):
                    snippet = text_list[0]
                    break

        results.append({
            "name": f"{title} Notes",
            "path": f"/notes/{str(note.id)}",
            "type": "note",
            "desc": (
                f"{snippet[:52]}..."
                if len(snippet) > 55
                else snippet
            )
        })

    return {
        "success": True,
        "results": results
    }