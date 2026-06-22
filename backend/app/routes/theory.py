from datetime import datetime, timezone
from math import ceil
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status, Body
from beanie.operators import In
import cloudinary.uploader
import cloudinary.api

from app.models import User, Theory
from app.models.theory import TheoryStatus
from app.schemas.theory import GenerateTheoryRequest, TheoryResponse, TheoryUpdate
from app.middlewares import get_current_user
from app.sqs import enqueue_theory_generation

router = APIRouter(
    prefix="/theory",
    tags=["Theory Notes"]
)


# ==========================================
# THEORY STUDY GUIDE CREATION ENDPOINTS
# ==========================================
@router.post("/generate", status_code=status.HTTP_202_ACCEPTED, tags=["AI Actions"])
async def generate_ai_theory(
    payload: GenerateTheoryRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Initializes a new study note record and sends a task to the background 
    queue to create the content.
    """
    new_theory = Theory(
        user_id=current_user.id,
        status=TheoryStatus.processing,
        topic=payload.topic,
        content="", 
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )

    await new_theory.insert()
    
    theory_id_str = str(new_theory.id)
    user_id_str = str(current_user.id)

    try:
        await enqueue_theory_generation(
            theory_id=theory_id_str,
            user_id=user_id_str,
            topic=payload.topic,
            code_language=payload.code_language,
            instructions=payload.instructions
        )
    except Exception as e:
        await new_theory.delete()
        print(f"[SQS Queue Error Details]: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="We could not add your study note creation task to the queue right now.",
        )

    return {
        "success": True,
        "message": "Your note is being created by our AI assistant.",
        "status": TheoryStatus.processing,
        "id": theory_id_str,
        "theoryId": theory_id_str, 
    }


@router.get("/status/{theory_id}", tags=["AI Actions"])
async def check_theory_generation_status(
    theory_id: str,
    current_user: User = Depends(get_current_user),
):
    """
    Polled endpoint utilized by your backoff polling frontend hook engine 
    to track document compilation workflows.
    """
    theory = await Theory.get(theory_id)

    if not theory or theory.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study note not found.",
        )

    if theory.status == TheoryStatus.failed:
        return {
            "success": True,
            "status": "failed",
            "message": "We could not create this note. Please try again in a few minutes.",
            "id": str(theory.id),
        }

    return {
        "success": True,
        "status": theory.status,
        "id": str(theory.id),
    }


# ==========================================
# THEORY WORKSPACE MEDIA CONTROL LAYER
# ==========================================
@router.post("/{theory_id}/upload-image", tags=["Theory Media Layer"])
async def upload_theory_image(
    theory_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    Saves chosen file uploads directly to Cloudinary and returns a secure image link.
    """
    theory = await Theory.get(theory_id)
    if not theory or theory.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study note workspace not found.",
        )

    if file.content_type not in ["image/jpeg", "image/png", "image/webp", "image/gif"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a valid image file (PNG, JPEG, WEBP, or GIF).",
        )

    try:
        upload_result = cloudinary.uploader.upload(
            file.file,
            folder=f"algonotes/theory_{theory_id}",
            overwrite=True,
            resource_type="image"
        )
        
        return {
            "success": True,
            "imageUrl": upload_result.get("secure_url")
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while saving your image. Please try again."
        )


@router.post("/{theory_id}/delete-image", tags=["Theory Media Layer"])
async def delete_theory_image(
    theory_id: str,
    image_url: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
):
    """
    Parses out the target public asset ID and purges the file directly out of Cloudinary.
    """
    theory = await Theory.get(theory_id)
    if not theory or theory.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study note workspace not found.",
        )

    if "cloudinary.com" not in image_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This is not a valid Cloudinary media asset URL.",
        )

    try:
        url_parts = image_url.split("/upload/")
        if len(url_parts) < 2:
            raise ValueError("Invalid asset structure pattern format.")

        remainder = url_parts[1]
        if remainder.startswith("v") and "/" in remainder:
            remainder = remainder.split("/", 1)[1]

        public_id = remainder.rsplit(".", 1)[0]
        result = cloudinary.uploader.destroy(public_id)

        if result.get("result") == "ok":
            return {
                "success": True,
                "message": "Image asset completely cleared from remote storage."
            }
        else:
            print(f"[Cloudinary Warning]: Deletion result returned: {result}")
            return {
                "success": True, 
                "message": "Image reference cleared locally, file not found in bucket profile."
            }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not remove your image file from cloud storage. Please try again."
        )


# ==========================================
# STANDARD READ / UPDATE DATA OPERATIONS
# ==========================================
@router.get("/user", response_model=dict, tags=["Theory Notes"])
async def get_all_theories_by_user(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=50),
    search: Optional[str] = Query(default=None),
    current_user: User = Depends(get_current_user),
):
    """
    Fetches all completed or draft academic theory summary entities owned by the active profile.
    """
    skip = (page - 1) * size

    find_query = Theory.find(
        Theory.user_id == current_user.id,
        In(Theory.status, [TheoryStatus.draft, TheoryStatus.final])
    )

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
        # Corrected: Explicitly dump using by_alias=True to guarantee that collection objects preserve their '_id' fields
        "theories": [TheoryResponse.model_validate(t).model_dump(by_alias=True) for t in theories],
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
    """
    Returns full content properties of an individual document by its identifier hash keys.
    """
    theory = await Theory.get(theory_id)

    if not theory or theory.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study note not found.",
        )

    if theory.status == TheoryStatus.processing:
        raise HTTPException(
            status_code=status.HTTP_202_ACCEPTED,
            detail="Your study note is still being written by our assistant.",
        )

    return {
        "success": True,
        # Corrected: Export schema safely preserving backend data contract constraints
        "theory": TheoryResponse.model_validate(theory).model_dump(by_alias=True),
    }


@router.put("/{theory_id}", response_model=dict, tags=["Theory Notes"])
async def update_theory(
    theory_id: str,
    payload: TheoryUpdate,
    current_user: User = Depends(get_current_user),
):
    """
    Modifies runtime contents or status criteria states of an existing study guide note document.
    """
    theory = await Theory.get(theory_id)

    if not theory or theory.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study note not found.",
        )

    if payload.status is not None:
        theory.status = payload.status
    if payload.content is not None:
        theory.content = payload.content

    theory.updatedAt = datetime.now(timezone.utc)
    await theory.save()

    return {
        "success": True,
        "message": "Study note updated successfully.",
        # Corrected: Export schema safely preserving backend data contract constraints
        "theory": TheoryResponse.model_validate(theory).model_dump(by_alias=True)
    }


@router.delete("/{theory_id}", response_model=dict, tags=["Theory Notes"])
async def delete_theory(
    theory_id: str,
    current_user: User = Depends(get_current_user),
):
    """
    Performs complete cascading cleanups: purges Cloudinary media buckets and directory structure paths,
    then deletes the core document entry straight from MongoDB.
    """
    theory = await Theory.get(theory_id)

    if not theory or theory.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study note not found.",
        )

    folder_path = f"algonotes/theory_{theory_id}"

    try:
        cloudinary.api.delete_resources_by_prefix(prefix=folder_path)
        cloudinary.api.delete_folder(path=folder_path)
    except Exception as e:
        print(f"[Cloudinary Cleanup Exception Warning]: {str(e)}")

    await theory.delete()

    return {
        "success": True,
        "message": "Study note and all associated images deleted successfully.",
    }