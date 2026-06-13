from .auth import RegisterRequest, LoginRequest, VerifyUserRequest, ForgotPasswordRequest
from .problem import CreateProblemRequest, UpdateProblemRequest
from .note import SaveNoteRequest

__all__ = [
    "RegisterRequest",
    "LoginRequest",
    "VerifyUserRequest",
    "ForgotPasswordRequest",
    "CreateProblemRequest",
    "UpdateProblemRequest",
    "SaveNoteRequest"
]