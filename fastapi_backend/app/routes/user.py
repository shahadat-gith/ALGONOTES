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

