# app/schemas/note.py

from datetime import datetime
from typing import Optional, Any, Dict, List
from pydantic import BaseModel, ConfigDict, Field, BeforeValidator
from typing_extensions import Annotated

from app.models.note import (
    ProblemDetailSchema,
    NoteContentSchema,
    ApproachSchema,
    NoteStatus,
)

PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if v is not None else v)]


class NoteResponse(BaseModel):
    id: PyObjectId = Field(alias="_id") 
    status: NoteStatus
    problem: ProblemDetailSchema
    note: NoteContentSchema
    language: str
    userCode: str
    userNotes: str
    createdAt: datetime
    updatedAt: datetime
    user_id: PyObjectId 

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True, 
        exclude_none=True 
    )


# ==========================================
# PARTIAL UPDATE SCHEMAS (Granular Control)
# ==========================================
class NoteContentUpdate(BaseModel):
    intuition: Optional[str] = None
    edgeCases: Optional[List[str]] = None
    mistakesToAvoid: Optional[List[str]] = None
    dryRun: Optional[List[Dict[str, Any]]] = None
    bruteForce: Optional[ApproachSchema] = None    
    better: Optional[ApproachSchema] = None         
    optimalApproach: Optional[ApproachSchema] = None


class NoteUpdate(BaseModel):
    status: Optional[NoteStatus] = None
    problem: Optional[ProblemDetailSchema] = None
    note: Optional[NoteContentUpdate] = None
    language: Optional[str] = None
    userCode: Optional[str] = None
    userNotes: Optional[str] = None

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
    userNotes: str = ""


class SaveNoteRequest(BaseModel):
    problem: ProblemDetailSchema
    note: NoteContentSchema  
    language: str = "C++"
    userCode: str = ""
    userNotes: str = ""
    status: NoteStatus = NoteStatus.draft