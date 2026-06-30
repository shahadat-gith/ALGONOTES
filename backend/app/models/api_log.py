# app/models/api_log.py

from datetime import datetime, timezone
from typing import Optional

from beanie import Document, Indexed
from pydantic import Field, ConfigDict
from pymongo import IndexModel, DESCENDING


class ApiLog(Document):
    method: str = Indexed()
    path: str = Indexed()
    status_code: int
    user_id: Optional[str] = Indexed(default=None)
    ip_address: str = ""
    user_agent: str = ""
    duration_ms: float = 0.0
    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "api_logs"
        indexes = [
            IndexModel([("createdAt", DESCENDING)]),
        ]

    model_config = ConfigDict(
        extra="ignore",
        exclude_none=True,
    )
