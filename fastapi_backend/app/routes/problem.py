from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models import User, Problem
from app.schemas import CreateProblemRequest, UpdateProblemRequest
from app.utils import track_user_activity_task
from app.middlewares import get_current_user
from app.database import get_session


router = APIRouter(prefix="/problems", tags=["Coding Problems Ledger"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_problem(
    payload: CreateProblemRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    new_problem = Problem(
        user_id=current_user.id,
        title=payload.title,
        platform=payload.platform,
        problemLink=str(payload.problemLink) if payload.problemLink else None,
        difficulty=payload.difficulty,
        language=payload.language,
        topics=payload.topics,
        userCode=payload.userCode
    )

    session.add(new_problem)
    await session.commit()
    await session.refresh(new_problem)

    # Calling the background task runner wrapper
    background_tasks.add_task(
        track_user_activity_task,  # <-- Using the wrapper
        current_user.id,
        "problem"
    )

    return {
        "success": True,
        "message": "Problem logged successfully.",
        "problem": new_problem
    }


@router.get("")
async def get_all_problems(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    statement = (
        select(Problem)
        .where(Problem.user_id == current_user.id)
        .order_by(Problem.createdAt.desc())
    )

    results = await session.execute(statement)
    problems = results.scalars().all()

    return {
        "success": True,
        "count": len(problems),
        "problems": problems
    }


@router.get("/stats")
async def get_problem_stats(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    total_stmt = (
        select(func.count())
        .select_from(Problem)
        .where(Problem.user_id == current_user.id)
    )

    bookmark_stmt = (
        select(func.count())
        .select_from(Problem)
        .where(
            Problem.user_id == current_user.id,
            Problem.isBookmarked == True
        )
    )

    revision_stmt = (
        select(func.count())
        .select_from(Problem)
        .where(
            Problem.user_id == current_user.id,
            Problem.needsRevision == True
        )
    )

    total_solved = (await session.execute(total_stmt)).scalar() or 0
    bookmarked_count = (await session.execute(bookmark_stmt)).scalar() or 0
    needs_revision_count = (await session.execute(revision_stmt)).scalar() or 0

    diff_stmt = (
        select(Problem.difficulty, func.count())
        .where(Problem.user_id == current_user.id)
        .group_by(Problem.difficulty)
    )

    diff_results = await session.execute(diff_stmt)

    difficulty_distribution = {
        "Easy": 0,
        "Medium": 0,
        "Hard": 0
    }

    for diff, count in diff_results.all():
        if diff in difficulty_distribution:
            difficulty_distribution[diff] = count

    topics_stmt = select(Problem.topics).where(
        Problem.user_id == current_user.id
    )

    topics_results = await session.execute(topics_stmt)
    all_topics_lists = topics_results.scalars().all()

    topic_counts = {}

    for topic_list in all_topics_lists:
        if not topic_list:
            continue

        for topic in topic_list:
            topic_counts[topic] = topic_counts.get(topic, 0) + 1

    sorted_topics = sorted(
        topic_counts.items(),
        key=lambda x: x[1],
        reverse=True
    )[:10]

    top_topics_formatted = [
        {
            "name": name,
            "count": count
        }
        for name, count in sorted_topics
    ]

    return {
        "success": True,
        "stats": {
            "totalProblemsLogged": total_solved,
            "bookmarked": bookmarked_count,
            "needsRevision": needs_revision_count,
            "breakdown": difficulty_distribution,
            "topTopics": top_topics_formatted
        }
    }


@router.get("/{problem_id}")
async def get_problem_by_id(
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
            detail="Problem not found."
        )

    return {
        "success": True,
        "problem": problem
    }


@router.put("/{problem_id}")
async def update_problem(
    problem_id: int,
    payload: UpdateProblemRequest,
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
            detail="Problem not found."
        )

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        if key == "problemLink":
            value = str(value) if value else None

        if hasattr(problem, key):
            setattr(problem, key, value)

    session.add(problem)
    await session.commit()
    await session.refresh(problem)

    return {
        "success": True,
        "message": "Problem updated successfully.",
        "problem": problem
    }


@router.delete("/{problem_id}")
async def delete_problem(
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
            detail="Problem not found."
        )

    await session.delete(problem)
    await session.commit()

    return {
        "success": True,
        "message": "Problem deleted successfully."
    }