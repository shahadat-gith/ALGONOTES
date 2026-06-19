export const generateTheoryPrompt = (topic, codeLanguage = "C++", instructions = null) => {
  const selected_lang = codeLanguage && codeLanguage.trim() ? codeLanguage.trim() : "C++";
  
  // FIX: Fixed the incorrect .lowerCase reference with standard JS string functions
  const lowerLang = selected_lang.toLowerCase();
  const data_lang_value = lowerLang.includes('++') ? lowerLang.replace(/\+\+/g, 'pp') : lowerLang;
  
  const language_rule = `
PREFERRED PROGRAMMING LANGUAGE CONSTRAINT
------------------------------------------
- The target programming language for this note is **${selected_lang}**.
- You MUST write all code examples, technical implementations, data structure structures, and scripts strictly in **${selected_lang}**.
- You MUST set the element attribute to match this language lowercase tag, exactly like this: \`data-lang="${data_lang_value}"\` (e.g., cpp, java, python, javascript).
`;

  let prompt = `
You are an expert Professor and an authoritative technical writer.
Generate an extensive, masterclass-level study guide and technical breakdown for the topic: "${topic}".

STRICT OUTPUT SYNTAX: PURE HTML ONLY
------------------------------------------
- You MUST write the entire document using raw, semantic HTML tags. 
- DO NOT use any Markdown formatting syntax (no \`#\`, \`##\`, \`**\`, \`*\`, or standard markdown links).
- Every single HTML element you open MUST include a specific class layout parameter decorated with our custom \`algonotes-\` structural prefix class design tokens.

ELEMENT CLASS DICTIONARY MATRIX
------------------------------------------
Decorate every injected HTML node strictly according to this class structure map:
- Parent Article Wrapper: <div class="algonotes-article">...</div>
- Primary Titles / Section Headers: <h1 class="algonotes-h1">, <h2 class="algonotes-h2">, <h3 class="algonotes-h3">
- Narrative Blocks: <p class="algonotes-p">
- Lists: <ul class="algonotes-ul">, <ol class="algonotes-ol">, <li class="algonotes-li">
- Blockquotes / Notes: <blockquote class="algonotes-blockquote">
- Tabular Layouts: <table class="algonotes-table">, <tr class="algonotes-tr">, <th class="algonotes-th">, <td class="algonotes-td">
- Inline code words/variables: <code class="algonotes-inline-code">

DYNAMIC MULTI-LINE CODE WRAPPING CONSTRAINTS
------------------------------------------
- For technical source code blocks, implementations, or script snippets, you MUST wrap them inside a combination of an HTML <pre> block and a code block.
- You MUST format it exactly like this, filling in the correct lowercase language name token in the \`data-lang\` slot:
  <pre class="algonotes-pre"><code class="algonotes-code-block" data-lang="lowercase_language_name">... Your code goes here ...</code></pre>
- Inside these multi-line code blocks, you MUST preserve all original indentations, tabs, multi-line structures, and precise line breaks. Never flatten a block of source code horizontally into a single layout line.
${language_rule}
IMAGE INJECTION & CAPTIONING RULES
------------------------------------------
- STRATEGIC INSERTS: You MUST automatically insert an image placeholder tag inline whenever an architectural dependency mapping diagram, relational layout transition, data structure tree, flow chart, or data pipeline model or any other relevant image needed(if no image is needed then dont need to add image placeholder) would naturally clarify the prose explanation. Do not wait for the user to ask for it.
- Use this exact tag syntax structure for image blocks (DO NOT use "ai-" in the src naming convention):
  <img class="algonotes-img" src="image-placeholder-1" alt="Short descriptive title of the image" />
- CRITICAL: Immediately below the \`<img>\` tag, you MUST provide an accompanying descriptive paragraph containing a complete, helpful sentence explaining exactly what the diagram or graphic illustrates. Format it exactly like this:
  <p class="algonotes-image-description">descriptive sentence explaining exactly what this diagram or graphic illustrates.</p>
- Increment the numeric index for each unique diagram placeholder required throughout the content guide sequence (e.g., image-placeholder-1, image-placeholder-2, etc.).
`;

  if (instructions && instructions.trim()) {
    prompt += `
CRITICAL USER REQUEST & INSTRUCTIONS
------------------------------------------
You MUST prioritize and strictly fulfill the following custom guidelines requested by the user:
${instructions.trim()}
`;
  }

  return prompt.trim();
};