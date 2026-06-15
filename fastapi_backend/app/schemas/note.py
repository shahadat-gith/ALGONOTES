from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field


# ==========================================
# 1. POLYMORPHIC CONTENT BLOCK SCHEMA
# ==========================================
class ContentBlockSchema(BaseModel):
    type: Literal["heading", "paragraph", "bullet", "step", "code", "table"]

    text: Optional[str] = None
    items: Optional[List[str]] = None
    code: Optional[str] = None
    language: Optional[str] = None
    table: Optional[List[Dict[str, Any]]] = None

    order: int = Field(default=0, description="Sequential ordering position index")


# ==========================================
# 2. PROBLEM DETAILED METADATA SCHEMA
# ==========================================
class ProblemDetailSchema(BaseModel):
    title: str = ""
    problemLink: str = ""  # Stabilized with standard string fallback default
    platform: str = ""
    difficulty: str = ""
    description: str = ""
    constraints: List[str] = Field(default_factory=list)
    testCases: List[Dict[str, Any]] = Field(default_factory=list)
    expectedTimeComplexity: str = ""
    expectedSpaceComplexity: str = ""
    topics: List[str] = Field(default_factory=list)


# ==========================================
# 3. AI GENERATED STUDY NOTE NESTED TREE
# ==========================================
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


# ==========================================
# 4. INITIAL AI DISPATCH INBOUND REQUEST
# ==========================================
class GenerateNoteRequest(BaseModel):
    problemLink: str = Field(..., min_length=1, description="Target coding challenge platform URL")
    userCode: str = Field(..., min_length=1, description="Raw source solution text payload")
    language: str = Field(default="C++", description="Programming execution syntax label")


# ==========================================
# 5. USER MANUAL DRAFT SAVING REQUEST
# ==========================================
class SaveNoteRequest(BaseModel):
    problem: ProblemDetailSchema
    note: NoteContentSchema
    language: str = "C++"
    userCode: str = ""
    status: Literal["processing", "draft", "final", "failed"] = "draft"