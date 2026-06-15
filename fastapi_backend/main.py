# main.py

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.config import settings
from app.database import init_db, close_db
from app.middlewares import register_error_handlers
from app.routes import (
    auth_router,
    user_router,
    note_router,
    ai_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(
        f"Starting application in {settings.ENVIRONMENT} mode..."
    )

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


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# ROUTES
# ==========================================
app.include_router(
    auth_router,
    prefix="/api/v1"
)

app.include_router(
    user_router,
    prefix="/api/v1"
)

app.include_router(
    note_router,
    prefix="/api/v1"
)

app.include_router(
    ai_router,
    prefix="/api/v1"
)


# ==========================================
# HEALTH CHECK
# ==========================================
@app.get("/", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
    }


# ==========================================
# SERVERLESS HANDLER
# ==========================================
handler = Mangum(
    app,
    lifespan="on"
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=(
            settings.ENVIRONMENT.lower()
            == "development"
        ),
    )