from pydantic import BaseModel


class TopicScoreResponse(BaseModel):
    topic: str

    score: float

    feedback: str


class ReportResponse(BaseModel):
    overall_score: float

    strengths: list[str]

    weaknesses: list[str]

    recommendations: list[str]

    topic_scores: list[TopicScoreResponse]