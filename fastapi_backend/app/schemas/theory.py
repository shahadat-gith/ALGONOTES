from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, BeforeValidator
from typing_extensions import Annotated
from app.models.theory import TheoryStatus

PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if v is not None else v)]

# ==========================================
# REQUEST DTO SCHEMA
# ==========================================
class GenerateTheoryRequest(BaseModel):
    topic: str = Field(..., min_length=1)

# ==========================================
# RESPONSE SCHEMA
# ==========================================
class TheoryResponse(BaseModel):
    id: PyObjectId = Field(alias="_id") 
    status: TheoryStatus
    topic: str
    content: str  # Kept flat and consistent
    createdAt: datetime
    updatedAt: datetime
    user_id: PyObjectId 

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True, 
        exclude_none=True 
    )

# ==========================================
# UPDATE SCHEMA
# ==========================================
class TheoryUpdate(BaseModel):
    status: Optional[TheoryStatus] = None
    topic: Optional[str] = None
    content: Optional[str] = None

    model_config = ConfigDict(
        extra="ignore",
        exclude_none=True
    )