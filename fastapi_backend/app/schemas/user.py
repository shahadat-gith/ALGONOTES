# app/schemas/user.py

from typing import Optional, Any
from pydantic import (
    BaseModel,
    EmailStr,
    ConfigDict,
    field_validator,
)


class AvatarResponse(BaseModel):
    url: str = ""
    public_id: str = ""

    model_config = ConfigDict(from_attributes=True)


class VerificationResponse(BaseModel):
    status: str = "pending"

    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    username: Optional[str] = None
    avatar: AvatarResponse
    verificationOptions: VerificationResponse

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True  # Guarantees frictionless _id lookup
    )

    @field_validator("id", mode="before")
    @classmethod
    def convert_object_id(cls, value: Any) -> str:
        return str(value)