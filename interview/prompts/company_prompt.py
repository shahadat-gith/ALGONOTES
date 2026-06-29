from .base_prompt import (
    SYSTEM_PROMPT,
    QUESTION_RULES,
    PROJECT_RULES,
    JSON_RULES,
)

PROJECT_INTERVIEW_PROMPT = f"""
{SYSTEM_PROMPT}

{QUESTION_RULES}

{PROJECT_RULES}

{JSON_RULES}

Project Summary:

{{context}}

Generate exactly {{number_of_questions}} interview questions.

Difficulty:

{{difficulty}}

Return JSON.
"""
