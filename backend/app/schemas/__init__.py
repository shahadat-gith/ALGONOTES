# app/schemas/__init__.py

from .auth import (
    RegisterRequest,
    LoginRequest,
    ForgotPasswordRequest,
)

from .user import (
    UserResponse,
    DashboardSummaryStats,
    DashboardRecentActivityItem,
    DashboardResponse,
    DashboardEnvelope,
)

from .note import (
    NoteResponse,
    NoteUpdate,
    GenerateNoteRequest,
    SaveNoteRequest,
)

from .theory import (
    GenerateTheoryRequest, 
    TheoryResponse,         
    TheoryUpdate,           
)

from .analytics import (
    AnalyticsStatsResponse,
    AnalyticsStatsEnvelope,
    AnalyticsVisitTrackingResponse,
)

from app.models.note import (
    ProblemDetailSchema,
    NoteContentSchema,
)

__all__ = [
    "RegisterRequest",
    "LoginRequest",
    "ForgotPasswordRequest",

    "UserResponse",
    "DashboardSummaryStats",
    "DashboardRecentActivityItem",
    "DashboardResponse",
    "DashboardEnvelope",

    "GenerateNoteRequest",
    "SaveNoteRequest",
    "ProblemDetailSchema",
    "NoteContentSchema",

    "NoteResponse",
    "NoteUpdate",

    "GenerateTheoryRequest",  
    "TheoryResponse",         
    "TheoryUpdate",           

    "AnalyticsStatsResponse",
    "AnalyticsStatsEnvelope",
    "AnalyticsVisitTrackingResponse",
]