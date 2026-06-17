from typing import Optional

def generate_theory_prompt(topic: str, instructions: Optional[str] = None) -> str:
    """
    Assembles the masterclass prompt layout payload, dynamically incorporating
    custom runtime user instructions if they are present. Forces the AI to output
    pure semantic HTML using custom 'algonotes-' prefix classes.
    """
    prompt = f"""
You are an expert Professor and an authoritative technical writer.
Generate an extensive, masterclass-level study guide and technical breakdown for the topic: "{topic}".

STRICT OUTPUT SYNTAX: PURE HTML ONLY
------------------------------------------
- You MUST write the entire document using raw, semantic HTML tags. 
- DO NOT use any Markdown formatting syntax (no `#`, `##`, `**`, `*`, or standard markdown links).
- Every single HTML element you open MUST include a specific class layout parameter decorated with our custom `algonotes-` structural prefix class design tokens.

ELEMENT CLASS DICTIONARY MATRIX
------------------------------------------
Decorate every injected HTML node strictly according to this class structure map:
- Parent Article Wrapper: `<div class="algonotes-article">...</div>`
- Primary Titles / Section Headers: `<h1 class="algonotes-h1">`, `<h2 class="algonotes-h2">`, `<h3 class="algonotes-h3">`
- Narrative Blocks: `<p class="algonotes-p">`
- Lists: `<ul class="algonotes-ul">`, `<ol class="algonotes-ol">`, `<li class="algonotes-li">`
- Blockquotes / Notes: `<blockquote class="algonotes-blockquote">`
- Tabular Layouts: `<table class="algonotes-table">`, `<tr class="algonotes-tr">`, `<th class="algonotes-th">`, `<td class="algonotes-td">`
- Inline code words/variables: `<code class="algonotes-inline-code">`

CRITICAL RAW MULTI-LINE CODE WRAPPING CONSTRAINTS
------------------------------------------
- For technical source code blocks, implementations, or script snippets, you MUST wrap them inside a combination of an HTML `<pre>` block and a code block like this:
  <pre class="algonotes-pre"><code class="algonotes-code-block" data-lang="python">... Your code goes here ...</code></pre>
- Inside these multi-line code blocks, you MUST preserve all original indentations, tabs, multi-line structures, and precise line breaks. Never flatten a block of source code horizontally into a single layout line.

IMAGE INJECTION LAYOUT RULES
------------------------------------------
- Whenever a complex structural diagram, architectural flowchart, data layout flow, or concept illustration would clarify the prose explanation, you MUST explicitly insert an HTML image tag inline exactly where the graphic belongs contextually.
- Use this exact tag syntax structure for image blocks:
  <img class="algonotes-img" src="ai-placeholder-1" alt="Detailed descriptive sentence explaining exactly what this diagram or graphic illustrates" />
- Increment the numeric index for each unique diagram placeholder required throughout the content guide sequence (e.g., ai-placeholder-1, ai-placeholder-2, etc.).
"""

    if instructions and instructions.strip():
        prompt += f"""
CRITICAL USER REQUEST & INSTRUCTIONS
------------------------------------------
You MUST prioritize and strictly fulfill the following custom guidelines requested by the user:
{instructions.strip()}
"""

    return prompt.strip()