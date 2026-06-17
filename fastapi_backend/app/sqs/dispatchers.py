# app/sqs/dispatchers.py

import json
from beanie import PydanticObjectId
from .config import sqs_client, QUEUE_URL
from typing import Optional

async def enqueue_note_generation(
    note_id: str, 
    user_id: PydanticObjectId, 
    problem_link: str, 
    user_code: str, 
    language: str, 
    user_notes: str = ""
):
    """Enqueues a DSA note generation task into the SQS background pipeline."""
    payload = {
        "type": "dsa",
        "note_id": str(note_id),
        "user_id": str(user_id),
        "problemLink": problem_link,
        "userCode": user_code,
        "language": language,
        "userNotes": user_notes,
    }
    
    sqs_client.send_message(QueueUrl=QUEUE_URL, MessageBody=json.dumps(payload))
    print(f"[SQS] Enqueued note generation for Note ID: {note_id}")


async def enqueue_theory_generation(
    theory_id: str, 
    user_id: PydanticObjectId, 
    topic: str, 
    instructions: Optional[str] = None 
):
    """Enqueues a CS theory masterclass note generation task into SQS."""
    payload = {
        "type": "theory",
        "theory_id": str(theory_id),
        "user_id": str(user_id),
        "topic": topic,
        "instructions": instructions  
    }
    
 
    sqs_client.send_message(QueueUrl=QUEUE_URL, MessageBody=json.dumps(payload))
    print(f"[SQS] Enqueued theory generation for Theory ID: {theory_id}")