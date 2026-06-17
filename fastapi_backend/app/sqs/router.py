# app/sqs/router.py

import json
from pydantic import ValidationError

from .worker import execute_note_generation, execute_theory_generation
from .handle_failures import handle_note_generation_failure, handle_theory_generation_failure

async def route_incoming_ai_job(message: dict):
    """Inspects the message metadata and handles routing payload streams to the correct pipeline."""
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