from datetime import datetime, timezone

from beanie import Document, Indexed, PydanticObjectId
from pydantic import ConfigDict, Field


class Resume(Document):
    user_id: PydanticObjectId = Indexed()

    filename: str

    content: str

    extracted_data: dict = {}

    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    updatedAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "resumes"

    model_config = ConfigDict(
        extra="ignore",
        exclude_none=True
    )