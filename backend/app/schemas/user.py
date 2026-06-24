# app/schemas/user.py

from datetime import datetime
from typing import Optional, Any, List, Literal
from pydantic import (
    BaseModel,
    EmailStr,
    ConfigDict,
    field_validator,
)

from app.schemas.analytics import AnalyticsStatsResponse


class AvatarResponse(BaseModel):
    url: str = ""
    public_id: str = ""

    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    username: Optional[str] = None
    leetcode_username: Optional[str] = None
    avatar: AvatarResponse

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True  # Guarantees frictionless _id lookup
    )

    @field_validator("id", mode="before")
    @classmethod
    def convert_object_id(cls, value: Any) -> str:
        return str(value)


class DashboardSummaryStats(BaseModel):
    totalCodingNotes: int
    totalTheoryNotes: int
    pendingDrafts: int


class DashboardRecentActivityItem(BaseModel):
    id: str
    type: Literal["DSA", "Theory"]
    title: str
    info: str
    status: str
    href: str
    createdAt: datetime
    updatedAt: datetime


class DashboardResponse(BaseModel):
    greetingName: str
    stats: DashboardSummaryStats
    recentActivity: List[DashboardRecentActivityItem]
    platformStats: AnalyticsStatsResponse


class DashboardEnvelope(BaseModel):
    success: bool
    dashboard: DashboardResponse