import json
from datetime import datetime, timedelta, timezone
from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm.attributes import flag_modified

from app.models import User
from app.schemas import RegisterRequest, LoginRequest, VerifyUserRequest, ForgotPasswordRequest
from app.services import hash_password, verify_password, send_email
from app.utils import generate_otp, create_access_token
from app.database import get_session
from app.config import settings


router = APIRouter(prefix="/auth", tags=["Authentication Controller"])


# ==========================================
# REGISTER USER
# ==========================================
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session)
):
    user_email = payload.email.lower().strip()

    # Enforce safe cursor generation to protect serverless sockets
    statement = select(User).where(User.email == user_email)
    result = await session.execute(statement)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    hashed_pwd = hash_password(payload.password)

    new_user = User(
        name=payload.name,
        email=user_email,
        password=hashed_pwd,
        avatar={"url": "", "public_id": ""},
        verificationOptions={
            "status": "pending",
            "otp": None,
            "otpExpiry": None
        },
        forgotPasswordOptions={
            "otp": None,
            "otpExpiry": None,
            "otpVerified": False
        }
    )

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    verification_url = f"{settings.FRONTEND_URL_PROD}/verify?email={new_user.email}"

    email_html = f"""
    <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; border: 1px solid #eef2f6; border-radius: 8px;">
        <h2 style="color: #0f766e; margin-bottom: 10px;">Welcome to AlgoNotes!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">Thank you for signing up. Please click the button below to complete your email verification:</p>
        <a href="{verification_url}" target="_blank" style="display: inline-block; background-color: #0f766e; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; font-size: 14px; margin: 20px 0;">Verify Account</a>
        <p style="color: #94a3b8; font-size: 12px;">If the button isn't working, copy and paste this link into your browser:<br />
        <a href="{verification_url}" style="color: #0f766e; word-break: break-all;">{verification_url}</a></p>
    </div>
    """

    background_tasks.add_task(
        send_email,
        new_user.email,
        "Welcome to ALGONOTES",
        email_html
    )

    return {
        "success": True,
        "message": "Registration successful!"
    }


# ==========================================
# USER LOGIN
# ==========================================
@router.post("/login")
async def login(
    payload: LoginRequest,
    session: AsyncSession = Depends(get_session)
):
    user_email = payload.email.lower().strip()

    statement = select(User).where(User.email == user_email)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token(str(user.id))

    sanitized_user = user.model_dump(
        exclude={
            "password",
            "forgotPasswordOptions",
            "verificationOptions"
        }
    )

    return {
        "success": True,
        "message": "Login successful.",
        "token": token,
        "user": sanitized_user
    }


# ==========================================
# ACCOUNT VERIFICATION SYSTEM (OTP)
# ==========================================
@router.post("/verify")
async def verify_user(
    payload: VerifyUserRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session)
):
    user_email = payload.email.lower().strip()

    statement = select(User).where(User.email == user_email)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found."
        )

    v_opts = dict(user.verificationOptions or {})

    if v_opts.get("status") == "verified":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is already verified. You can log in."
        )

    if payload.step == "send-otp":
        fresh_otp = generate_otp()
        expiry_time = (datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat()

        v_opts["otp"] = fresh_otp
        v_opts["otpExpiry"] = expiry_time

        user.verificationOptions = v_opts
        flag_modified(user, "verificationOptions")

        session.add(user)
        await session.commit()

        otp_email_html = f"""
        <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; border: 1px solid #eef2f6; border-radius: 8px;">
          <h2 style="color: #0f766e; margin-bottom: 10px;">Your Verification Code</h2>
          <p style="color: #475569; font-size: 16px;">Enter this 6-digit OTP code on your screen to activate your account:</p>
          <div style="background-color: #f4f6f8; border-radius: 6px; padding: 15px 25px; margin: 20px 0; display: inline-block;">
            <h1 style="color: #0f766e; letter-spacing: 4px; margin: 0; font-size: 32px;">{fresh_otp}</h1>
          </div>
          <p style="color: #64748b; font-size: 14px;">This code is valid for 10 minutes.</p>
        </div>
        """

        background_tasks.add_task(
            send_email,
            user.email,
            "ALGONOTES Verification Code",
            otp_email_html
        )

        return {
            "success": True,
            "message": "A fresh verification code has been dispatched to your email inbox."
        }

    if payload.step == "otp-verification":
        if not payload.otp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please provide the 6-digit OTP code to verify."
            )

        expiry_str = v_opts.get("otpExpiry")
        is_expired = datetime.now(timezone.utc) > datetime.fromisoformat(expiry_str) if expiry_str else True

        if v_opts.get("otp") != payload.otp or is_expired:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP code. Please request a new code."
            )

        v_opts["status"] = "verified"
        v_opts["otp"] = None
        v_opts["otpExpiry"] = None

        user.verificationOptions = v_opts
        flag_modified(user, "verificationOptions")

        session.add(user)
        await session.commit()
        await session.refresh(user)

        sanitized_user = user.model_dump(
            exclude={
                "password",
                "forgotPasswordOptions",
                "verificationOptions"
            }
        )

        return {
            "success": True,
            "message": "Account verified successfully! Welcome to AlgoNotes.",
            "user": sanitized_user
        }


# ==========================================
# FORGOT PASSWORD SYSTEM
# ==========================================
@router.post("/forgot-password")
async def forgot_password(
    payload: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session)
):
    user_email = payload.email.lower().strip()

    statement = select(User).where(User.email == user_email)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account with this email does not exist."
        )

    f_opts = dict(user.forgotPasswordOptions or {})

    if payload.step == "send-otp":
        reset_otp = generate_otp()
        expiry_time = (datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat()

        f_opts["otp"] = reset_otp
        f_opts["otpExpiry"] = expiry_time
        f_opts["otpVerified"] = False

        user.forgotPasswordOptions = f_opts
        flag_modified(user, "forgotPasswordOptions")

        session.add(user)
        await session.commit()

        reset_email_html = f"""
        <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; border: 1px solid #eef2f6; border-radius: 8px;">
          <h2 style="color: #0f766e; margin-bottom: 10px;">Password Reset Request</h2>
          <p style="color: #475569; font-size: 16px;">We received a request to reset your password. Use the code below to complete the process:</p>
          <div style="background-color: #f4f6f8; border-radius: 6px; padding: 15px 25px; margin: 20px 0; display: inline-block;">
            <h1 style="color: #e11d48; letter-spacing: 4px; margin: 0; font-size: 32px;">{reset_otp}</h1>
          </div>
          <p style="color: #64748b; font-size: 14px;">This code is highly sensitive and will expire in 10 minutes.</p>
        </div>
        """

        background_tasks.add_task(
            send_email,
            user.email,
            "Reset your ALGONOTES Password",
            reset_email_html
        )

        return {
            "success": True,
            "message": "A secure password reset OTP has been dispatched to your email inbox."
        }

    if payload.step == "verify-otp":
        if not payload.otp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please provide the 6-digit verification code."
            )

        expiry_str = f_opts.get("otpExpiry")
        is_expired = datetime.now(timezone.utc) > datetime.fromisoformat(expiry_str) if expiry_str else True

        if f_opts.get("otp") != payload.otp or is_expired:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired code. Please request a new code."
            )

        f_opts["otpVerified"] = True

        user.forgotPasswordOptions = f_opts
        flag_modified(user, "forgotPasswordOptions")

        session.add(user)
        await session.commit()

        return {
            "success": True,
            "message": "OTP verified successfully. You can now change your new password."
        }

    if payload.step == "reset-password":
        if not payload.newPassword:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please provide your new password."
            )

        if not f_opts.get("otpVerified"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthorized access request. Please verify your OTP code first."
            )

        user.password = hash_password(payload.newPassword)

        f_opts["otp"] = None
        f_opts["otpExpiry"] = None
        f_opts["otpVerified"] = False

        user.forgotPasswordOptions = f_opts
        flag_modified(user, "forgotPasswordOptions")

        session.add(user)
        await session.commit()

        return {
            "success": True,
            "message": "Your account password has been updated successfully. Proceed to login."
        }