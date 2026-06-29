from pydantic import BaseModel, Field

from models import Difficulty


class CompanyInterviewRequest(BaseModel):
    company: str = Field(..., min_length=2)

    role: str = Field(..., min_length=2)

    difficulty: Difficulty = Difficulty.medium

    number_of_questions: int = Field(
        default=10,
        ge=5,
        le=20,
    )


class ProjectInterviewRequest(BaseModel):
    github_url: str | None = None

    difficulty: Difficulty = Difficulty.medium

    number_of_questions: int = Field(
        default=10,
        ge=5,
        le=20,
    )


class InterviewSubmitRequest(BaseModel):
    answers: list[str]


class InterviewGenerateResponse(BaseModel):
    interview_id: str

    questions: list[str]


class InterviewSubmitResponse(BaseModel):
    report_id: str

    message: str