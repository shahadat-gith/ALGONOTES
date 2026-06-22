# app/services/cloudinary.py
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from app.config import configure_cloudinary

# Force initialize the SDK configurations immediately when this module loads
configure_cloudinary()

async def upload_to_cloudinary(file: UploadFile, folder: str = "algonotes/users") -> dict:
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
    try:
        return cloudinary.uploader.destroy(public_id)
    except Exception as e:
        print(f"Cloudinary Core Destruction Crash: {str(e)}")
        return {}