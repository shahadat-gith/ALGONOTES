# app/routes/__init__.py

from .auth import router as auth_router
from .user import router as user_router
from .note import router as note_router
from .ai_generation import router as ai_generation_router


__all__ = [
    "auth_router",
    "user_router",
    "note_router",
    "ai_generation_router",
]