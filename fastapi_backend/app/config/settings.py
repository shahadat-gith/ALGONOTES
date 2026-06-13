# app/config.py snippet
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = 5000
    DATABASE_URL: str
    
    JWT_SECRET: str
    JWT_EXPIRES_IN: str = "7d"  # 👈 Added default fallback value layout
    
    FRONTEND_URL: str
    
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    
    # Matching your Brevo mappings perfectly
    MAIL_SERVER: str
    MAIL_PORT: int
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_FROM_NAME: str
    
    GEMINI_API_KEY: str

    class Config:
        env_file = ".env"
        extra = "ignore" # Prevents server initialization crashes if extra keys exist

settings = Settings()