# app/routes/auth.py

from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, BackgroundTasks, HTTPException, status

from app.models import User
from app.schemas import (
    RegisterRequest,
    LoginRequest,
    VerifyUserRequest,
    ForgotPasswordRequest,
    UserResponse,
)
from app.services import hash_password, verify_password, send_email
from app.utils import generate_otp, create_access_token
from app.config import settings


from app.constants import welcome_email_template, otp_email_template


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def serialize_user(user: User) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        username=user.username,
        avatar={
            "url": user.avatar.url,
            "public_id": user.avatar.public_id,
        },
        verificationOptions={
            "status": user.verificationOptions.status,
        }
    )


# ==========================================
# REGISTER
# ==========================================
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest,
    background_tasks: BackgroundTasks
):
    user_email = payload.email.lower().strip()

    existing_user = await User.find_one(User.email == user_email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Account already exists.")

    new_user = User(
        name=payload.name.strip(),
        email=user_email,
        username=payload.username.lower().strip() if payload.username else None,
        password=hash_password(payload.password),
    )
    await new_user.insert()

    verification_url = f"{settings.FRONTEND_URL_PROD}/verify?email={new_user.email}"

    background_tasks.add_task(
        send_email,
        new_user.email,
        "Welcome to ALGONOTES",
        welcome_email_template(verification_url)
    )

    return {"success": True, "message": "Registration successful."}


# ==========================================
# LOGIN
# ==========================================
@router.post("/login")
async def login(payload: LoginRequest):
    user_email = payload.email.lower().strip()

    user = await User.find_one(User.email == user_email)
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    token = create_access_token(str(user.id))

    return {
        "success": True,
        "token": token,
        "user": serialize_user(user)
    }


# ==========================================
# VERIFY USER
# ==========================================
@router.post("/verify")
async def verify_user(
    payload: VerifyUserRequest,
    background_tasks: BackgroundTasks
):
    user_email = payload.email.lower().strip()

    user = await User.find_one(User.email == user_email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if user.verificationOptions.status == "verified":
        raise HTTPException(status_code=400, detail="User already verified.")

    if payload.step == "send-otp":
        otp = generate_otp()
        user.verificationOptions.otp = otp
        user.verificationOptions.otpExpiry = datetime.now(timezone.utc) + timedelta(minutes=10)
        await user.save()

        background_tasks.add_task(
            send_email,
            user.email,
            "ALGONOTES Verification Code",
            otp_email_template(
                otp=otp,
                title="Verify your email address",
                purpose="Use this security pass code payload to complete your ALGONOTES profile deployment configuration verification process."
            )
        )
        return {"success": True, "message": "OTP sent successfully."}

    if payload.step == "otp-verification":
        if not payload.otp:
            raise HTTPException(status_code=400, detail="OTP required.")

        expiry = user.verificationOptions.otpExpiry
        if expiry and expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)

        is_expired = datetime.now(timezone.utc) > expiry if expiry else True
        if user.verificationOptions.otp != payload.otp or is_expired:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP.")

        user.verificationOptions.status = "verified"
        user.verificationOptions.otp = None
        user.verificationOptions.otpExpiry = None
        await user.save()

        return {
            "success": True,
            "message": "Account verified successfully.",
            "user": serialize_user(user)
        }


# ==========================================
# FORGOT PASSWORD
# ==========================================
@router.post("/forgot-password")
async def forgot_password(
    payload: ForgotPasswordRequest,
    background_tasks: BackgroundTasks
):
    user_email = payload.email.lower().strip()

    user = await User.find_one(User.email == user_email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if payload.step == "send-otp":
        otp = generate_otp()
        user.forgotPasswordOptions.otp = otp
        user.forgotPasswordOptions.otpExpiry = datetime.now(timezone.utc) + timedelta(minutes=10)
        user.forgotPasswordOptions.otpVerified = False
        await user.save()

        background_tasks.add_task(
            send_email,
            user.email,
            "ALGONOTES Password Reset Code",
            otp_email_template(
                otp=otp,
                title="Reset your password",
                purpose="An explicit security override token transaction sequence was initiated to rewrite your ALGONOTES master password structure matrix.",
                danger=True
            )
        )
        return {"success": True, "message": "OTP sent."}

    if payload.step == "verify-otp":
        if not payload.otp:
            raise HTTPException(status_code=400, detail="OTP required.")

        expiry = user.forgotPasswordOptions.otpExpiry
        if expiry and expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)

        is_expired = datetime.now(timezone.utc) > expiry if expiry else True
        if user.forgotPasswordOptions.otp != payload.otp or is_expired:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP.")

        user.forgotPasswordOptions.otpVerified = True
        await user.save()

        return {"success": True, "message": "OTP verified."}

    if payload.step == "reset-password":
        if not payload.newPassword:
            raise HTTPException(status_code=400, detail="New password required.")

        if not user.forgotPasswordOptions.otpVerified:
            raise HTTPException(status_code=403, detail="OTP verification required.")

        user.password = hash_password(payload.newPassword)
        user.forgotPasswordOptions.otp = None
        user.forgotPasswordOptions.otpExpiry = None
        user.forgotPasswordOptions.otpVerified = False
        await user.save()

        return {"success": True, "message": "Password reset successful."}