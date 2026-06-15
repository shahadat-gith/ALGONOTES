# app/schemas/note.py

from datetime import datetime
from typing import Optional, Literal, Any 

# Added BeforeValidator for ObjectId translation, Field for aliases, and Annotated for type-safety
from pydantic import BaseModel, ConfigDict, Field, BeforeValidator
from typing_extensions import Annotated

from app.models.note import (
    ProblemDetailSchema,
    NoteContentSchema,
    NoteStatus,
)

# ==========================================
# CUSTOM TYPE DEFINITION
# ==========================================
# Reusable type modifier: Converts native MongoDB ObjectIds safely into strings 
# before validation engine parsing rules execute.
PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if v is not None else v)]


# ==========================================
# NOTE RESPONSE SCHEMA
# ==========================================
class NoteResponse(BaseModel):
    # Fixed: Uses PyObjectId type and matches MongoDB's original '_id' key via alias
    id: PyObjectId = Field(alias="_id") 
    status: NoteStatus
    problem: ProblemDetailSchema
    note: NoteContentSchema
    language: str
    userCode: str
    createdAt: datetime
    updatedAt: datetime
    user_id: PyObjectId 

    model_config = ConfigDict(
        from_attributes=True,
        # Crucial: Allows fields to be populated using either their internal DB alias ('_id') 
        # or their defined schema property name ('id') during 'model_validate()'
        populate_by_name=True, 
        # Forces FastAPI to drop any top-level key that is None during serialization
        exclude_none=True 
    )


# ==========================================
# PARTIAL UPDATE SCHEMAS (Granular Control)
# ==========================================
class NoteContentUpdate(BaseModel):
    """
    Allows updating individual sections of a note without rewriting 
    the entire NoteContentSchema block. All fields default to None.
    """
    summary: Optional[list[str]] = None
    intuition: Optional[list[str]] = None
    complexity: Optional[list[str]] = None
    edgeCases: Optional[list[str]] = None
    mistakesToAvoid: Optional[list[str]] = None
    dryRun: Optional[list[dict[str, Any]]] = None
    bruteForce: Optional[dict[str, Any]] = None     # Maps to ApproachSchema
    optimalApproach: Optional[dict[str, Any]] = None # Maps to ApproachSchema


# ==========================================
# NOTE UPDATE SCHEMA
# ==========================================
class NoteUpdate(BaseModel):
    status: Optional[NoteStatus] = None
    problem: Optional[ProblemDetailSchema] = None
    note: Optional[NoteContentUpdate] = None
    language: Optional[str] = None
    userCode: Optional[str] = None

    model_config = ConfigDict(
        extra="ignore",
        exclude_none=True
    )


# ==========================================
# REQUEST DTO SCHEMAS
# ==========================================
class GenerateNoteRequest(BaseModel):
    problemLink: str = Field(..., min_length=1)
    userCode: str = Field(..., min_length=1)
    language: str = "C++"


class SaveNoteRequest(BaseModel):
    problem: ProblemDetailSchema
    note: NoteContentSchema
    language: str = "C++"
    userCode: str = ""
    status: NoteStatus = NoteStatus.draft