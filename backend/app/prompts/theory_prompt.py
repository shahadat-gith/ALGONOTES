from typing import Optional

def generate_theory_prompt(
    topic: str, 
  code_language: Optional[str] = None, 
    instructions: Optional[str] = None
) -> str:
    """
    Assembles the study note prompt layout. Automatically forces the AI to detect 
    relational transitions, dependency splits, and architectural pathways to insert 
    visual placeholders natively without relying on manual user inputs.
    """
    
    selected_lang = code_language.strip() if (code_language and code_language.strip()) else None

    language_rule = """
  CODE USAGE DECISION RULES
  ------------------------------------------
  - Include code blocks ONLY when code materially improves understanding of the topic.
  - If the topic is conceptual, theoretical, definitional, comparative, or non-implementation-focused, do NOT add code just to fill space.
  - If code is unnecessary, prefer examples, analogies, tables, diagrams, or step-by-step explanations instead.
  """

    if selected_lang:
      data_lang_value = selected_lang.lower().replace('+', 'p')
      language_rule += f"""
PREFERRED PROGRAMMING LANGUAGE CONSTRAINT
------------------------------------------
- The target programming language for this note is **{selected_lang}**.
  - If you include any code examples, technical implementations, data structure structures, or scripts, you MUST write them strictly in **{selected_lang}**.
  - For any included code block, you MUST set the element attribute exactly like this: `data-lang="{data_lang_value}"`.
  """
    else:
      language_rule += """
  NO FIXED LANGUAGE SELECTED
  ------------------------------------------
  - No programming language was selected by the user.
  - If code is genuinely needed, choose the single most natural and beginner-friendly language for the topic and use it consistently.
  - If code is not necessary, do not include any code blocks.
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

DYNAMIC MULTI-LINE CODE WRAPPING CONSTRAINTS
------------------------------------------
- If you include technical source code blocks, implementations, or script snippets, you MUST wrap them inside a combination of an HTML `<pre>` block and a code block.
- You MUST format any included code exactly like this, filling in the correct lowercase language name token in the `data-lang` slot:
  <pre class="algonotes-pre"><code class="algonotes-code-block" data-lang="lowercase_language_name">... Your code goes here ...</code></pre>
- Inside these multi-line code blocks, you MUST preserve all original indentations, tabs, multi-line structures, and precise line breaks. Never flatten a block of source code horizontally into a single layout line.
{language_rule}
IMAGE INJECTION & CAPTIONING RULES
------------------------------------------
- STRATEGIC INSERTS: You MUST automatically insert an image placeholder tag inline whenever an architectural dependency mapping diagram, relational layout transition, data structure tree, flow chart, or data pipeline model or any other relevant image needed(if no image is needed then dont need to add image placeholder) would naturally clarify the prose explanation. Do not wait for the user to ask for it.
- Use this exact tag syntax structure for image blocks (DO NOT use "ai-" in the src naming convention):
  <img class="algonotes-img" src="image-placeholder-1" alt="Short descriptive title of the image" />
- CRITICAL: Immediately below the `<img>` tag, you MUST provide an accompanying descriptive paragraph containing a complete, helpful sentence explaining exactly what the diagram or graphic illustrates. Format it exactly like this:
  <p class="algonotes-image-description">descriptive sentence explaining exactly what this diagram or graphic illustrates.</p>
- Increment the numeric index for each unique diagram placeholder required throughout the content guide sequence (e.g., image-placeholder-1, image-placeholder-2, etc.).
"""

    if instructions and instructions.strip():
        prompt += f"""
CRITICAL USER REQUEST & INSTRUCTIONS
------------------------------------------
You MUST prioritize and strictly fulfill the following custom guidelines requested by the user:
{instructions.strip()}
"""

    return prompt.strip()