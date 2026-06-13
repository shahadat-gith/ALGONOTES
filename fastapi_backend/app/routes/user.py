from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlmodel import select, func, or_
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy import cast, String
from sqlalchemy.orm import selectinload
from sqlalchemy.orm.attributes import flag_modified

from app.models import User, Problem, Note, Activity
from app.services import upload_to_cloudinary, delete_from_cloudinary
from app.middlewares import get_current_user
from app.database import get_session


router = APIRouter(prefix="/users", tags=["Users Profile Deck"])


@router.get("/me")
async def get_current_user_details(
    current_user: User = Depends(get_current_user)
):
    sanitized_user = current_user.model_dump(
        exclude={
            "password",
            "forgotPasswordOptions"
        }
    )

    return {
        "success": True,
        "user": sanitized_user
    }


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
            "forgotPasswordOptions"
        }
    )

    return {
        "success": True,
        "message": "Profile updated successfully.",
        "user": sanitized_user
    }


@router.delete("/account")
async def delete_account(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    avatar_opts = dict(current_user.avatar or {})

    if avatar_opts.get("public_id"):
        await delete_from_cloudinary(avatar_opts["public_id"])

    await session.delete(current_user)
    await session.commit()

    return {
        "success": True,
        "message": "Your profile account has been permanently deactivated and erased."
    }


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

    problem_statement = (
        select(Problem)
        .where(
            Problem.user_id == current_user.id,
            Problem.title.ilike(search_pattern)
        )
        .limit(5)
    )

    problem_results = await session.execute(problem_statement)
    problems = problem_results.scalars().all()

    note_statement = (
        select(Note)
        .where(
            Note.user_id == current_user.id,
            or_(
                cast(Note.bruteForce, String).ilike(search_pattern),
                cast(Note.optimalApproach, String).ilike(search_pattern),
                cast(Note.algorithm, String).ilike(search_pattern),
                cast(Note.edgeCases, String).ilike(search_pattern)
            )
        )
        .options(selectinload(Note.problem))
        .limit(5)
    )

    note_results = await session.execute(note_statement)
    notes = note_results.scalars().all()

    formatted_problems = [
        {
            "name": p.title,
            "path": f"/problems/{p.id}",
            "type": "problem",
            "desc": f"{p.difficulty or 'Unknown'} Difficulty"
        }
        for p in problems
    ]

    formatted_notes = []

    for n in notes:
        if not n.problem:
            continue

        snippet = "View AI Study Blocks"

        if n.optimalApproach and len(n.optimalApproach) > 0:
            snippet = n.optimalApproach[0].get("text", snippet)
        elif n.bruteForce and len(n.bruteForce) > 0:
            snippet = n.bruteForce[0].get("text", snippet)
        elif n.algorithm and len(n.algorithm) > 0:
            snippet = n.algorithm[0].get("description", snippet)

        formatted_notes.append(
            {
                "name": f"{n.problem.title} Notes",
                "path": f"/notes/{n.id}",
                "type": "note",
                "desc": f"{snippet[:52]}..." if len(snippet) > 55 else snippet
            }
        )

    return {
        "success": True,
        "results": formatted_problems + formatted_notes
    }


@router.get("/dashboard-metrics")
async def get_dashboard_metrics(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    lookback_date = datetime.utcnow() - timedelta(days=365)

    threshold_key = int(
        f"{lookback_date.year}{lookback_date.month:02d}{lookback_date.day:02d}"
    )

    prob_count_stmt = (
        select(func.count())
        .select_from(Problem)
        .where(Problem.user_id == current_user.id)
    )

    note_count_stmt = (
        select(func.count())
        .select_from(Note)
        .where(Note.user_id == current_user.id)
    )

    total_problems = (await session.execute(prob_count_stmt)).scalar() or 0
    total_notes = (await session.execute(note_count_stmt)).scalar() or 0

    diff_stmt = (
        select(Problem.difficulty, func.count())
        .where(Problem.user_id == current_user.id)
        .group_by(Problem.difficulty)
    )

    diff_results = await session.execute(diff_stmt)

    difficulty_map = {
        "easy": 0,
        "medium": 0,
        "hard": 0
    }

    for diff, count in diff_results.all():
        if diff:
            key = diff.lower()

            if key in difficulty_map:
                difficulty_map[key] = count

    recent_prob_stmt = (
        select(Problem)
        .where(Problem.user_id == current_user.id)
        .order_by(Problem.createdAt.desc())
        .limit(3)
    )

    recent_problems = (
        await session.execute(recent_prob_stmt)
    ).scalars().all()

    recent_note_stmt = (
        select(Note)
        .where(Note.user_id == current_user.id)
        .options(selectinload(Note.problem))
        .order_by(Note.lastEditedAt.desc())
        .limit(3)
    )

    recent_notes = (
        await session.execute(recent_note_stmt)
    ).scalars().all()

    activity_stmt = (
        select(Activity)
        .where(
            Activity.user_id == current_user.id,
            Activity.dayKey >= threshold_key
        )
        .order_by(Activity.dayKey.asc())
    )

    activities = (
        await session.execute(activity_stmt)
    ).scalars().all()

    activity_map = {
        act.dayKey: {
            "total": act.totalCount,
            "problems": act.problemsAdded,
            "notes": act.notesGenerated
        }
        for act in activities
    }

    formatted_notes = []

    for n in recent_notes:
        if not n.problem:
            continue

        snippet = "Open Study Deck"

        if n.optimalApproach and len(n.optimalApproach) > 0:
            snippet = n.optimalApproach[0].get("text", snippet)
        elif n.bruteForce and len(n.bruteForce) > 0:
            snippet = n.bruteForce[0].get("text", snippet)
        elif n.algorithm and len(n.algorithm) > 0:
            snippet = n.algorithm[0].get("description", snippet)

        formatted_notes.append(
            {
                "_id": n.id,
                "title": f"{n.problem.title} Notes",
                "status": n.status,
                "updated": n.lastEditedAt or n.createdAt,
                "desc": f"{snippet[:57]}..." if len(snippet) > 60 else snippet
            }
        )

    return {
        "success": True,
        "data": {
            "counters": {
                "totalProblems": total_problems,
                "totalNotes": total_notes,
                "difficulty": difficulty_map
            },
            "recentActivity": {
                "problems": [
                    {
                        "_id": p.id,
                        "title": p.title,
                        "platform": p.platform,
                        "difficulty": p.difficulty,
                        "createdAt": p.createdAt
                    }
                    for p in recent_problems
                ],
                "notes": formatted_notes
            },
            "activityGrid": activity_map
        }
    }