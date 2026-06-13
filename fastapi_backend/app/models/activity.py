from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship, UniqueConstraint
from sqlalchemy import DateTime

# Prevents circular import errors if you type-hint your relationships
if TYPE_CHECKING:
    from app.models import User  # Adjust this path to match your User model location


class Activity(SQLModel, table=True):
    __tablename__ = "activities"

    # 1. Composite Unique Constraint: Guarantees only ONE log per user, per day
    __table_args__ = (
        UniqueConstraint("user_id", "dayKey", name="uq_user_day"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)

    # 2. Performance Indexing: Speeds up our daily WHERE queries significantly
    dayKey: int = Field(index=True)
    
    totalCount: int = 0
    problemsAdded: int = 0
    notesGenerated: int = 0

    # 3. Timezone Fix: Forces PostgreSQL to accept timezone-aware values (TIMESTAMP WITH TIME ZONE)
    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True)  
    )

    user_id: int = Field(
        foreign_key="users.id",
        ondelete="CASCADE",
        index=True
    )

    user: "User" = Relationship(
        back_populates="activities"
    )