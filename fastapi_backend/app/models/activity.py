from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING

from sqlmodel import SQLModel, Field, Relationship, UniqueConstraint
from sqlalchemy import DateTime


if TYPE_CHECKING:
    from app.models import User


class Activity(SQLModel, table=True):
    __tablename__ = "activities"

    __table_args__ = (
        UniqueConstraint("user_id", "dayKey", name="uq_user_day"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)

    # YYYYMMDD format (ex: 20260614)
    dayKey: int = Field(index=True)

    # Total activity count for heatmap intensity
    totalCount: int = 0

    # Number of notes generated/updated that day
    notesCount: int = 0

    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True),
    )

    user_id: int = Field(
        foreign_key="users.id",
        ondelete="CASCADE",
        index=True,
    )

    user: "User" = Relationship(
        back_populates="activities"
    )