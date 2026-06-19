# app/routes/__init__.py

from .auth import router as auth_router
from .analytics import router as analytics_router
from .user import router as user_router
from .note import router as note_router
from .theory import router as theory_router 
from .prompt import router as prompt_router


__all__ = [
    "analytics_router",
    "auth_router",
    "user_router",
    "note_router",
    "theory_router",
    "prompt_router",
]