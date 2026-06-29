from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str
    DEBUG: bool
    LOG_LEVEL: str

    GEMINI_API_KEY: str
    GEMINI_MODEL: str

    HF_API_KEY: str
    HF_EMBEDDING_MODEL: str

    GITHUB_TOKEN: str

    MONGODB_URI: str
    DATABASE_NAME: str

    QDRANT_URL: str
    QDRANT_API_KEY: str
    QDRANT_COLLECTION: str

    MAIN_API_URL: str
    MAIN_API_KEY: str

    JWT_SECRET: str
    JWT_ALGORITHM: str

    CHUNK_SIZE: int
    CHUNK_OVERLAP: int
    TOP_K_RESULTS: int

    MAX_FILE_SIZE: int
    UPLOAD_DIR: str
    REPO_DIR: str

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()