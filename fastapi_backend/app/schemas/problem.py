from typing import List, Optional, Literal
from pydantic import BaseModel, Field, HttpUrl


class CreateProblemRequest(BaseModel):
    title: str = Field(..., min_length=1)
    platform: Literal["LeetCode", "Codeforces", "GFG", "CodingNinjas", "Other"] = "LeetCode"
    problemLink: Optional[HttpUrl] = None
    difficulty: Optional[Literal["Easy", "Medium", "Hard"]] = None
    language: Literal["C++", "Java", "Python", "JavaScript", "TypeScript", "C"]
    topics: List[str] = Field(default_factory=list)
    userCode: str = Field(..., min_length=1)


class UpdateProblemRequest(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1)
    platform: Optional[Literal["LeetCode", "Codeforces", "GFG", "CodingNinjas", "Other"]] = None
    problemLink: Optional[HttpUrl] = None
    difficulty: Optional[Literal["Easy", "Medium", "Hard"]] = None
    language: Optional[Literal["C++", "Java", "Python", "JavaScript", "TypeScript", "C"]] = None
    topics: Optional[List[str]] = None
    userCode: Optional[str] = Field(default=None, min_length=1)
    isBookmarked: Optional[bool] = None
    needsRevision: Optional[bool] = None