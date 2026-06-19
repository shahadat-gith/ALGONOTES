# app/models/note.py

from datetime import datetime, timezone
from enum import Enum
from typing import List, Dict, Any, Optional

from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, Field, ConfigDict


class NoteStatus(str, Enum):
    processing = "processing"
    draft = "draft"
    final = "final"
    failed = "failed"


class CodeImplementation(BaseModel):
    """Strict schema for code blocks."""
    language: str = "C++"
    code: str


class ComplexitySchema(BaseModel):
    time: str = ""   # e.g., "O(N^2)"
    space: str = ""  # e.g., "O(1)"


class ApproachSchema(BaseModel):
    """Used for bruteForce, better, and optimalApproach."""
    complexity: ComplexitySchema = Field(default_factory=ComplexitySchema)
    description: str = ""  
    codeBlock: Optional[CodeImplementation] = None
    algorithmSteps: List[str] = Field(default_factory=list)
    
    model_config = ConfigDict(exclude_none=True)


class ProblemDetailSchema(BaseModel):
    title: str = ""
    problemLink: str = ""
    platform: str = ""
    difficulty: str = ""
    description: str = ""
    constraints: List[str] = Field(default_factory=list)
    testCases: List[Dict[str, Any]] = Field(default_factory=list)
    expectedTimeComplexity: str = ""
    expectedSpaceComplexity: str = ""
    topics: List[str] = Field(default_factory=list)


class NoteContentSchema(BaseModel):
    intuition: str = ""
    edgeCases: List[str] = Field(default_factory=list)
    mistakesToAvoid: List[str] = Field(default_factory=list)
    dryRun: List[Dict[str, Any]] = Field(default_factory=list)
    bruteForce: Optional[ApproachSchema] = None
    better: Optional[ApproachSchema] = None
    optimalApproach: Optional[ApproachSchema] = None

    model_config = ConfigDict(exclude_none=True)


class Note(Document):
    status: NoteStatus = Indexed(default=NoteStatus.processing)
    problem: ProblemDetailSchema = Field(default_factory=ProblemDetailSchema)
    note: NoteContentSchema = Field(default_factory=NoteContentSchema)
    language: str = "C++"
    userCode: str = ""
    userNotes: str = ""
    user_id: PydanticObjectId = Indexed()

    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updatedAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "notes"

    model_config = ConfigDict(
        extra="ignore",
        exclude_none=True  
    )