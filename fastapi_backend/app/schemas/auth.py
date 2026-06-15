from typing import Optional, Literal
from pydantic import BaseModel, Field, EmailStr


# ==========================================
# 1. USER REGISTRATION PAYLOAD
# ==========================================
class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    password: str = Field(..., description="Plaintext raw password (User controlled length)")


# ==========================================
# 2. USER LOGIN PAYLOAD
# ==========================================
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ==========================================
# 3. ACCOUNT VERIFICATION STEP ENGINE
# ==========================================
class VerifyUserRequest(BaseModel):
    email: EmailStr
    step: Literal["send-otp", "otp-verification"]
    otp: Optional[str] = Field(None, min_length=6, max_length=6)


# ==========================================
# 4. PASSWORD RESET STATE PAYLOAD
# ==========================================
class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    step: Literal["send-otp", "verify-otp", "reset-password"]
    otp: Optional[str] = Field(None, min_length=6, max_length=6)
    newPassword: Optional[str] = Field(None, description="Replacement password (User controlled length)")