from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PORT: int = 5000
    ENVIRONMENT: str = "development"  # 🌟 Defaults to development; set to 'production' on your hosting platform
    
    DATABASE_URL: str
    
    JWT_SECRET: str
    JWT_EXPIRES_IN: str = "7d"
    
    FRONTEND_URL: str          # Your development URL (e.g., http://localhost:3000)
    FRONTEND_URL_PROD: str     # 🌟 Your production URL (e.g., https://algonotes.onrender.com)
    
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

    # 🌟 Modern Pydantic v2 configuration format
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"  # Prevents server initialization crashes if extra keys exist in .env
    )

  
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        # Always include explicit frontend variables & general local dev ports
        origins = [
            "http://localhost:3000",
            "http://localhost:5173",
            self.FRONTEND_URL
        ]
        
        if self.ENVIRONMENT.lower() == "production":
            origins.append(self.FRONTEND_URL_PROD)
            
        # Clean up duplicates and empty spaces
        return list(set(origin.strip() for origin in origins if origin))

settings = Settings()