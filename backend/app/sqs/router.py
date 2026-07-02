from pydantic import ValidationError

from .worker import (
    NonRetryableJobError,
    execute_note_generation, 
    execute_theory_generation, 
    execute_prompt_optimization
)
from .handle_failures import (
    handle_note_generation_failure, 
    handle_theory_generation_failure,
    handle_prompt_optimization_failure
)


JOB_REGISTRY = {
    "theory": {
        "executor": execute_theory_generation,
        "id_field": "theory_id",
        "failure_handler": handle_theory_generation_failure,
    },
    "optimize_prompt": {
        "executor": execute_prompt_optimization,
        "id_field": "job_id",
        "failure_handler": handle_prompt_optimization_failure,
    },
    "dsa": {
        "executor": execute_note_generation,
        "id_field": "note_id",
        "failure_handler": handle_note_generation_failure,
    }
}


async def route_incoming_ai_job(message: dict) -> None:
    job_type = message.get("type", "dsa")

    if job_type not in JOB_REGISTRY:
        raise ValueError(f"Unsupported job type: {job_type}")
    
    job_config = JOB_REGISTRY[job_type]
    executor = job_config["executor"]
    failure_handler = job_config["failure_handler"]
    target_id = message.get(job_config["id_field"])

    try:
        await executor(message)
            
    except (ValidationError, KeyError, NonRetryableJobError) as e:
        reason = f"Payload Validation Fault: {e}"
        await failure_handler(target_id, reason)
        return

    except Exception as e:
        reason = f"Background Processing Error: {e}"
        await failure_handler(target_id, reason)
        raise e