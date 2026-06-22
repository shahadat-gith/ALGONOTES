from app.models import Analytics, Note, Theory, User
from app.schemas.analytics import AnalyticsStatsResponse


GLOBAL_ANALYTICS_KEY = "global"


async def ensure_analytics_document() -> Analytics:
    analytics = await Analytics.find_one(
        Analytics.key == GLOBAL_ANALYTICS_KEY
    )

    if analytics:
        return analytics

    analytics = Analytics(key=GLOBAL_ANALYTICS_KEY)
    await analytics.insert()
    return analytics


async def build_analytics_stats() -> AnalyticsStatsResponse:
    analytics = await ensure_analytics_document()
    total_registered_users = await User.find_all().count()
    total_coding_notes = await Note.find_all().count()
    total_theory_notes = await Theory.find_all().count()

    return AnalyticsStatsResponse(
        totalPageVisits=analytics.totalPageVisits,
        totalApiRequestsServed=analytics.totalApiRequests,
        totalRegisteredUsers=total_registered_users,
        totalCodingNotes=total_coding_notes,
        totalTheoryNotes=total_theory_notes,
        totalNotesCreated=total_coding_notes + total_theory_notes,
    )