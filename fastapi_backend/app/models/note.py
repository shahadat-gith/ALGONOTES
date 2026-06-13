from datetime import datetime, timezone
from typing import Optional, List, Dict, Any, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import DateTime, Column as SqlAlchemyColumn
from sqlalchemy.dialects.postgresql import JSONB

if TYPE_CHECKING:
    from app.models import Problem, User

class Note(SQLModel, table=True):
    __tablename__ = "notes"

    id: Optional[int] = Field(default=None, primary_key=True)

    bruteForce: Optional[List[Dict[str, Any]]] = Field(
        default_factory=list,
        sa_column=SqlAlchemyColumn(JSONB, nullable=False, server_default="[]")
    )

    optimalApproach: Optional[List[Dict[str, Any]]] = Field(
        default_factory=list,
        sa_column=SqlAlchemyColumn(JSONB, nullable=False, server_default="[]")
    )

    algorithm: Optional[List[Dict[str, Any]]] = Field(
        default_factory=list,
        sa_column=SqlAlchemyColumn(JSONB, nullable=False, server_default="[]")
    )

    dryRun: Optional[List[Dict[str, Any]]] = Field(
        default_factory=list,
        sa_column=SqlAlchemyColumn(JSONB, nullable=False, server_default="[]")
    )

    edgeCases: Optional[List[Dict[str, Any]]] = Field(
        default_factory=list,
        sa_column=SqlAlchemyColumn(JSONB, nullable=False, server_default="[]")
    )

  
    status: str = Field(
        default="processing",
        index=True
    )

    lastEditedAt: Optional[datetime] = Field(
        default=None,
        sa_type=DateTime(timezone=True)
    )

    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True)
    )

  
    problem_id: int = Field(
        foreign_key="problems.id",
        ondelete="CASCADE",
        unique=True,
        index=True 
    )

    user_id: int = Field(
        foreign_key="users.id",
        ondelete="CASCADE",
        index=True  
    )

    problem: "Problem" = Relationship(
        back_populates="note"
    )

    user: "User" = Relationship(
        back_populates="notes"
    )