from datetime import datetime, timezone
from fastapi import Request
from app.models import Analytics

async def capture_api_request_metrics(request: Request, call_next):
    response = await call_next(request)

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

    return response