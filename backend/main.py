import asyncio
import json
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.config import settings
from app.database import init_db, close_db
from app.middlewares import register_error_handlers
from app.middlewares import capture_api_request_metrics
from app.routes import (
    analytics_router,
    auth_router,
    user_router,
    note_router,
    theory_router,
    prompt_router,
    leetcode_router,
    admin_router,
)

# Import your standalone async queue logic
from app.sqs import start_async_queue_handler


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
app.middleware("http")(capture_api_request_metrics)

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
app.include_router(leetcode_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")


@app.get("/", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
    }


# Standard Web HTTP traffic adapter
mangum_handler = Mangum(app, lifespan="on")


def handler(event, context):
    """
    Unified Master Handler: Checks if incoming payload is from SQS.
    If yes, runs your standalone queue pipeline safely. If no, routes to FastAPI.
    """
    # Intercept SQS Queue messages
    if "Records" in event and event["Records"][0].get("eventSource") == "aws:sqs":
        print(f"[Master Interceptor] SQS Event detected. Routing to queue loop.")
        
        # Get or create a safe event loop that won't destroy Mangum's context
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
        return loop.run_until_complete(start_async_queue_handler(event, context))

    # Otherwise, pass normal API calls down to Mangum cleanly
    return mangum_handler(event, context)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENVIRONMENT.lower() == "development",
    )