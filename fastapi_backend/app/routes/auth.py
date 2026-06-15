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


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# EMAIL TEMPLATES
# ==========================================
def base_email_template(title: str, body: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:0; background:#f4f7fb; font-family:Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb; padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #e5eaf0; box-shadow:0 10px 30px rgba(15,23,42,0.08);">
                
                <tr>
                  <td style="padding:28px 32px; background:linear-gradient(135deg,#0f766e,#14b8a6); color:#ffffff;">
                    <h1 style="margin:0; font-size:26px; letter-spacing:-0.5px;">AlgoNotes</h1>
                    <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">Your AI-powered DSA notes workspace</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:32px;">
                    <h2 style="margin:0 0 14px; color:#0f172a; font-size:22px;">{title}</h2>
                    {body}
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 32px; background:#f8fafc; border-top:1px solid #e5eaf0;">
                    <p style="margin:0; color:#64748b; font-size:12px; line-height:1.6;">
                      This email was sent by AlgoNotes. If you did not request this action, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    """


def welcome_email_template(verification_url: str) -> str:
    body = f"""
    <p style="color:#475569; font-size:15px; line-height:1.7; margin:0 0 22px;">
      Welcome to AlgoNotes. Verify your email address to activate your account and start generating clean DSA notes.
    </p>

    <a href="{verification_url}" target="_blank"
       style="display:inline-block; background:#0f766e; color:#ffffff; text-decoration:none; padding:13px 22px; border-radius:10px; font-weight:700; font-size:14px;">
      Verify Account
    </a>

    <p style="color:#64748b; font-size:13px; line-height:1.6; margin:24px 0 0;">
      If the button does not work, copy and paste this link into your browser:
    </p>

    <p style="margin:8px 0 0;">
      <a href="{verification_url}" style="color:#0f766e; font-size:13px; word-break:break-all;">
        {verification_url}
      </a>
    </p>
    """

    return base_email_template(
        title="Verify your AlgoNotes account",
        body=body
    )


def otp_email_template(otp: str, title: str, purpose: str, danger: bool = False) -> str:
    color = "#e11d48" if danger else "#0f766e"

    body = f"""
    <p style="color:#475569; font-size:15px; line-height:1.7; margin:0 0 20px;">
      {purpose}
    </p>

    <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:14px; padding:20px; text-align:center; margin:22px 0;">
      <p style="margin:0 0 8px; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:1.4px;">
        Your OTP Code
      </p>
      <div style="font-size:34px; font-weight:800; letter-spacing:8px; color:{color};">
        {otp}
      </div>
    </div>

    <p style="color:#64748b; font-size:13px; line-height:1.6; margin:0;">
      This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.
    </p>
    """

    return base_email_template(
        title=title,
        body=body
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

    existing_user = await User.find_one(
        User.email == user_email
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Account already exists."
        )

    new_user = User(
        name=payload.name.strip(),
        email=user_email,
        username=payload.username.lower().strip() if payload.username else None,
        password=hash_password(payload.password),
    )

    await new_user.insert()

    verification_url = (
        f"{settings.FRONTEND_URL_PROD}/verify?email={new_user.email}"
    )

    background_tasks.add_task(
        send_email,
        new_user.email,
        "Welcome to AlgoNotes",
        welcome_email_template(verification_url)
    )

    return {
        "success": True,
        "message": "Registration successful."
    }


# ==========================================
# LOGIN
# ==========================================
@router.post("/login")
async def login(payload: LoginRequest):
    user_email = payload.email.lower().strip()

    user = await User.find_one(
        User.email == user_email
    )

    if not user or not verify_password(
        payload.password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials."
        )

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

    user = await User.find_one(
        User.email == user_email
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if user.verificationOptions.status == "verified":
        raise HTTPException(
            status_code=400,
            detail="User already verified."
        )

    if payload.step == "send-otp":
        otp = generate_otp()

        user.verificationOptions.otp = otp
        user.verificationOptions.otpExpiry = (
            datetime.now(timezone.utc)
            + timedelta(minutes=10)
        )

        await user.save()

        background_tasks.add_task(
            send_email,
            user.email,
            "AlgoNotes Verification Code",
            otp_email_template(
                otp=otp,
                title="Verify your email address",
                purpose="Use this code to complete your AlgoNotes account verification."
            )
        )

        return {
            "success": True,
            "message": "OTP sent successfully."
        }

    if payload.step == "otp-verification":
        if not payload.otp:
            raise HTTPException(
                status_code=400,
                detail="OTP required."
            )

        expiry = user.verificationOptions.otpExpiry
        
        # FIXED: Enforce timezone awareness to handle native Mongo naive dates cleanly
        if expiry and expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)

        is_expired = (
            datetime.now(timezone.utc) > expiry
            if expiry else True
        )

        if (
            user.verificationOptions.otp != payload.otp
            or is_expired
        ):
            raise HTTPException(
                status_code=400,
                detail="Invalid or expired OTP."
            )

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

    user = await User.find_one(
        User.email == user_email
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if payload.step == "send-otp":
        otp = generate_otp()

        user.forgotPasswordOptions.otp = otp
        user.forgotPasswordOptions.otpExpiry = (
            datetime.now(timezone.utc)
            + timedelta(minutes=10)
        )
        user.forgotPasswordOptions.otpVerified = False

        await user.save()

        background_tasks.add_task(
            send_email,
            user.email,
            "AlgoNotes Password Reset Code",
            otp_email_template(
                otp=otp,
                title="Reset your password",
                purpose="Use this code to reset your AlgoNotes account password.",
                danger=True
            )
        )

        return {
            "success": True,
            "message": "OTP sent."
        }

    if payload.step == "verify-otp":
        if not payload.otp:
            raise HTTPException(
                status_code=400,
                detail="OTP required."
            )

        expiry = user.forgotPasswordOptions.otpExpiry
        
        # FIXED: Enforce timezone awareness to handle native Mongo naive dates cleanly
        if expiry and expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)

        is_expired = (
            datetime.now(timezone.utc) > expiry
            if expiry else True
        )

        if (
            user.forgotPasswordOptions.otp != payload.otp
            or is_expired
        ):
            raise HTTPException(
                status_code=400,
                detail="Invalid or expired OTP."
            )

        user.forgotPasswordOptions.otpVerified = True
        await user.save()

        return {
            "success": True,
            "message": "OTP verified."
        }

    if payload.step == "reset-password":
        if not payload.newPassword:
            raise HTTPException(
                status_code=400,
                detail="New password required."
            )

        if not user.forgotPasswordOptions.otpVerified:
            raise HTTPException(
                status_code=403,
                detail="OTP verification required."
            )

        user.password = hash_password(
            payload.newPassword
        )

        user.forgotPasswordOptions.otp = None
        user.forgotPasswordOptions.otpExpiry = None
        user.forgotPasswordOptions.otpVerified = False

        await user.save()

        return {
            "success": True,
            "message": "Password reset successful."
        }