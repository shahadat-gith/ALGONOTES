import time
from datetime import datetime, timezone
from typing import Optional

from fastapi import Request

from app.models import Analytics, ApiLog


async def capture_api_request_metrics(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration_ms = (time.time() - start_time) * 1000

    # Filter out OPTIONS preflight requests and match your target API prefix
    if request.method != "OPTIONS" and request.url.path.startswith("/api/v1"):
        now = datetime.now(timezone.utc)

        try:
            await Analytics.get_motor_collection().update_one(
                {"key": "global"},
                {
                    "$inc": {"totalApiRequests": 1},
                    "$set": {"updatedAt": now},
                    "$setOnInsert": {
                        "key": "global",
                        "totalPageVisits": 0,
                        "createdAt": now,
                    },
                },
                upsert=True,
            )
        except Exception as exc:
            print(f"Failed to update API request metrics: {exc}")

        # Log individual request to ApiLog collection (non-blocking fire-and-forget style)
        try:
            user_id: Optional[str] = None
            if hasattr(request.state, "user_id"):
                user_id = request.state.user_id

            await ApiLog(
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                user_id=user_id,
                ip_address=request.client.host if request.client else "",
                user_agent=request.headers.get("user-agent", ""),
                duration_ms=round(duration_ms, 2),
            ).insert()
        except Exception as exc:
            print(f"Failed to log API request: {exc}")

    return response