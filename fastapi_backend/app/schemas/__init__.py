# app/schemas/__init__.py

from .auth import (
    RegisterRequest,
    LoginRequest,
    VerifyUserRequest,
    ForgotPasswordRequest
)

from .note import (
    GenerateNoteRequest,
    SaveNoteRequest,
    ProblemDetailSchema,
    NoteContentSchema,
    ContentBlockSchema
)

__all__ = [
    # Auth Controller Schema Payloads
    "RegisterRequest",
    "LoginRequest",
    "VerifyUserRequest",
    "ForgotPasswordRequest",

    # AI Note Generator & Storage Payloads
    "GenerateNoteRequest",
    "SaveNoteRequest",
    "ProblemDetailSchema",
    "NoteContentSchema",
    "ContentBlockSchema"
]