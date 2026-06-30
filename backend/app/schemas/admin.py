# app/schemas/admin.py

from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict


class AdminLoginRequest(BaseModel):
    email: str
    password: str


class AdminLoginResponse(BaseModel):
    success: bool
    token: str
    message: str


class AdminUserItem(BaseModel):
    id: str
    name: str
    email: str
    username: Optional[str] = None
    leetcode_username: Optional[str] = None
    avatar_url: str = ""
    total_notes: int = 0
    total_theories: int = 0
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminUsersResponse(BaseModel):
    success: bool
    users: List[AdminUserItem]
    total: int
    page: int
    pageSize: int
    totalPages: int


class AdminLogItem(BaseModel):
    id: str
    method: str
    path: str
    status_code: int
    user_id: Optional[str] = None
    ip_address: str = ""
    user_agent: str = ""
    duration_ms: float = 0.0
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminLogsResponse(BaseModel):
    success: bool
    logs: List[AdminLogItem]
    total: int
    page: int
    pageSize: int
    totalPages: int


class AdminDetailedStats(BaseModel):
    totalUsers: int
    totalCodingNotes: int
    totalTheoryNotes: int
    totalNotes: int
    totalPageVisits: int
    totalApiRequests: int
    notesByStatus: dict
    theoriesByStatus: dict
    recentLogsCount24h: int


class AdminStatsResponse(BaseModel):
    success: bool
    stats: AdminDetailedStats


class AdminNoteItem(BaseModel):
    id: str
    title: str
    platform: str = ""
    difficulty: str = ""
    language: str = ""
    status: str
    user_email: str = ""
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminNotesResponse(BaseModel):
    success: bool
    notes: List[AdminNoteItem]
    total: int
    page: int
    pageSize: int
    totalPages: int


class AdminTheoryItem(BaseModel):
    id: str
    topic: str
    status: str
    user_email: str = ""
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminTheoriesResponse(BaseModel):
    success: bool
    theories: List[AdminTheoryItem]
    total: int
    page: int
    pageSize: int
    totalPages: int
