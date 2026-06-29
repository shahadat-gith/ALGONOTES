from datetime import datetime, timezone
from enum import Enum

from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, ConfigDict, Field


class InterviewType(str, Enum):
    resume = "resume"
    company = "company"
    project = "project"


class InterviewStatus(str, Enum):
    generated = "generated"
    completed = "completed"
    evaluated = "evaluated"
    failed = "failed"


class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class Question(BaseModel):
    id: int
    question: str
    topic: str
    difficulty: Difficulty


class Answer(BaseModel):
    question_id: int
    answer: str


class Interview(Document):
    user_id: PydanticObjectId = Indexed()

    interview_type: InterviewType = Indexed()

    status: InterviewStatus = Indexed(
        default=InterviewStatus.generated
    )

    company: str | None = None

    role: str | None = None

    source: str | None = None

    questions: list[Question]

    answers: list[Answer] = []
    context: dict = {}

    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    updatedAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "interviews"

    model_config = ConfigDict(
        extra="ignore",
        exclude_none=True
    )