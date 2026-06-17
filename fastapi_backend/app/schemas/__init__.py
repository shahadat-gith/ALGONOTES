# app/schemas/__init__.py

from .auth import (
    RegisterRequest,
    LoginRequest,
    VerifyUserRequest,
    ForgotPasswordRequest,
)

from .user import (
    UserResponse,
)

from .note import (
    NoteResponse,
    NoteUpdate,
    GenerateNoteRequest,
    SaveNoteRequest,
)

from .theory import (
    GenerateTheoryRequest, 
    TheoryResponse,         
    TheoryUpdate,           
)

from app.models.note import (
    ProblemDetailSchema,
    NoteContentSchema,
)

__all__ = [
    "RegisterRequest",
    "LoginRequest",
    "VerifyUserRequest",
    "ForgotPasswordRequest",

    "UserResponse",

    "GenerateNoteRequest",
    "SaveNoteRequest",
    "ProblemDetailSchema",
    "NoteContentSchema",

    "NoteResponse",
    "NoteUpdate",

    "GenerateTheoryRequest",  
    "TheoryResponse",         
    "TheoryUpdate",           
]