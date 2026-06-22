import secrets

import jwt
from app.config.settings import settings


def generate_otp() -> str:
    """
    Generates a cryptographically secure 6-digit numeric OTP string.
    """
    # Generates a random integer between 100000 and 999999
    return str(secrets.randbelow(900000) + 100000)


def create_access_token(user_id: str) -> str:
    payload = {
        "userId": user_id,
    }

    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")