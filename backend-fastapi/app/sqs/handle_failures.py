from datetime import datetime, timezone
from app.models import Note, Theory
from app.models.theory import TheoryStatus
from app.models import TempPromptJob
from app.models.note import NoteStatus

async def handle_note_generation_failure(note_id: str, reason: str):
    """Updates the database status to failed when a DSA note task encounters a severe problem."""
    note = await Note.get(note_id)
    if not note: 
        return
    note.status = NoteStatus.failed
    note.updatedAt = datetime.now(timezone.utc)
    await note.save()
    print(f"[Worker Exception] Note job {note_id} marked as failed. Reason: {reason}")


async def handle_theory_generation_failure(theory_id: str, reason: str):
    """Updates the database status to failed when an academic theory generation process breaks down."""
    theory = await Theory.get(theory_id)
    if not theory: 
        return
    theory.status = TheoryStatus.failed
    theory.updatedAt = datetime.now(timezone.utc)
    await theory.save()
    print(f"[Worker Exception] Theory job {theory_id} marked as failed. Reason: {reason}")


async def handle_prompt_optimization_failure(job_id: str, reason: str):
    """
    Handles terminal prompt optimization exceptions.
    Deletes the temporary tracking record instantly to keep database footprint clean.
    """
    job = await TempPromptJob.get(job_id)
    if not job:
        return
        
    await job.delete()
    print(f"[Worker Exception] Ephemeral prompt job {job_id} deleted on failure. Reason: {reason}")