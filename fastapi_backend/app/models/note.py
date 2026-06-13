from datetime import datetime, timezone
from typing import Optional, List, Dict, Any, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy import DateTime, Column as SqlAlchemyColumn  # 👈 Added DateTime import
from sqlalchemy.dialects.postgresql import JSONB

if TYPE_CHECKING:
    from app.models import Problem, User

class Note(SQLModel, table=True):
    __tablename__ = "notes"

    id: Optional[int] = Field(default=None, primary_key=True)

    bruteForce: List[Dict[str, Any]] = Field(
        default_factory=list,
        sa_column=SqlAlchemyColumn(JSONB)
    )

    optimalApproach: List[Dict[str, Any]] = Field(
        default_factory=list,
        sa_column=SqlAlchemyColumn(JSONB)
    )

    algorithm: List[Dict[str, Any]] = Field(
        default_factory=list,
        sa_column=SqlAlchemyColumn(JSONB)
    )

    dryRun: List[Dict[str, Any]] = Field(
        default_factory=list,
        sa_column=SqlAlchemyColumn(JSONB)
    )

    edgeCases: List[Dict[str, Any]] = Field(
        default_factory=list,
        sa_column=SqlAlchemyColumn(JSONB)
    )

    status: str = Field(
        default="draft",
        index=True
    )

    # 1. Added explicit timezone-aware type tracking
    lastEditedAt: Optional[datetime] = Field(
        default=None,
        sa_type=DateTime(timezone=True)
    )

    # 2. Modernized default factory and added timezone support
    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True)
    )

    problem_id: int = Field(
        foreign_key="problems.id",
        ondelete="CASCADE",
        unique=True
    )

    user_id: int = Field(
        foreign_key="users.id",
        ondelete="CASCADE"
    )

    problem: "Problem" = Relationship(
        back_populates="note"
    )

    user: "User" = Relationship(
        back_populates="notes"
    )