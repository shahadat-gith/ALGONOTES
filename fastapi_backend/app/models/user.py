from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy.dialects.postgresql import JSONB


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)

    name: str
    email: str = Field(index=True, unique=True)

    username: Optional[str] = Field(
        default=None,
        index=True,
        unique=True
    )

    password: str

    avatar: Dict[str, Any] = Field(
        default_factory=lambda: {
            "url": "",
            "public_id": ""
        },
        sa_column=Column(JSONB)
    )

    verificationOptions: Dict[str, Any] = Field(
        default_factory=lambda: {
            "status": "pending",
            "otp": None,
            "otpExpiry": None
        },
        sa_column=Column(JSONB)
    )

    forgotPasswordOptions: Dict[str, Any] = Field(
        default_factory=lambda: {
            "otp": None,
            "otpExpiry": None,
            "otpVerified": False
        },
        sa_column=Column(JSONB)
    )

    createdAt: datetime = Field(default_factory=datetime.utcnow)

    problems: List["Problem"] = Relationship(
        back_populates="user",
        cascade_delete=True
    )

    notes: List["Note"] = Relationship(
        back_populates="user",
        cascade_delete=True
    )

    activities: List["Activity"] = Relationship(
        back_populates="user",
        cascade_delete=True
    )