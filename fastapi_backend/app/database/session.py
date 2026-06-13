# app/database/session.py
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession

from app.config import settings

# 1. Safely sanitize database URL strings to guarantee asyncpg dialect usage
db_url = settings.DATABASE_URL

if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Clean out old conflicting synchronous sslmode parameters if cached
if "sslmode=" in db_url:
    db_url = db_url.replace("sslmode=require", "")
    db_url = db_url.replace("sslmode=disable", "")
    db_url = db_url.strip("?& ")

# 2. Instantiate the asynchronous engine passing explicit connection arguments
engine = create_async_engine(
    db_url,
    connect_args={"ssl": True},  # 👈 This forces asyncpg to handle Neon's SSL handshake cleanly
    echo=False,
    future=True
)

async_session_maker = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

async def init_db():
    try:
        async with engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)

        print("PostgreSQL tables initialized successfully.")

    except Exception as e:
        print(f"PostgreSQL Tables Initialization Failed: {str(e)}")
        raise e

async def get_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session