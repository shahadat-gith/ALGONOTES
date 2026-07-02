THEORY_SYSTEM_PROMPT = """
You are an expert Computer Science professor and technical educator.

Generate comprehensive, interview-ready and revision-friendly study guides.

Rules:
- Output ONLY valid semantic HTML.
- Do NOT use Markdown.
- Never generate invalid or unclosed HTML.
- Every HTML element must use the required algonotes-* CSS classes.
- Explain concepts clearly from fundamentals to advanced topics.
- Prefer depth, practical intuition and logical progression.
- Avoid repetition.
- Include code only when it improves understanding.
- Include image placeholders only when a diagram significantly improves understanding.
"""



from typing import Optional


def generate_theory_prompt(
    topic: str,
    code_language: Optional[str] = None,
    instructions: Optional[str] = None,
) -> str:

    selected_lang = code_language.strip() if code_language else None

    if selected_lang:
        data_lang = (
            selected_lang.lower()
            .replace("++", "pp")
            .replace("+", "p")
            .replace("#", "sharp")
        )

        language_rules = f"""
Programming Language:
{selected_lang}

If code examples are included:
- Use only {selected_lang}.
- Wrap every code block exactly as:

<pre class="algonotes-pre"><code class="algonotes-code-block" data-lang="{data_lang}">...</code></pre>

Do not generate code if it does not improve understanding.
"""
    else:
        language_rules = """
No programming language was specified.

If code is useful:
- Choose the most appropriate language.
- Otherwise prefer explanations, diagrams, tables or examples.
"""

    prompt = f"""
Topic:
{topic}

OUTPUT

Return ONLY semantic HTML.

Use only these HTML elements and classes:

<div class="algonotes-article">
<h1 class="algonotes-h1">
<h2 class="algonotes-h2">
<h3 class="algonotes-h3">
<p class="algonotes-p">
<ul class="algonotes-ul">
<ol class="algonotes-ol">
<li class="algonotes-li">
<blockquote class="algonotes-blockquote">
<table class="algonotes-table">
<tr class="algonotes-tr">
<th class="algonotes-th">
<td class="algonotes-td">
<code class="algonotes-inline-code">

{language_rules}

IMAGE PLACEHOLDERS

Insert image placeholders only when a diagram meaningfully improves understanding.

Format:

<img class="algonotes-img" src="image-placeholder-N" alt="Diagram title" />

Immediately follow every image with:

<p class="algonotes-image-description">
Describe what the diagram illustrates.
</p>

Increment N sequentially.

CONTENT

Cover the topic from fundamentals to advanced concepts.

Include relevant sections when appropriate:

- Definition
- Core Concepts
- Internal Working
- Architecture
- Algorithms
- Practical Examples
- Code Examples
- Comparisons
- Tables
- Advantages
- Disadvantages
- Time & Space Complexity
- Best Practices
- Common Mistakes
- Interview Tips
- Revision Summary
"""

    if instructions and instructions.strip():
        prompt += f"""

USER INSTRUCTIONS

{instructions.strip()}

Prioritize these instructions whenever possible.
"""

    return prompt.strip()