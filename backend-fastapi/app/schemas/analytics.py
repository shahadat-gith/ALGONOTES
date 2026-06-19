from pydantic import BaseModel


class AnalyticsStatsResponse(BaseModel):
    totalPageVisits: int
    totalApiRequestsServed: int
    totalRegisteredUsers: int
    totalCodingNotes: int
    totalTheoryNotes: int
    totalNotesCreated: int


class AnalyticsStatsEnvelope(BaseModel):
    success: bool
    stats: AnalyticsStatsResponse


class AnalyticsVisitTrackingResponse(BaseModel):
    success: bool
    message: str
    stats: AnalyticsStatsResponse