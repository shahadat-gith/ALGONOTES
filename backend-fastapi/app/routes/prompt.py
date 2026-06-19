from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks

from app.models import User
from app.models.theory import TheoryStatus
from app.models import TempPromptJob
from app.schemas.theory import OptimizePromptRequest, OptimizePromptStatusResponse
from app.middlewares import get_current_user
from app.sqs import enqueue_prompt_optimization

router = APIRouter(
    prefix="/prompt",
    tags=["Optimisation of prompts"]
)

# ==========================================
# ASYNC BACKGROUND CLEANUP TASK HELPERS
# ==========================================
async def purge_temporary_prompt_record(job_id: str):
    """
    Background worker callback task to delete the ephemeral job log context 
    from the cluster database space cleanly after client read operations complete.
    """
    job = await TempPromptJob.get(job_id)
    if job:
        await job.delete()


# ==========================================
# ASYNC PROMPT OPTIMIZATION POLISHED CORES
# ==========================================
@router.post("/optimize-prompt", status_code=status.HTTP_202_ACCEPTED, tags=["AI Actions"])
async def start_prompt_optimization(
    payload: OptimizePromptRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Accepts rough note points and initializes an ephemeral status tracking context 
    before submitting a background parsing instruction message into SQS queues.
    """
    new_job = TempPromptJob(
        user_id=current_user.id,
        status=TheoryStatus.processing,
        topic=payload.topic,
    )
    await new_job.insert()
    job_id_str = str(new_job.id)

    try:
        await enqueue_prompt_optimization(
            job_id=job_id_str,
            user_id=str(current_user.id),
            topic=payload.topic,
            code_language=payload.code_language,
            instructions=payload.instructions or ""
        )
    except Exception as e:
        await new_job.delete()
        print(f"[SQS Prompt Optimization Exception Alert]: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not dispatch request payload across optimization transaction channels."
        )

    return {
        "success": True,
        "jobId": job_id_str,
        "message": "Polishing task added successfully into background workers."
    }


@router.get("/optimize-prompt/status/{job_id}", response_model=OptimizePromptStatusResponse, tags=["AI Actions"])
async def read_prompt_optimization_status(
    job_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """
    Polled endpoint to query running prompt optimization states. 
    Triggers background cleanups to delete data right after delivering a final outcome.
    """
    job = await TempPromptJob.get(job_id)
    if not job or job.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requested prompt processing task expired or not found."
        )

    if job.status == TheoryStatus.failed:
        # Clear database tracking space instantly upon reading failures
        background_tasks.add_task(purge_temporary_prompt_record, job_id)
        return OptimizePromptStatusResponse(
            success=True,
            status=TheoryStatus.failed,
            message=getattr(job, "error_message", None) or "AI pipeline encountered processing problems."
        )

    if job.status == TheoryStatus.final or job.status == TheoryStatus.draft:
        # Clear database tracking space instantly upon successful resolution
        background_tasks.add_task(purge_temporary_prompt_record, job_id)
        
        # Explicit structure conversion safely preserving validation formatting models 
        return OptimizePromptStatusResponse(
            success=True,
            status=TheoryStatus.final,
            optimizedInstructions=getattr(job, "optimized_instructions", "")
        )

    # Return 202 status code to instruct frontend hooks to maintain intervals safely
    return OptimizePromptStatusResponse(
        success=True,
        status=TheoryStatus.processing
    )