from datetime import datetime, timezone
from sqlalchemy.exc import IntegrityError
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models import Activity
from app.database.session import async_session_maker  

async def track_user_activity(
    session: AsyncSession,
    user_id: int,
    action_type: str
):
    try:
        now = datetime.now(timezone.utc)
        today_numeric_key = int(f"{now.year}{now.month:02d}{now.day:02d}")

        statement = select(Activity).where(
            Activity.user_id == user_id,
            Activity.dayKey == today_numeric_key
        )
        result = await session.execute(statement)
        activity = result.scalar_one_or_none()

        if not activity:
            activity = Activity(
                user_id=user_id,
                dayKey=today_numeric_key,
                totalCount=0,
                problemsAdded=0,
                notesGenerated=0
            )
            session.add(activity)

        activity.totalCount += 1
        if action_type == "problem":
            activity.problemsAdded += 1
        elif action_type == "note":
            activity.notesGenerated += 1

        await session.commit()

    except IntegrityError:
        await session.rollback()
        result = await session.execute(statement)
        activity = result.scalar_one_or_none()
        
        if activity:
            activity.totalCount += 1
            if action_type == "problem":
                activity.problemsAdded += 1
            elif action_type == "note":
                activity.notesGenerated += 1
            
            session.add(activity)
            await session.commit()
            
    except Exception as e:
        await session.rollback()
        print(f"Activity tracking error: {str(e)}")


# 2. This wrapper isolates the database lifespan away from the HTTP request context
async def track_user_activity_task(user_id: int, action_type: str):
    """
    Safely spawns an isolated database context for the background runner 
    to fix parameter mismatched TypeErrors.
    """
    async with async_session_maker() as session:
        await track_user_activity(
            session=session, 
            user_id=user_id, 
            action_type=action_type
        )