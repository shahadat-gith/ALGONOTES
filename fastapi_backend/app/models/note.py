# app/models/note.py


from datetime import datetime, timezone
from enum import Enum
from typing import List, Dict, Any, Optional

from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, Field, ConfigDict


# ==========================================
# ENUMS
# ==========================================
class NoteStatus(str, Enum):
    processing = "processing"
    draft = "draft"
    final = "final"
    failed = "failed"


# ==========================================
# REUSABLE COMPONENT SCHEMAS (No Nulls)
# ==========================================
class TextParagraph(BaseModel):
    """Simple rich-text style paragraph or heading."""
    type: str = "paragraph"  # e.g., "heading", "paragraph"
    text: str


class CodeImplementation(BaseModel):
    """Strict schema for code blocks."""
    language: str = "C++"
    code: str


# ==========================================
# APPROACH SCHEMA (Brute Force & Optimal)
# ==========================================
class ApproachSchema(BaseModel):
    """Used for bruteForce and optimalApproach."""
    description: List[TextParagraph] = Field(default_factory=list)
    codeBlock: Optional[CodeImplementation] = None
    algorithmSteps: List[str] = Field(default_factory=list)

    # Automatically drops 'codeBlock' key if it is None when serialized
    model_config = ConfigDict(exclude_none=True)


# ==========================================
# PROBLEM DETAILS SCHEMA
# ==========================================
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


# ==========================================
# STRONGLY TYPED NOTE CONTENT
# ==========================================
class NoteContentSchema(BaseModel):
    summary: List[str] = Field(default_factory=list)
    intuition: List[str] = Field(default_factory=list)
    complexity: List[str] = Field(default_factory=list)
    edgeCases: List[str] = Field(default_factory=list)
    mistakesToAvoid: List[str] = Field(default_factory=list)

    # Fixed: Changed lower 'any' to 'Any' to avoid runtime NameError
    dryRun: List[Dict[str, Any]] = Field(default_factory=list)

    bruteForce: Optional[ApproachSchema] = None
    optimalApproach: Optional[ApproachSchema] = None

    # Keeps MongoDB completely clean of null optional approaches
    model_config = ConfigDict(exclude_none=True)


# ==========================================
# NOTE DOCUMENT
# ==========================================
class Note(Document):
    status: NoteStatus = Indexed(default=NoteStatus.processing)
    problem: ProblemDetailSchema = Field(default_factory=ProblemDetailSchema)
    note: NoteContentSchema = Field(default_factory=NoteContentSchema)
    language: str = "C++"
    userCode: str = ""
    user_id: PydanticObjectId = Indexed()

    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updatedAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "notes"

    # Correct Pydantic v2 configuration style for Beanie documents
    model_config = ConfigDict(
        extra="ignore",
        exclude_none=True  # Crucial: This explicitly blocks null fields from writing to Mongo
    )