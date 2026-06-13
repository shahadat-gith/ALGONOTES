from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class ContentBlockSchema(BaseModel):
    type: Literal["paragraph", "heading", "bullet", "step", "code", "table"]
    text: Optional[str] = ""
    order: Optional[int] = 0
    items: List[str] = Field(default_factory=list)
    code: Optional[str] = ""


class AlgorithmStepSchema(BaseModel):
    stepNo: int
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)


class DryRunStepSchema(BaseModel):
    stepNo: int
    inputState: Optional[str] = ""
    action: str = Field(..., min_length=1)
    outputState: Optional[str] = ""
    explanation: str = Field(..., min_length=1)


class EdgeCaseSchema(BaseModel):
    case: str = Field(..., min_length=1)
    explanation: str = Field(..., min_length=1)


class SaveNoteRequest(BaseModel):
    problem_id: int
    bruteForce: List[ContentBlockSchema] = Field(default_factory=list)
    optimalApproach: List[ContentBlockSchema] = Field(default_factory=list)
    algorithm: List[AlgorithmStepSchema] = Field(default_factory=list)
    dryRun: List[DryRunStepSchema] = Field(default_factory=list)
    edgeCases: List[EdgeCaseSchema] = Field(default_factory=list)
    status: Optional[Literal["processing", "draft", "final", "failed"]] = "draft"