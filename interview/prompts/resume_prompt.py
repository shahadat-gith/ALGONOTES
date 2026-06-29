from .base_prompt import SYSTEM_PROMPT, QUESTION_RULES, JSON_RULES

RESUME_INTERVIEW_PROMPT = f"""
{SYSTEM_PROMPT}

{QUESTION_RULES}

{JSON_RULES}

Generate a technical interview based ONLY on the provided resume.

Context:

{{context}}

Difficulty:

{{difficulty}}

Generate exactly {{number_of_questions}} questions.

Return JSON:

[
    {{
        "id": 1,
        "question": "",
        "topic": "",
        "difficulty": ""
    }}
]
"""