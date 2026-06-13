from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy.dialects.postgresql import JSONB


class Problem(SQLModel, table=True):
    __tablename__ = "problems"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    platform: str = "LeetCode"
    problemLink: Optional[str] = None
    difficulty: Optional[str] = None
    language: str

    topics: List[str] = Field(
        default_factory=list,
        sa_column=Column(JSONB)
    )

    userCode: str = ""

    isBookmarked: bool = False
    needsRevision: bool = False

    createdAt: datetime = Field(
        default_factory=datetime.utcnow,
        index=True
    )

    user_id: int = Field(
        foreign_key="users.id",
        ondelete="CASCADE"
    )

    user: "User" = Relationship(
        back_populates="problems"
    )

    note: Optional["Note"] = Relationship(
        back_populates="problem",
        cascade_delete=True
    )