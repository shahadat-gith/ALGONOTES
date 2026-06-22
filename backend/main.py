from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.config import settings
from app.database import init_db, close_db
from app.middlewares import register_error_handlers
from app.models import Analytics
from app.routes import (
    analytics_router,
    auth_router,
    user_router,
    note_router,
    theory_router,
    prompt_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):

    print(f"Starting application...")
    await init_db()

    print("Application startup completed.")

    yield

    await close_db()

    print("Application shutdown completed.")


app = FastAPI(
    title="ALGONOTES API",
    description="AlgoNotes Backend API",
    version="1.0.0",
    lifespan=lifespan,
)


register_error_handlers(app)


@app.middleware("http")
async def capture_api_request_metrics(request: Request, call_next):
    response = await call_next(request)

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


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")
app.include_router(note_router, prefix="/api/v1")
app.include_router(theory_router, prefix="/api/v1")
app.include_router(prompt_router, prefix="/api/v1")


@app.get("/", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
    }


handler = Mangum(app, lifespan="on")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENVIRONMENT.lower() == "development",
    )