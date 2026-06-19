from datetime import datetime, timezone

from fastapi import APIRouter, status

from app.models import Analytics
from app.schemas.analytics import (
    AnalyticsStatsEnvelope,
    AnalyticsVisitTrackingResponse,
)
from app.services import build_analytics_stats, GLOBAL_ANALYTICS_KEY


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.post(
    "/visits",
    response_model=AnalyticsVisitTrackingResponse,
    status_code=status.HTTP_200_OK,
)
async def register_page_visit():
    now = datetime.now(timezone.utc)

    await Analytics.get_motor_collection().update_one(
        {"key": GLOBAL_ANALYTICS_KEY},
        {
            "$inc": {"totalPageVisits": 1},
            "$set": {"updatedAt": now},
            "$setOnInsert": {
                "key": GLOBAL_ANALYTICS_KEY,
                "totalApiRequests": 0,
                "createdAt": now,
            },
        },
        upsert=True,
    )

    stats = await build_analytics_stats()

    return AnalyticsVisitTrackingResponse(
        success=True,
        message="Page visit recorded successfully.",
        stats=stats,
    )


@router.get("/stats", response_model=AnalyticsStatsEnvelope)
async def get_analytics_stats():
    stats = await build_analytics_stats()

    return AnalyticsStatsEnvelope(
        success=True,
        stats=stats,
    )