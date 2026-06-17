from datetime import datetime, timezone
from enum import Enum
from beanie import Document, Indexed, PydanticObjectId
from pydantic import Field, ConfigDict

class TheoryStatus(str, Enum):
    processing = "processing"
    draft = "draft"
    final = "final"
    failed = "failed"

class Theory(Document):
    status: TheoryStatus = Indexed(default=TheoryStatus.processing)
    topic: str = Indexed()
    content: str = "" 
    user_id: PydanticObjectId = Indexed()
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "theories"

    model_config = ConfigDict(
        extra="ignore",
        exclude_none=True
    )