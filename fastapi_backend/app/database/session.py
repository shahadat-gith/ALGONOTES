# app/database/session.py
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import AsyncGenerator

from app.config import settings

# 1. Grab the database URL from settings
db_url = settings.DATABASE_URL

# 2. Instantiate the asynchronous engine using the direct Supabase port (5432)
# and use ssl="require" for a smooth, encrypted handshake.
engine = create_async_engine(
    db_url,
    connect_args={"ssl": "require"}, 
    echo=False,
    future=True
)

# 3. Create the session maker bound to our async engine
async_session_maker = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# 4. Initialize tables (runs on application startup if called)
async def init_db() -> None:
    try:
        async with engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
    except Exception as e:
        print(f"Supabase PostgreSQL Initialization Failed: {str(e)}")
        raise e

# 5. Dependency injection function for your FastAPI routes
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session