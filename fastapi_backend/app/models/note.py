import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, TYPE_CHECKING

from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import DateTime, Column
from sqlalchemy.dialects.postgresql import JSONB

if TYPE_CHECKING:
    from app.models import User


class Note(SQLModel, table=True):
    __tablename__ = "notes"

    id: Optional[int] = Field(default=None, primary_key=True)

    noteId: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        index=True,
        unique=True,
        nullable=False,
    )

    status: str = Field(default="processing", index=True)

    # Clean polymorphic content blocks stored natively as JSONB layout arrays
    problem: Dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSONB, nullable=False),
    )

    note: Dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSONB, nullable=False),
    )

    language: str = Field(default="C++")
    userCode: str = Field(default="")

    # Optimization: Default to the current time so sorting logic always has an active value
    lastEditedAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True),
    )

    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True),
    )

    # Cascading relational foreign keys
    user_id: int = Field(
        foreign_key="users.id",
        ondelete="CASCADE",
        index=True,
    )

    user: "User" = Relationship(back_populates="notes")