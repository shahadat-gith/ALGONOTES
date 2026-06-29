from typing import List
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PORT: int = 5000
    ENVIRONMENT: str = "development"
    DATABASE_URL: str
    SQS_QUEUE_URL: str
    JWT_SECRET: str
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
    AWS_REGION: str = "ap-south-1"


    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    @computed_field
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        origins = [
            "http://localhost:3000",
            "https://www.algonotes.in",
            "https://algonotes.in",
        ]

        return list(
            set(
                origin.strip().rstrip("/")
                for origin in origins
                if origin and origin.strip()
            )
        )


settings = Settings()