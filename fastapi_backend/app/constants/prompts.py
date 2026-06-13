# app/constants/prompts.py

def generate_note_prompt(problem) -> str:
    """
    Generates the structured prompt for Gemini based on problem context.
    Expects a SQLModel/SQLAlchemy Problem instance.
    """
    return f"""
    You are an expert algorithms instructor. Analyze the following coding problem solution and generate detailed study notes.
    
    Problem Title: {problem.title}
    Platform: {problem.platform}
    Language Used: {problem.language}
    Problem Link: {problem.problemLink}
    
    User's Solution Code:
    ```
    {problem.userCode}
    ```

    Provide the analysis STRICTLY in JSON format following this structural blueprint precisely:
    {{
      "bruteForce": [
        {{ "type": "paragraph", "text": "...", "order": 1 }},
        {{ "type": "code", "code": "...", "order": 2 }}
      ],
      "optimalApproach": [
        {{ "type": "paragraph", "text": "...", "order": 1 }}
      ],
      "algorithm": [
        {{ "stepNo": 1, "title": "Step title", "description": "Step description" }}
      ],
      "dryRun": [
        {{ "stepNo": 1, "inputState": "...", "action": "...", "outputState": "...", "explanation": "..." }}
      ],
      "edgeCases": [
        {{ "case": "...", "explanation": "..." }}
      ]
    }}

    Ensure all text descriptions are technical yet clear, code blocks inside brute force or optimal contain optimal syntax snippets, and order indices are sequential.
    """.strip()