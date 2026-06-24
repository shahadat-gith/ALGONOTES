# app/schemas/auth.py

from typing import Optional, Literal
from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    ConfigDict,
)


# ==========================================
# REGISTER
# ==========================================
class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    username: Optional[str] = Field(
        default=None,
        min_length=3
    )
    password: str = Field(
        ...,
        min_length=6
    )


# ==========================================
# LOGIN
# ==========================================
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ==========================================
# FORGOT PASSWORD
# ==========================================
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

    step: Literal[
        "send-otp",
        "verify-otp",
        "reset-password"
    ]

    otp: Optional[str] = Field(
        default=None,
        min_length=6,
        max_length=6
    )

    newPassword: Optional[str] = Field(
        default=None,
        min_length=6
    )


# ==========================================
# RESPONSE DTO SCHEMAS
# ==========================================
# Added to satisfy serialize_user() requirements inside routes/auth.py
class UserAvatarResponse(BaseModel):
    url: str = ""
    public_id: str = ""


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    username: Optional[str] = None
    leetcode_username: Optional[str] = None
    avatar: UserAvatarResponse

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )