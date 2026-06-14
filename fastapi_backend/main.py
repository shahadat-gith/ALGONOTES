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
    print("Initializing database...")
    await init_db()
    print("Database initialized successfully.")
    yield
    print("Shutting down backend...")


app = FastAPI(
    title="ALGONOTES API Backend Engine",
    description="Python FastAPI Backend for ALGONOTES",
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


@app.get("/", tags=["System Verification Gateway"])
async def system_health_status():
    return {
        "status": "operational",
        "engine": "FastAPI ASGI",
        "database": "Connected via SQLModel",
        "environment": settings.ENVIRONMENT,
    }


handler = Mangum(app)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True if settings.ENVIRONMENT == "development" else False,
    )