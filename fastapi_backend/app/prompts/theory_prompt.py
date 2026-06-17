# app/prompts/theory_prompt.py

def generate_theory_prompt(topic: str) -> str:
    return f"""
You are an expert Computer Science professor and an authoritative technical writer.
Generate an extensive, masterclass-level study guide and technical breakdown for the topic: "{topic}".

OUTPUT RULES
------------------------------------------
- Return ONLY valid JSON matching the schema definitions layout target properties.
- Do NOT use markdown code block fences.
- Output text values using clear, clean language formatted for revisions.

TARGET JSON SCHEMA DEFINITION
------------------------------------------
{{
  "content": "Provide a complete comprehensive academic theory essay text string structured using clean formatting blocks. Include a granular architectural deep dive, core functional paradigms, mathematical foundations if applicable, use cases, and design trade-offs regarding: {topic}."
}}
""".strip()