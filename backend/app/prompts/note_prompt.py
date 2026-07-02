NOTE_SYSTEM_PROMPT = """
You are an expert DSA mentor.

Generate concise, interview-ready and revision-friendly coding notes.

Rules:
- Return ONLY one valid JSON object.
- Do NOT return markdown or extra text.
- Follow the schema exactly.
- Do NOT add or remove fields.
- If an approach (bruteForce, better or optimalApproach) does not meaningfully exist, return null.
- Keep explanations concise and practical.
- Base everything on the official problem and best-known solution.
- Generate code in the requested programming language.
- Never hallucinate constraints, examples or complexities.
"""


def generate_note_prompt(
    problem_link: str,
    language: str,
    user_notes: str,
) -> str:

    cleaned_notes = user_notes.strip() if user_notes else ""

    if cleaned_notes:
        notes_section = f"""
USER NOTES
{cleaned_notes}

Instructions:
- Treat these as rough notes.
- Rewrite them into clear, simple English.
- Return the rewritten version in "userNotes".
- Naturally incorporate relevant insights into "intuition" and "mistakesToAvoid".
"""
    else:
        notes_section = """
No user notes were provided.

Return an empty string for "userNotes".
"""

    return f"""
Problem Link:
{problem_link}

Programming Language:
{language}

{notes_section}

Generate the coding note using the following JSON schema exactly.

{{
  "problem": {{
    "title": "",
    "problemLink": "{problem_link}",
    "platform": "",
    "difficulty": "",
    "description": "",
    "constraints": [],
    "testCases": [
      {{
        "input": "",
        "output": "",
        "explanation": ""
      }}
    ],
    "expectedTimeComplexity": "",
    "expectedSpaceComplexity": "",
    "topics": []
  }},

  "note": {{
    "intuition": "",
    "edgeCases": [],
    "mistakesToAvoid": [],
    "dryRun": [
      {{
        "step": "",
        "state": "",
        "action": "",
        "result": ""
      }}
    ],

    "bruteForce": {{
      "complexity": {{
        "time": "",
        "space": ""
      }},
      "description": "",
      "codeBlock": {{
        "language": "{language}",
        "code": ""
      }},
      "algorithmSteps": []
    }},

    "better": {{
      "complexity": {{
        "time": "",
        "space": ""
      }},
      "description": "",
      "codeBlock": {{
        "language": "{language}",
        "code": ""
      }},
      "algorithmSteps": []
    }},

    "optimalApproach": {{
      "complexity": {{
        "time": "",
        "space": ""
      }},
      "description": "",
      "codeBlock": {{
        "language": "{language}",
        "code": ""
      }},
      "algorithmSteps": []
    }}
  }},

  "userNotes": ""
}}
""".strip()
