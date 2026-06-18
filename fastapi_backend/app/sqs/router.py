# app/sqs/router.py

import json
from pydantic import ValidationError

from .worker import execute_note_generation, execute_theory_generation, execute_prompt_optimization

from .handle_failures import handle_note_generation_failure, handle_theory_generation_failure

async def route_incoming_ai_job(message: dict):

    job_type = message.get("type", "dsa") 
    
    try:
        if job_type == "theory":
            await execute_theory_generation(message)
        else:
            await execute_note_generation(message)
            
    except (json.JSONDecodeError, ValidationError, ValueError) as e:
        if job_type == "theory":
            await handle_theory_generation_failure(message["theory_id"], f"Payload Parsing Fault: {str(e)}")
        else:
            await handle_note_generation_failure(message["note_id"], f"Payload Parsing Fault: {str(e)}")
    except Exception as e:
        if job_type == "theory":
            await handle_theory_generation_failure(message["theory_id"], f"Service Operational Interruption: {str(e)}")
        else:
            await handle_note_generation_failure(message["note_id"], f"Service Operational Interruption: {str(e)}")
        raise






async def route_incoming_ai_job(message: dict):
    job_type = message.get("type", "dsa") 
    
    try:
        if job_type == "theory":
            await execute_theory_generation(message)
        elif job_type == "optimize_prompt":
            await execute_prompt_optimization(message)
        else:
            await execute_note_generation(message)
            
    except Exception as e:
        # Gracefully pipe failures based on specific transaction groups
        if job_type == "optimize_prompt":
            from app.models.theory import TempPromptJob, TheoryStatus
            job = await TempPromptJob.get(message["job_id"])
            if job:
                job.status = TheoryStatus.failed
                job.error_message = str(e)
                await job.save()
        elif job_type == "theory":
            await handle_theory_generation_failure(message["theory_id"], str(e))
        else:
            await handle_note_generation_failure(message["note_id"], str(e))
        raise