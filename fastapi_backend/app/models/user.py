from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy import DateTime
from sqlalchemy.dialects.postgresql import JSONB


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)

    name: str

    email: str = Field(
        index=True,
        unique=True
    )

    username: Optional[str] = Field(
        default=None,
        index=True,
        unique=True
    )

    password: str

    # Profile Customization Block
    avatar: Dict[str, Any] = Field(
        default_factory=lambda: {
            "url": "",
            "public_id": ""
        },
        sa_column=Column(JSONB)
    )

    # Core Security & Verification Tracking Options
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

    # Modernized Timezone-Aware Explicit Timestamp Registration
    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True)
    )

    # Relationship Connectors pointing to your external Note/Activity schemas
    notes: List["Note"] = Relationship(
        back_populates="user",
        cascade_delete=True
    )
