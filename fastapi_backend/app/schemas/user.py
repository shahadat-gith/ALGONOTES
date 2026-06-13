# app/schemas/user.py
from typing import Optional, Literal
from pydantic import BaseModel, Field, EmailStr

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr  # Performs proper syntax validation (e.g., handles the Mongoose regex match check)
    password: str = Field(..., min_length=6)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class VerifyUserRequest(BaseModel):
    email: EmailStr
    step: Literal["send-otp", "otp-verification"]
    otp: Optional[str] = Field(None, min_length=6, max_length=6)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    step: Literal["send-otp", "verify-otp", "reset-password"]
    otp: Optional[str] = None
    newPassword: Optional[str] = None