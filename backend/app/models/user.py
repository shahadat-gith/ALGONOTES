# app/models/user.py

from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from beanie import Document, Indexed
from pydantic import BaseModel, Field, ConfigDict, EmailStr


class VerificationStatus(str, Enum):
    pending = "pending"
    verified = "verified"


class AvatarSchema(BaseModel):
    url: str = ""
    public_id: str = ""


class VerificationSchema(BaseModel):
    status: VerificationStatus = VerificationStatus.pending
    otp: Optional[str] = None
    otpExpiry: Optional[datetime] = None


class ForgotPasswordSchema(BaseModel):
    otp: Optional[str] = None
    otpExpiry: Optional[datetime] = None
    otpVerified: bool = False


class User(Document):
    name: str
    email: EmailStr = Indexed(unique=True)
    username: Optional[str] = Indexed(
        default=None,
        unique=True,
        sparse=True
    )
    password: str = Field(exclude=True)
    avatar: AvatarSchema = Field(default_factory=AvatarSchema)
    verificationOptions: VerificationSchema = Field(default_factory=VerificationSchema)
    forgotPasswordOptions: ForgotPasswordSchema = Field(default_factory=ForgotPasswordSchema)

    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updatedAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "users"

    # Enforce standard model configurations to help handle conversions gracefully
    model_config = ConfigDict(
        arbitrary_types_allowed=True
    )