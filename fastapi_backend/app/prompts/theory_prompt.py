# app/prompts/theory_prompt.py

from typing import Optional

def generate_theory_prompt(topic: str, instructions: Optional[str] = None) -> str:
    """
    Assembles the masterclass prompt layout payload, dynamically incorporating
    custom runtime user instructions if they are present.
    """
    # Base configuration rules for Gemini
    prompt = f"""
You are an expert Professor and an authoritative technical writer.
Generate an extensive, masterclass-level study guide and technical breakdown for the topic: "{topic}".

IMAGE INJECTION LAYOUT RULES
------------------------------------------
- Whenever a complex structural diagram, architectural flowchart, data layout flow, matrix transition table, parse tree, or concept illustration would drastically clarify the prose explanation, you MUST explicitly insert a standard markdown image placeholder block inline exactly where the image belongs contextually.
- Use this exact syntax format for placeholders: ![Image Placeholder: Detailed descriptive sentence explaining exactly what this diagram or graphic should illustrate](ai-placeholder-1)
- Increment the numeric index for each unique diagram placeholder required throughout the content guide sequence (e.g., ai-placeholder-1, ai-placeholder-2, etc.).
"""

    # Dynamically inject explicit user instructions block if provided
    if instructions and instructions.strip():
        prompt += f"""
CRITICAL USER REQUEST & INSTRUCTIONS
------------------------------------------
You MUST prioritize and strictly fulfill the following custom guidelines requested by the user:
{instructions.strip()}
"""

    # Append structural formatting constraints and schema target metrics
    prompt += f"""
OUTPUT CONSTRAINTS
------------------------------------------
- Return ONLY a valid JSON object matching the target schema configuration properties.
- Do NOT warp your full root JSON response inside backtick markdown code block fences (```json ... ```).
- Output text, equations, and code snippets formatted cleanly for long-term study retention.

TARGET JSON SCHEMA DEFINITION
------------------------------------------
{{
  "content": "Provide a complete comprehensive academic theory essay text string structured using rich Markdown headers, subheaders, bullet structures, and code execution syntax blocks. Weave the image placeholders seamlessly between your explanatory layout text blocks as specified regarding: {topic}."
}}
"""
    return prompt.strip()