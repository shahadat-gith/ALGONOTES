# app/models/user.py

from datetime import datetime, timezone
from typing import Optional

from beanie import Document
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from pymongo import IndexModel, ASCENDING


class AvatarSchema(BaseModel):
    url: str = ""
    public_id: str = ""


class ForgotPasswordSchema(BaseModel):
    otp: Optional[str] = None
    otpExpiry: Optional[datetime] = None
    otpVerified: bool = False


class User(Document):
    name: str
    email: EmailStr
    username: Optional[str] = Field(default=None)
    leetcode_username: Optional[str] = Field(default=None)
    password: str = Field(exclude=True)
    avatar: AvatarSchema = Field(default_factory=AvatarSchema)
    forgotPasswordOptions: ForgotPasswordSchema = Field(default_factory=ForgotPasswordSchema)

    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updatedAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "users"
        indexes = [
            IndexModel([("email", ASCENDING)], unique=True),
            IndexModel([("username", ASCENDING)], unique=True, partialFilterExpression={"username": {"$type": "string"}}),
            IndexModel([("leetcode_username", ASCENDING)], sparse=True),
        ]

    # Enforce standard model configurations to help handle conversions gracefully
    model_config = ConfigDict(
        arbitrary_types_allowed=True
    )