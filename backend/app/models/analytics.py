from datetime import datetime, timezone

from beanie import Document, Indexed
from pydantic import ConfigDict, Field


class Analytics(Document):
    key: str = Indexed(unique=True)
    totalPageVisits: int = 0
    totalApiRequests: int = 0
    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updatedAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "analytics"

    model_config = ConfigDict(
        extra="ignore",
        exclude_none=True,
    )