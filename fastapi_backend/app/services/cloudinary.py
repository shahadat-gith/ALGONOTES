# app/services/cloudinary.py
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from app.config import settings

# 🌟 Force initialize the SDK configurations immediately when this module loads
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

async def upload_to_cloudinary(file: UploadFile, folder: str = "algonotes/users") -> dict:
    """
    Reads the asynchronous FastAPI UploadFile stream and uploads the raw
    binary payload directly to Cloudinary.
    """
    try:
        # Read the file stream contents directly into memory bytes
        file_bytes = await file.read()
        
        # Reset the stream cursor pointer
        await file.seek(0)
        
        # Dispatch raw bytes payload directly into Cloudinary's uploader interface
        result = cloudinary.uploader.upload(
            file_bytes,
            folder=folder,
            resource_type="auto"
        )
        
        return result
    except Exception as e:
        print(f"Cloudinary Core Upload Crash: {str(e)}")
        raise e

async def delete_from_cloudinary(public_id: str) -> dict:
    """
    Removes historical media records out of Cloudinary cloud nodes.
    """
    try:
        return cloudinary.uploader.destroy(public_id)
    except Exception as e:
        print(f"Cloudinary Core Destruction Crash: {str(e)}")
        return {}