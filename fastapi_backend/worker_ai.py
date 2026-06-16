# worker_ai.py

import asyncio
import json
from datetime import datetime, timezone

from beanie import PydanticObjectId
from google.genai import types
from pydantic import ValidationError

from app.config import ai_client
from app.constants import generate_note_prompt
from app.database import init_db, close_db
from app.models import Note
from app.models.note import NoteStatus
from app.schemas.note import ProblemDetailSchema, NoteContentSchema


async def mark_note_failed(note_id: str, reason: str):
    note = await Note.get(note_id)
    if not note:
        return

    note.status = NoteStatus.failed
    note.updatedAt = datetime.now(timezone.utc)

    await note.save()
    print(f"[AI Worker] Note failed: {note_id}. Reason: {reason}")


async def process_ai_job(message: dict):
    note_id = message["note_id"]
    user_id = PydanticObjectId(message["user_id"])

    note = await Note.get(note_id)
    if not note:
        raise ValueError(f"Note {note_id} not found in database.")

    if note.user_id != user_id:
        await mark_note_failed(note_id, "User mismatch.")
        return

    prompt = generate_note_prompt(
        problem_link=message["problem_link"],
        user_code=message["user_code"],
        language=message["language"],
    )

    try:
        response = await ai_client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            ),
        )

        if not response.text:
            raise ValueError("Gemini returned empty response.")

        ai_data = json.loads(response.text)

        note.problem = ProblemDetailSchema(**ai_data.get("problem", {}))
        note.note = NoteContentSchema(**ai_data.get("note", {}))
        note.status = NoteStatus.draft
        note.updatedAt = datetime.now(timezone.utc)

        await note.save()
        print(f"[AI Worker] Note generated successfully: {note_id}")

    except (json.JSONDecodeError, ValidationError, ValueError) as e:
        await mark_note_failed(note_id, f"Data parsing/validation error: {str(e)}")
    except Exception as e:
        await mark_note_failed(note_id, f"AI generation service failure: {str(e)}")
        # Re-raise to trigger SQS visibility retry if it's a transient network/API drop
        raise


async def async_handler(event, context):
    await init_db()
    batch_item_failures = []

    try:
        for record in event.get("Records", []):
            try:
                message = json.loads(record["body"])
                await process_ai_job(message)
            except Exception as e:
                print(f"[AI Worker] Critical failure processing message {record['messageId']}: {str(e)}")
                # Properly append to avoid dropping poisoned or dead messages into processing ether
                batch_item_failures.append({
                    "itemIdentifier": record["messageId"]
                })
        
        return {
            "batchItemFailures": batch_item_failures
        }
    finally:
        await close_db()


def handler(event, context):
    return asyncio.run(async_handler(event, context))