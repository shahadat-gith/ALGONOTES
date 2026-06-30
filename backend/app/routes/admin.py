# app/routes/admin.py

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.config import settings
from app.middlewares import get_admin_token, get_admin_user
from app.models import User, Note, Theory, Analytics, ApiLog
from app.models.note import NoteStatus
from app.models.theory import TheoryStatus
from app.schemas.admin import (
    AdminLoginRequest,
    AdminLoginResponse,
    AdminUsersResponse,
    AdminUserItem,
    AdminLogsResponse,
    AdminLogItem,
    AdminDetailedStats,
    AdminStatsResponse,
    AdminNotesResponse,
    AdminNoteItem,
    AdminTheoriesResponse,
    AdminTheoryItem,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# ==========================================
# ADMIN LOGIN
# ==========================================
@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(payload: AdminLoginRequest):
    if payload.email.lower().strip() != settings.ADMIN_EMAIL.lower():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials.",
        )

    if payload.password != settings.ADMIN_PASS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials.",
        )

    token = get_admin_token()

    return AdminLoginResponse(
        success=True,
        token=token,
        message="Admin login successful.",
    )


# ==========================================
# GET ALL USERS (paginated)
# ==========================================
@router.get("/users", response_model=AdminUsersResponse)
async def get_all_users(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    admin: dict = Depends(get_admin_user),
):
    skip = (page - 1) * pageSize

    query = {}

    if search:
        search_regex = {"$regex": search, "$options": "i"}
        query["$or"] = [
            {"name": search_regex},
            {"email": search_regex},
            {"username": search_regex},
        ]

    total = await User.find(query).count()
    users = (
        await User.find(query)
        .sort(-User.createdAt)
        .skip(skip)
        .limit(pageSize)
        .to_list()
    )

    user_items = []
    for u in users:
        total_notes = await Note.find(Note.user_id == u.id).count()
        total_theories = await Theory.find(Theory.user_id == u.id).count()
        user_items.append(
            AdminUserItem(
                id=str(u.id),
                name=u.name,
                email=u.email,
                username=u.username,
                leetcode_username=u.leetcode_username,
                avatar_url=u.avatar.url if u.avatar else "",
                total_notes=total_notes,
                total_theories=total_theories,
                createdAt=u.createdAt,
                updatedAt=u.updatedAt,
            )
        )

    return AdminUsersResponse(
        success=True,
        users=user_items,
        total=total,
        page=page,
        pageSize=pageSize,
        totalPages=max(1, (total + pageSize - 1) // pageSize),
    )


# ==========================================
# GET DETAILED STATS
# ==========================================
@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats(
    admin: dict = Depends(get_admin_user),
):
    analytics = await Analytics.find_one(Analytics.key == "global")

    total_users = await User.find_all().count()
    total_coding_notes = await Note.find_all().count()
    total_theory_notes = await Theory.find_all().count()

    # Count by status
    note_statuses = {}
    for s in NoteStatus:
        count = await Note.find(Note.status == s).count()
        note_statuses[s.value] = count

    theory_statuses = {}
    for s in TheoryStatus:
        count = await Theory.find(Theory.status == s).count()
        theory_statuses[s.value] = count

    # Count recent logs (last 24 hours)
    twenty_four_hours_ago = datetime.now(timezone.utc) - timedelta(hours=24)
    recent_logs_count = await ApiLog.find(
        ApiLog.createdAt >= twenty_four_hours_ago
    ).count()

    return AdminStatsResponse(
        success=True,
        stats=AdminDetailedStats(
            totalUsers=total_users,
            totalCodingNotes=total_coding_notes,
            totalTheoryNotes=total_theory_notes,
            totalNotes=total_coding_notes + total_theory_notes,
            totalPageVisits=analytics.totalPageVisits if analytics else 0,
            totalApiRequests=analytics.totalApiRequests if analytics else 0,
            notesByStatus=note_statuses,
            theoriesByStatus=theory_statuses,
            recentLogsCount24h=recent_logs_count,
        ),
    )


# ==========================================
# GET API REQUEST LOGS (paginated)
# ==========================================
@router.get("/logs", response_model=AdminLogsResponse)
async def get_api_logs(
    page: int = Query(1, ge=1),
    pageSize: int = Query(50, ge=1, le=200),
    method: Optional[str] = Query(None),
    status_code: Optional[int] = Query(None),
    admin: dict = Depends(get_admin_user),
):
    skip = (page - 1) * pageSize

    query = {}
    if method:
        query["method"] = method.upper()
    if status_code:
        query["status_code"] = status_code

    total = await ApiLog.find(query).count()
    logs = (
        await ApiLog.find(query)
        .sort(-ApiLog.createdAt)
        .skip(skip)
        .limit(pageSize)
        .to_list()
    )

    log_items = [
        AdminLogItem(
            id=str(log.id),
            method=log.method,
            path=log.path,
            status_code=log.status_code,
            user_id=log.user_id,
            ip_address=log.ip_address,
            user_agent=log.user_agent,
            duration_ms=log.duration_ms,
            createdAt=log.createdAt,
        )
        for log in logs
    ]

    return AdminLogsResponse(
        success=True,
        logs=log_items,
        total=total,
        page=page,
        pageSize=pageSize,
        totalPages=max(1, (total + pageSize - 1) // pageSize),
    )


# ==========================================
# GET ALL NOTES (paginated, cross-user)
# ==========================================
@router.get("/notes", response_model=AdminNotesResponse)
async def get_all_notes(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status"),
    admin: dict = Depends(get_admin_user),
):
    skip = (page - 1) * pageSize

    query = {}
    if status_filter:
        query["status"] = status_filter

    total = await Note.find(query).count()
    notes = (
        await Note.find(query)
        .sort(-Note.createdAt)
        .skip(skip)
        .limit(pageSize)
        .to_list()
    )

    note_items = []
    for n in notes:
        user = await User.get(n.user_id)
        note_items.append(
            AdminNoteItem(
                id=str(n.id),
                title=n.problem.title or "Untitled",
                platform=n.problem.platform or "",
                difficulty=n.problem.difficulty or "",
                language=n.language or "",
                status=n.status.value if hasattr(n.status, "value") else str(n.status),
                user_email=user.email if user else "unknown",
                createdAt=n.createdAt,
                updatedAt=n.updatedAt,
            )
        )

    return AdminNotesResponse(
        success=True,
        notes=note_items,
        total=total,
        page=page,
        pageSize=pageSize,
        totalPages=max(1, (total + pageSize - 1) // pageSize),
    )


# ==========================================
# GET ALL THEORIES (paginated, cross-user)
# ==========================================
@router.get("/theories", response_model=AdminTheoriesResponse)
async def get_all_theories(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status"),
    admin: dict = Depends(get_admin_user),
):
    skip = (page - 1) * pageSize

    query = {}
    if status_filter:
        query["status"] = status_filter

    total = await Theory.find(query).count()
    theories = (
        await Theory.find(query)
        .sort(-Theory.createdAt)
        .skip(skip)
        .limit(pageSize)
        .to_list()
    )

    theory_items = []
    for t in theories:
        user = await User.get(t.user_id)
        theory_items.append(
            AdminTheoryItem(
                id=str(t.id),
                topic=t.topic or "Untitled",
                status=t.status.value if hasattr(t.status, "value") else str(t.status),
                user_email=user.email if user else "unknown",
                createdAt=t.createdAt,
                updatedAt=t.updatedAt,
            )
        )

    return AdminTheoriesResponse(
        success=True,
        theories=theory_items,
        total=total,
        page=page,
        pageSize=pageSize,
        totalPages=max(1, (total + pageSize - 1) // pageSize),
    )
