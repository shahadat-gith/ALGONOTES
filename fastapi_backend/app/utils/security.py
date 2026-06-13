import secrets

import jwt
from datetime import datetime, timedelta
from app.config.settings import settings


def generate_otp() -> str:
    """
    Generates a cryptographically secure 6-digit numeric OTP string.
    """
    # Generates a random integer between 100000 and 999999
    return str(secrets.randbelow(900000) + 100000)




def create_access_token(user_id: str) -> str:
    """
    Encodes a JWT string carrying the user's document identity.
    """
    # Parse expiration string ('7d') to delta object fallback
    days = int(settings.JWT_EXPIRES_IN.replace("d", "")) if "d" in settings.JWT_EXPIRES_IN else 7
    expire = datetime.utcnow() + timedelta(days=days)
    
    payload = {
        "userId": user_id,
        "exp": expire
    }
    
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")