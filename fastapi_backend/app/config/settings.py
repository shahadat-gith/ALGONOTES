from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PORT: int = 5000
    ENVIRONMENT: str = "development"

    DATABASE_URL: str
    AI_GENERATION_QUEUE_URL: str

    JWT_SECRET: str
    JWT_EXPIRES_IN: str = "7d"

    FRONTEND_URL: str = "http://localhost:5173"
    FRONTEND_URL_PROD: str = "https://algonotes.onrender.com"

    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    MAIL_SERVER: str
    MAIL_PORT: int
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_FROM_NAME: str

    GEMINI_API_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        origins = [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            self.FRONTEND_URL,
            self.FRONTEND_URL_PROD,
            "https://algonotes.onrender.com",
        ]

        return list(
            set(
                origin.strip().rstrip("/")
                for origin in origins
                if origin and origin.strip()
            )
        )


settings = Settings()