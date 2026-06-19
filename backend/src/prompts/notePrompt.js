

export const generateNotePrompt = (problem_link, userCode, language, userNotes) => {
  const cleaned_notes = userNotes ? userNotes.trim() : "";
  
  let userNotesSection = "";
  if (cleaned_notes) {
    userNotesSection = `
USER RAW OBSERVATIONS & SHORTER NOTES
------------------------------------------
${cleaned_notes}

CRITICAL PROCESSING INSTRUCTIONS FOR USER NOTES:
1. Treat the text block above as rough, shorthand notes written by the user.
2. Translate, improve, and expand these rough points into clear, easy-to-understand layman terms (simple English that makes sense at a glance). Avoid heavy academic jargon.
3. You MUST return this polished version as a string mapped to the top-level "userNotes" key in the final JSON response (completely separate from the "note" and "problem" objects).
4. Also, weave these insights naturally into the "intuition" and "mistakesToAvoid" sections inside the "note" object where appropriate.
`;
  }

  return `
You are a helpful programming mentor and a strict JSON generation engine.

Create a high-quality, friendly, revision-ready coding note based on the target JSON layout definitions below.

INPUTS & OBSERVATIONS
------------------------------------------
${userNotesSection}

Problem Link:
${problem_link}

User Code Language:
${language}

userCode:
${userCode}

OUTPUT RULES
------------------------------------------
- Return ONLY valid JSON.
- Do NOT use markdown code fences (e.g., do not wrap response in \`\`\`json ... \`\`\`).
- Do NOT write conversational explanations before or after the JSON payload.
- Never omit the top-level keys: "problem", "note", and "userNotes".

TARGET JSON SCHEMA DEFINITION
------------------------------------------
Your JSON response must match this schema structure exactly. Note that "bruteForce", "better", and "optimalApproach" are completely conditional. If an approach does not realistically exist for this problem, output its value as null:

{
  "problem": {
    "title": "Problem Title",
    "problemLink": "${problem_link}",
    "platform": "LeetCode / Codeforces / HackerRank / etc.",
    "difficulty": "Easy / Medium / Hard",
    "description": "Clear standalone problem statement overview text",
    "constraints": ["Constraint line 1", "Constraint line 2"],
    "testCases": [
      {
        "input": "Input state parameter trace details",
        "output": "Expected return output context",
        "explanation": "Optional logic trail narrative statement"
      }
    ],
    "expectedTimeComplexity": "O(N)",
    "expectedSpaceComplexity": "O(1)",
    "topics": ["Array", "Two Pointers"]
  },

  "note": {
    "intuition": "The high-level intuitive 'aha!' moment behind breaking down the solution logic canvas. Break sentences with periods cleanly.",
    "edgeCases": ["Tricky boundary constraint situations to verify like empty arrays, overflows, single nodes, etc."],
    "mistakesToAvoid": ["Common pitfalls, off-by-one errors, or tracking oversights to watch out for."],
    "dryRun": [
      {
        "step": "1",
        "state": "i = 0, pointers initialized",
        "action": "Evaluate index condition match",
        "result": "Increment execution pointers"
      }
    ],
    "bruteForce": {
      "complexity": {
        "time": "O(N^2)",
        "space": "O(1)"
      },
      "description": "Narrative plain text paragraph mapping out the naive baseline implementation pattern step by step.",
      "codeBlock": {"language": "${language}", "code": "Standard code snippet block string representation"},
      "algorithmSteps": ["Step 1 narrative block description", "Step 2 execution marker statement"]
    },
    "better": {
      "complexity": {
        "time": "O(N log N)",
        "space": "O(N)"
      },
      "description": "The intermediate optimized algorithmic transition strategy written as clean prose text if applicable. Use null if no distinct better step exists.",
      "codeBlock": {"language": "${language}", "code": "Code implementation snippet line text format"},
      "algorithmSteps": ["Detailed action statement sequence details"]
    },
    "optimalApproach": {
      "complexity": {
        "time": "O(N)",
        "space": "O(1)"
      },
      "description": "The ultimate fully streamlined gold-standard implementation methodology structure string description.",
      "codeBlock": {"language": "${language}", "code": "Highly optimized solution production script block code"},
      "algorithmSteps": ["Logical processing pipeline markers text list"]
    }
  },

  "userNotes": "Your polished, expanded, layman-friendly translation of the user's rough observations goes here as a separate top-level string."
}
`.strip();
};