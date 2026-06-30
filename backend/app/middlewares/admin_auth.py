# app/middlewares/admin_auth.py

from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt.exceptions import ExpiredSignatureError

from app.config import settings


admin_security = HTTPBearer(auto_error=False)


def get_admin_token() -> str:
    """Create a JWT for admin with a special role claim and short expiry."""
    payload = {
        "role": "admin",
        "email": settings.ADMIN_EMAIL,
        "exp": datetime.now(timezone.utc) + timedelta(hours=2),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


async def get_admin_user(
    credentials: HTTPAuthorizationCredentials = Depends(admin_security),
) -> dict:
    """Verify that the request carries a valid admin JWT.

    Returns the decoded payload dict on success.
    Mirrors the pattern of get_current_user in auth.py.
    """
    unauthorized_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorized. Admin access required.",
    )

    if not credentials:
        raise unauthorized_exception

    if credentials.scheme.lower() != "bearer":
        raise unauthorized_exception

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=["HS256"],
        )

        if payload.get("role") != "admin":
            raise unauthorized_exception

        if payload.get("email") != settings.ADMIN_EMAIL:
            raise unauthorized_exception

        return payload

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin session expired. Please login again.",
        )
    except Exception:
        raise unauthorized_exception
