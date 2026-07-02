import json

from .llm import client, MODEL, TEMPERATURE


async def generate_content(system: str,prompt: str, json_response: bool = False,):
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": system,
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=TEMPERATURE,
        response_format={"type": "json_object"} if json_response else None,
    )

    content = response.choices[0].message.content

    if not json_response:
        return content

    try:
        cleaned = content.replace("```json", "").replace("```", "").strip()

        return json.loads(cleaned)

    except json.JSONDecodeError as e:
        print(content)
        raise ValueError("Invalid JSON returned by AI.") from e
