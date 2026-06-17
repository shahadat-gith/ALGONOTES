# app/routes/theory.py

from math import ceil
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from beanie.operators import In

from app.models import User, Theory
from app.models.theory import TheoryStatus
from app.schemas import GenerateTheoryRequest, TheoryResponse, TheoryUpdate
from app.middlewares import get_current_user
from app.sqs import enqueue_theory_generation

router = APIRouter(
    prefix="/theories",
    tags=["Theory Notes"]
)

# ==========================================
# AI GENERATION ACTIONS
# ==========================================

@router.post("/generate", status_code=status.HTTP_202_ACCEPTED, tags=["AI Actions"])
async def generate_ai_theory(
    payload: GenerateTheoryRequest,
    current_user: User = Depends(get_current_user),
):
    new_theory = Theory(
        user_id=current_user.id,
        status=TheoryStatus.processing,
        topic=payload.topic,
        content="",  # Populated asynchronously by worker
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )

    await new_theory.insert()
    theory_id = str(new_theory.id)

    try:
        # --- UPDATED: Call the clean enqueue dispatcher function with proper await syntax ---
        await enqueue_theory_generation(
            theory_id=theory_id,
            user_id=current_user.id,
            topic=payload.topic,
        )

    except Exception:
        await new_theory.delete()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to queue AI theory generation job.",
        )

    return {
        "success": True,
        "message": "AI theory note generation queued.",
        "status": TheoryStatus.processing,
        "id": theory_id,
    }


@router.get("/status/{theory_id}", tags=["AI Actions"])
async def check_theory_generation_status(
    theory_id: str,
    current_user: User = Depends(get_current_user),
):
    theory = await Theory.get(theory_id)

    if not theory or theory.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Theory note not found.",
        )

    if theory.status == TheoryStatus.failed:
        return {
            "success": True,
            "status": "failed",
            "message": "AI generation failed. Please try again in a few minutes.",
            "id": str(theory.id),
        }

    return {
        "success": True,
        "status": theory.status,
        "id": str(theory.id),
    }


# ==========================================
# STANDARD CRUD OPERATIONS
# ==========================================

@router.get("/user", response_model=dict, tags=["Theory Notes"])
async def get_all_theories_by_user(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=50),
    search: Optional[str] = Query(default=None),
    current_user: User = Depends(get_current_user),
):
    skip = (page - 1) * size

    # Fetch only stable visible notes (draft or final)
    find_query = Theory.find(
        Theory.user_id == current_user.id,
        In(Theory.status, [TheoryStatus.draft, TheoryStatus.final])
    )

    # Clean case-insensitive substring search over the main topic or body text
    if search and search.strip():
        term = search.strip()
        find_query = find_query.find({
            "$or": [
                {"topic": {"$regex": term, "$options": "i"}},
                {"content": {"$regex": term, "$options": "i"}},
            ]
        })

    total_items = await find_query.count()
    theories = await (
        find_query
        .sort(-Theory.createdAt)
        .skip(skip)
        .limit(size)
        .to_list()
    )

    total_pages = ceil(total_items / size) if total_items else 1

    return {
        "success": True,
        "theories": [TheoryResponse.model_validate(t) for t in theories],
        "pagination": {
            "totalItems": total_items,
            "totalPages": total_pages,
            "currentPage": page,
            "pageSize": size,
            "hasNext": page < total_pages,
            "hasPrevious": page > 1,
        },
    }


@router.get("/{theory_id}", response_model=dict, tags=["Theory Notes"])
async def get_theory_by_id(
    theory_id: str,
    current_user: User = Depends(get_current_user),
):
    theory = await Theory.get(theory_id)

    if not theory or theory.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Theory note not found.",
        )

    if theory.status == TheoryStatus.processing:
        raise HTTPException(
            status_code=status.HTTP_202_ACCEPTED,
            detail="Theory note generation is still processing.",
        )

    return {
        "success": True,
        "theory": TheoryResponse.model_validate(theory),
    }


@router.put("/{theory_id}", response_model=dict, tags=["Theory Notes"])
async def update_theory(
    theory_id: str,
    payload: TheoryUpdate,
    current_user: User = Depends(get_current_user),
):
    theory = await Theory.get(theory_id)

    if not theory or theory.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Theory note not found.",
        )

    # Dynamically patch provided fields
    if payload.status is not None:
        theory.status = payload.status
    if payload.topic is not None:
        theory.topic = payload.topic
    if payload.content is not None:
        theory.content = payload.content

    theory.updatedAt = datetime.now(timezone.utc)
    await theory.save()

    return {
        "success": True,
        "message": f"Theory note updated successfully as {theory.status}.",
        "theory": TheoryResponse.model_validate(theory)
    }


@router.delete("/{theory_id}", response_model=dict, tags=["Theory Notes"])
async def delete_theory(
    theory_id: str,
    current_user: User = Depends(get_current_user),
):
    theory = await Theory.get(theory_id)

    if not theory or theory.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Theory note not found.",
        )

    await theory.delete()

    return {
        "success": True,
        "message": "Theory note deleted successfully.",
    }