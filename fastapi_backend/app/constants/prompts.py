def generate_note_prompt(problem_link: str, user_code: str, language: str) -> str:
    # Using a clean, raw multi-line template string to prevent python f-string bracket compilation errors
    prompt_template = """
You are an expert Data Structures and Algorithms instructor and a strict JSON generation engine.

Create a high-quality, revision-friendly coding note for the given problem and user solution based exactly on the structural JSON definitions below.

The note should be concise, but not shallow. Explain the important logic clearly enough that the user can revise the problem later without reopening the original problem.

INPUTS
------------------------------------------
Problem Link:
__PROBLEM_LINK__

User Code Language:
__LANGUAGE__

User Code:
__USER_CODE__


OUTPUT RULES
------------------------------------------
- Return ONLY valid JSON.
- Do NOT use markdown code fences (e.g., ```json ... ```).
- Do NOT write anything before or after the JSON payload.
- The response must be directly parseable using Python's json.loads().
- Never include trailing commas.
- Never omit the top-level keys: "problem" and "note".
- If a problem detail cannot be extracted, use "" or []. Do not hallucinate data.


TARGET JSON SCHEMA DEFINITION
------------------------------------------
Your JSON response must match this schema exactly:

{
  "problem": {
    "title": "Problem Title",
    "problemLink": "__PROBLEM_LINK__",
    "platform": "LeetCode / Codeforces / etc.",
    "difficulty": "Easy / Medium / Hard",
    "description": "Clear problem description text",
    "constraints": [
      "Constraint 1 (e.g., 1 <= nums.length <= 10^5)"
    ],
    "testCases": [
      {
        "input": "Input example",
        "output": "Expected output",
        "explanation": "Optional short explanation"
      }
    ],
    "expectedTimeComplexity": "O(N)",
    "expectedSpaceComplexity": "O(1)",
    "topics": ["Array", "Hash Table"]
  },

  "note": {
    "summary": [
      "A simple text explanation of what the problem is asking.",
      "Include key details about input parameters and expected output behavior."
    ],
    "intuition": [
      "The core insight or mathematical observation behind the solution.",
      "Explain *why* this path works rather than just listing a data structure."
    ],
    "complexity": [
      "Time Complexity: O(N) because we iterate through the collection exactly once.",
      "Space Complexity: O(N) because the hash map stores up to N distinct elements."
    ],
    "edgeCases": [
      "Empty or minimal inputs (e.g., array size = 0 or 1).",
      "Inputs with negative values, duplicates, or out-of-bound constraints."
    ],
    "mistakesToAvoid": [
      "Forgetting to handle integer overflow when summing big variables.",
      "Off-by-one errors during pointer transitions."
    ],
    "dryRun": [
      {
        "step": "1",
        "state": "i = 0, map = {}",
        "action": "Read nums[0] = 2, complement = 7",
        "result": "7 not found, store 2 -> 0"
      },
      {
        "step": "2",
        "state": "i = 1, map = {2:0}",
        "action": "Read nums[1] = 7, complement = 2",
        "result": "2 found! Return indices [0, 1]"
      }
    ],
    "bruteForce": {
      "description": [
        {"type": "heading", "text": "Naive Approach"},
        {"type": "paragraph", "text": "Check all possible element pairs using a nested loop."}
      ],
      "codeBlock": {
        "language": "__LANGUAGE__",
        "code": "Clean, mini brute-force implementation snippet"
      },
      "algorithmSteps": [
        "Run an outer loop from index 0 to N.",
        "Run an inner loop from outer index + 1 to N.",
        "If the sum matches target, return indices."
      ]
    },
    "optimalApproach": {
      "description": [
        {"type": "heading", "text": "Single Pass Optimization"},
        {"type": "paragraph", "text": "Track complements inside a dynamic dictionary to locate matching pairs instantly."}
      ],
      "codeBlock": {
        "language": "__LANGUAGE__",
        "code": "A cleaned-up, beautifully indented version of the user's solution"
      },
      "algorithmSteps": [
        "Initialize an empty hash structure.",
        "For each element, calculate target minus current value.",
        "Lookup the complement in your hash map; if found, exit with indices."
      ]
    }
  }
}


CRITICAL SECTION SPECIFICATIONS
------------------------------------------
1. note.summary, note.intuition, note.complexity, note.edgeCases, note.mistakesToAvoid:
   - Must be an array of plain strings (e.g., ["string1", "string2"]). 
   - DO NOT nest objects like {"text": ...} inside these lists.

2. note.dryRun:
   - Must be an array of flat objects representing variable state transitions.
   - Run the dry run on an actual or representative test case. Provide a minimum of 4 rows.
   - Maintain the explicit keys: "step", "state", "action", "result".

3. note.bruteForce & note.optimalApproach:
   - These are structured objects, not arrays.
   - If a brute force path is completely irrelevant, you may omit the "bruteForce" key or set it to null.
   - "optimalApproach" MUST be included and derived from the user's code.
   - Inside their "description" field, use the text object structure explicitly: {"type": "heading" or "paragraph", "text": "..."}.
   - Keep code blocks minimal, production clean, and strictly tied to the designated programming language.
""".strip()

    # Perform structural replacements safely without using evaluation loops
    return (prompt_template
            .replace("__PROBLEM_LINK__", problem_link)
            .replace("__LANGUAGE__", language)
            .replace("__USER_CODE__", user_code))