# app/sqs/dispatchers.py

import json
from typing import Optional

from beanie import PydanticObjectId
from fastapi.concurrency import run_in_threadpool 
from .config import sqs_client, QUEUE_URL


async def enqueue_note_generation(
    note_id: str, 
    user_id: PydanticObjectId, 
    problem_link: str, 
    user_code: str, 
    language: str, 
    user_notes: str = ""
):
    payload = {
        "type": "dsa",
        "note_id": str(note_id),
        "user_id": str(user_id),
        "problemLink": problem_link,
        "userCode": user_code,
        "language": language,
        "userNotes": user_notes,
    }
    
    # Corrected: Run the blocking network call in a separate threadpool worker safely
    await run_in_threadpool(
        sqs_client.send_message, 
        QueueUrl=QUEUE_URL, 
        MessageBody=json.dumps(payload)
    )
    print(f"[SQS] Enqueued dsa note generation for Note ID: {note_id}")


async def enqueue_theory_generation(
    theory_id: str, 
    user_id: PydanticObjectId, 
    topic: str, 
    code_language: Optional[str] = "C++", 
    instructions: Optional[str] = None 
):
    payload = {
        "type": "theory",
        "theory_id": str(theory_id),
        "user_id": str(user_id),
        "topic": topic,
        "code_language": code_language.strip() if (code_language and code_language.strip()) else "C++",
        "instructions": instructions  
    }
    
    # Corrected: Run the blocking network call in a separate threadpool worker safely
    await run_in_threadpool(
        sqs_client.send_message, 
        QueueUrl=QUEUE_URL, 
        MessageBody=json.dumps(payload)
    )
    print(f"[SQS] Enqueued theory generation for Theory ID: {theory_id} (Language: {payload['code_language']})")


async def enqueue_prompt_optimization(
    job_id: str,
    user_id: str,
    topic: str,
    code_language: str,
    instructions: Optional[str] = ""
):
    payload = {
        "type": "optimize_prompt",
        "job_id": job_id,
        "user_id": user_id,
        "topic": topic,
        "code_language": code_language,
        "instructions": instructions
    }
    
    # Corrected: Run the blocking network call in a separate threadpool worker safely
    await run_in_threadpool(
        sqs_client.send_message, 
        QueueUrl=QUEUE_URL, 
        MessageBody=json.dumps(payload)
    )
    print(f"[SQS] Enqueued prompt optimization task for Job ID: {job_id}")