from .base_prompt import SYSTEM_PROMPT, JSON_RULES

INTERVIEW_REPORT_PROMPT = f"""
{SYSTEM_PROMPT}

{JSON_RULES}

Create a professional interview report.

Evaluation:

{{evaluation}}

Return JSON.
"""