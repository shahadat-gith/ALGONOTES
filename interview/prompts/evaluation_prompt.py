from .base_prompt import (
    SYSTEM_PROMPT,
    EVALUATION_RULES,
    JSON_RULES,
)

INTERVIEW_EVALUATION_PROMPT = f"""
{SYSTEM_PROMPT}

{EVALUATION_RULES}

{JSON_RULES}

Interview:

{{interview}}

Candidate Answers:

{{answers}}

Return JSON:

{{
    "overall_score": 0,
    "strengths": [],
    "weaknesses": [],
    "recommendations": [],
    "topic_scores": [
        {{
            "topic": "",
            "score": 0,
            "feedback": ""
        }}
    ]
}}
"""