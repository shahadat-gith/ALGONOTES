# app/models/temp.py

from datetime import datetime, timezone
from beanie import Document, Indexed, PydanticObjectId
from pydantic import Field, ConfigDict
from typing import Optional

from .theory import TheoryStatus


class TempPromptJob(Document):
    """
    Transient collection used solely to cycle async polling statuses for prompt optimization.
    Documents are automatically deleted immediately after the client polls the completed state.
    """
    status: TheoryStatus = Indexed(default=TheoryStatus.processing)
    topic: str
    optimized_instructions: Optional[str] = None
    error_message: Optional[str] = None
    user_id: PydanticObjectId = Indexed()
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "temp_prompt_jobs"
    
    model_config = ConfigDict(
        extra="ignore",
        exclude_none=True  
    )