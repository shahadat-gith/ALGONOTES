from datetime import datetime, timezone

from beanie import Document, Indexed, PydanticObjectId
from pydantic import ConfigDict, Field


class Report(Document):
    interview_id: PydanticObjectId = Indexed()

    user_id: PydanticObjectId = Indexed()

    overall_score: float

    strengths: list[str] = []

    weaknesses: list[str] = []

    recommendations: list[str] = []

    topic_scores: list[dict] = []

    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    updatedAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "reports"

    model_config = ConfigDict(
        extra="ignore",
        exclude_none=True
    )