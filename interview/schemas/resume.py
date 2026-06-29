from pydantic import BaseModel


class ResumeUploadRequest(BaseModel):
    pass


class ResumeUploadResponse(BaseModel):
    interview_id: str

    message: str