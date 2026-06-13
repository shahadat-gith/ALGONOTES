from typing import Optional, Literal
from pydantic import BaseModel, Field, EmailStr


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class VerifyUserRequest(BaseModel):
    email: EmailStr
    step: Literal["send-otp", "otp-verification"]
    otp: Optional[str] = Field(default=None, min_length=6, max_length=6)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    step: Literal["send-otp", "verify-otp", "reset-password"]
    otp: Optional[str] = Field(default=None, min_length=6, max_length=6)
    newPassword: Optional[str] = Field(default=None, min_length=6)