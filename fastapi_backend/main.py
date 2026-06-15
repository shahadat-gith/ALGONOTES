from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.config import settings
from app.database import init_db
from app.middlewares import register_error_handlers
from app.routes import (
    auth_router,
    user_router,
    note_router,
    ai_generation_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"Starting application in {settings.ENVIRONMENT} mode...")

    await init_db()

    print("Application startup completed.")
    yield

    print("Shutting down backend instance safely...")


app = FastAPI(
    title="ALGONOTES API Backend Engine",
    description="Python FastAPI Backend for ALGONOTES workspace",
    version="1.0.0",
    lifespan=lifespan,
)


register_error_handlers(app)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")
app.include_router(note_router, prefix="/api/v1")
app.include_router(ai_generation_router, prefix="/api/v1")


@app.get("/", tags=["System"])
async def system_health_status():
    return {
        "status": "operational",
        "engine": "FastAPI ASGI",
        "environment": settings.ENVIRONMENT,
        "allowed_origins": settings.ALLOWED_ORIGINS,
    }


@app.get("/debug/env", tags=["Debug"])
async def debug_env():
    if settings.ENVIRONMENT.lower() == "production":
        return {"message": "Debug information is restricted on production."}

    return {
        "environment": settings.ENVIRONMENT,
        "frontend_url": settings.FRONTEND_URL,
        "frontend_url_prod": settings.FRONTEND_URL_PROD,
        "allowed_origins": settings.ALLOWED_ORIGINS,
    }


handler = Mangum(app, lifespan="off")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENVIRONMENT.lower() == "development",
    )