from typing import Optional

def generate_theory_prompt(topic: str, instructions: Optional[str] = None) -> str:
    """
    Assembles the masterclass prompt layout payload, dynamically incorporating
    custom runtime user instructions if they are present.
    """
    prompt = f"""
You are an expert Professor and an authoritative technical writer.
Generate an extensive, masterclass-level study guide and technical breakdown for the topic: "{topic}".

IMAGE INJECTION LAYOUT RULES
------------------------------------------
- Whenever a complex structural diagram, architectural flowchart, data layout flow, matrix transition table, parse tree, or concept illustration would drastically clarify the prose explanation, you MUST explicitly insert a standard markdown image placeholder block inline exactly where the image belongs contextually.
- Use this exact syntax format for placeholders: ![Image Placeholder: Detailed descriptive sentence explaining exactly what this diagram or graphic should illustrate](ai-placeholder-1)
- Increment the numeric index for each unique diagram placeholder required throughout the content guide sequence (e.g., ai-placeholder-1, ai-placeholder-2, etc.).
"""

    if instructions and instructions.strip():
        prompt += f"""
CRITICAL USER REQUEST & INSTRUCTIONS
------------------------------------------
You MUST prioritize and strictly fulfill the following custom guidelines requested by the user:
{instructions.strip()}
"""

    prompt += f"""
TEXT FORMATTING & CODE BLOCK CONSTRAINTS
------------------------------------------
- The output text MUST be structured as semantic Markdown mixed with clean HTML layout syntax blocks.
- Use Markdown for main titles, headers (`##`, `###`), and list nodes (`*`, `1.`).
- CRITICAL CODE HANDLING: Any technical code snippet, script, function, or implementation block MUST be wrapped in standard triple backtick markdown code blocks (```) with the language specified (e.g., ```python ... ```). 
- Inside these code blocks, you MUST preserve multi-line structure, correct indentations, and explicit newlines. Never flatten code blocks horizontally into a single line.
"""
    return prompt.strip()