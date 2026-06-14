# app/schemas/note.py

from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field


class ContentBlockSchema(BaseModel):
    type: Literal["heading", "paragraph", "bullet", "step", "code", "table"]

    text: Optional[str] = None
    items: Optional[List[str]] = None
    code: Optional[str] = None
    language: Optional[str] = None
    table: Optional[List[Dict[str, Any]]] = None

    order: Optional[int] = 0


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
    summary: List[ContentBlockSchema] = Field(default_factory=list)
    intuition: List[ContentBlockSchema] = Field(default_factory=list)
    bruteForce: List[ContentBlockSchema] = Field(default_factory=list)
    optimalApproach: List[ContentBlockSchema] = Field(default_factory=list)
    algorithm: List[ContentBlockSchema] = Field(default_factory=list)
    dryRun: List[ContentBlockSchema] = Field(default_factory=list)
    complexity: List[ContentBlockSchema] = Field(default_factory=list)
    edgeCases: List[ContentBlockSchema] = Field(default_factory=list)
    mistakesToAvoid: List[ContentBlockSchema] = Field(default_factory=list)


class GenerateNoteRequest(BaseModel):
    problemLink: str = Field(..., min_length=1)
    userCode: str = Field(..., min_length=1)
    language: str = "C++"


class SaveNoteRequest(BaseModel):
    problem: ProblemDetailSchema
    note: NoteContentSchema
    language: str = "C++"
    userCode: str = ""
    status: Literal["processing", "draft", "final", "failed"] = "draft"