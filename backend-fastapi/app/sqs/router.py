# app/sqs/router.py

from pydantic import ValidationError

from .worker import (
    execute_note_generation, 
    execute_theory_generation, 
    execute_prompt_optimization
)
from .handle_failures import (
    handle_note_generation_failure, 
    handle_theory_generation_failure,
    handle_prompt_optimization_failure  # Clean error handling matching your helpers
)

async def route_incoming_ai_job(message: dict):
    job_type = message.get("type", "dsa") 
    
    try:
        if job_type == "theory":
            await execute_theory_generation(message)
        elif job_type == "optimize_prompt":
            await execute_prompt_optimization(message)
        else:
            await execute_note_generation(message)
            
    except (ValidationError, ValueError, KeyError) as e:
        # 1. Granular catch for invalid payload structural formats
        reason = f"Payload Validation Fault: {str(e)}"
        if job_type == "optimize_prompt":
            await handle_prompt_optimization_failure(message.get("job_id"), reason)
        elif job_type == "theory":
            await handle_theory_generation_failure(message.get("theory_id"), reason)
        else:
            await handle_note_generation_failure(message.get("note_id"), reason)
        raise

    except Exception as e:
        # 2. Global catch for upstream operational infrastructure failures
        reason = f"Background Processing Error: {str(e)}"
        if job_type == "optimize_prompt":
            await handle_prompt_optimization_failure(message.get("job_id"), reason)
        elif job_type == "theory":
            await handle_theory_generation_failure(message.get("theory_id"), reason)
        else:
            await handle_note_generation_failure(message.get("note_id"), reason)
        raise