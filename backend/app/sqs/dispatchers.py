import json
from typing import Optional, Any, Dict
from beanie import PydanticObjectId
from fastapi.concurrency import run_in_threadpool 

from .config import sqs_client, QUEUE_URL


async def _send_to_sqs(payload: Dict[str, Any], task_label: str, identifier: str) -> None:
    try:
        await run_in_threadpool(
            sqs_client.send_message, 
            QueueUrl=QUEUE_URL, 
            MessageBody=json.dumps(payload)
        )
    except Exception as e:
        print(f"[SQS ERROR] Failed to enqueue {task_label} task for ID {identifier}. Error: {e}")
        raise e


async def enqueue_note_generation(
    note_id: str, 
    user_id: PydanticObjectId, 
    problem_link: str, 
    language: str, 
    user_notes: str = ""
) -> None:
    """Dispatches a DSA note generation task to the queue."""
    payload = {
        "type": "dsa",
        "note_id": str(note_id),
        "user_id": str(user_id),
        "problemLink": problem_link,
        "language": language,
        "userNotes": user_notes,
    }
    await _send_to_sqs(payload, task_label="DSA note generation", identifier=str(note_id))


async def enqueue_theory_generation(
    theory_id: str, 
    user_id: PydanticObjectId, 
    topic: str, 
    code_language: Optional[str] = None, 
    instructions: Optional[str] = None 
) -> None:

    clean_language = code_language.strip() if code_language and code_language.strip() else None
    
    payload = {
        "type": "theory",
        "theory_id": str(theory_id),
        "user_id": str(user_id),
        "topic": topic,
        "code_language": clean_language,
        "instructions": instructions  
    }
    await _send_to_sqs(payload, task_label="Theory generation", identifier=str(theory_id))


async def enqueue_prompt_optimization(
    job_id: str,
    user_id: str,
    topic: str,
    code_language: str,
    instructions: Optional[str] = ""
) -> None:

    clean_language = code_language.strip() if code_language and code_language.strip() else None

    payload = {
        "type": "optimize_prompt",
        "job_id": job_id,
        "user_id": str(user_id),
        "topic": topic,
        "code_language": clean_language,
        "instructions": instructions
    }
    await _send_to_sqs(payload, task_label="Prompt optimization", identifier=job_id)