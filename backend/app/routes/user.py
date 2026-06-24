# app/routes/user.py

from datetime import datetime, timezone
from typing import Optional

from beanie.operators import In
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form

from app.models import User, Note, Theory
from app.models.note import NoteStatus
from app.models.theory import TheoryStatus
from app.schemas.user import (
    DashboardEnvelope,
    DashboardRecentActivityItem,
    DashboardResponse,
    DashboardSummaryStats,
    UserResponse,
)
from app.services import build_analytics_stats, upload_to_cloudinary, delete_from_cloudinary
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
        leetcode_username=user.leetcode_username,
        avatar={
            "url": user.avatar.url,
            "public_id": user.avatar.public_id,
        },
    )


@router.get("/me")
async def get_current_user_details(
    current_user: User = Depends(get_current_user)
):
    return {
        "success": True,
        "user": serialize_user(current_user)
    }


@router.get("/dashboard", response_model=DashboardEnvelope)
async def get_dashboard_data(
    current_user: User = Depends(get_current_user),
):
    published_note_statuses = [NoteStatus.draft, NoteStatus.final]
    published_theory_statuses = [TheoryStatus.draft, TheoryStatus.final]

    total_coding_notes = await Note.find(
        Note.user_id == current_user.id,
        In(Note.status, published_note_statuses),
    ).count()
    total_theory_notes = await Theory.find(
        Theory.user_id == current_user.id,
        In(Theory.status, published_theory_statuses),
    ).count()

    pending_note_drafts = await Note.find(
        Note.user_id == current_user.id,
        Note.status == NoteStatus.draft,
    ).count()
    pending_theory_drafts = await Theory.find(
        Theory.user_id == current_user.id,
        Theory.status == TheoryStatus.draft,
    ).count()

    recent_notes = await (
        Note.find(
            Note.user_id == current_user.id,
            In(Note.status, published_note_statuses),
        )
        .sort(-Note.updatedAt)
        .limit(5)
        .to_list()
    )
    recent_theories = await (
        Theory.find(
            Theory.user_id == current_user.id,
            In(Theory.status, published_theory_statuses),
        )
        .sort(-Theory.updatedAt)
        .limit(5)
        .to_list()
    )

    recent_activity = [
        DashboardRecentActivityItem(
            id=str(note.id),
            type="DSA",
            title=note.problem.title or "Untitled coding note",
            info=" • ".join(
                part for part in [note.problem.platform, note.language] if part
            ) or "Coding note",
            status=note.status.value,
            href=f"/notes/{note.id}",
            createdAt=note.createdAt,
            updatedAt=note.updatedAt,
        )
        for note in recent_notes
    ] + [
        DashboardRecentActivityItem(
            id=str(theory.id),
            type="Theory",
            title=theory.topic or "Untitled theory note",
            info="Theory note",
            status=theory.status.value,
            href=f"/theory/{theory.id}",
            createdAt=theory.createdAt,
            updatedAt=theory.updatedAt,
        )
        for theory in recent_theories
    ]

    recent_activity.sort(key=lambda item: item.updatedAt, reverse=True)
    platform_stats = await build_analytics_stats()

    return DashboardEnvelope(
        success=True,
        dashboard=DashboardResponse(
            greetingName=current_user.name,
            stats=DashboardSummaryStats(
                totalCodingNotes=total_coding_notes,
                totalTheoryNotes=total_theory_notes,
                pendingDrafts=pending_note_drafts + pending_theory_drafts,
            ),
            recentActivity=recent_activity[:6],
            platformStats=platform_stats,
        ),
    )


@router.put("/profile")
async def update_profile(
    name: Optional[str] = Form(None),
    username: Optional[str] = Form(None),
    leetcode_username: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user)
):
    if username is not None:
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

    # Handle leetcode_username update (allow clearing by sending empty string)
    if leetcode_username is not None:
        cleaned = leetcode_username.strip()
        current_user.leetcode_username = cleaned if cleaned else None

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

