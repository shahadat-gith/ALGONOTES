# app/database/session.py
import os
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import AsyncGenerator

from app.config import settings

db_url = settings.DATABASE_URL

# Check if the code is executing inside an ephemeral AWS Lambda container
IS_SERVERLESS = os.getenv("AWS_LAMBDA_FUNCTION_NAME") is not None

# Instantiate the asynchronous engine with serverless-optimized pool scaling properties
engine = create_async_engine(
    settings.DATABASE_URL,
    connect_args={"ssl": "require"}, 
    echo=False,
    future=True,
    # Serverless specific configuration optimizations:
    pool_size=1 if IS_SERVERLESS else 5,       
    max_overflow=0 if IS_SERVERLESS else 10,   
    pool_pre_ping=True,                        
    pool_recycle=1800                          
)

async_session_maker = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

async def init_db() -> None:
    # If running inside AWS serverless spaces, exit immediately
    if IS_SERVERLESS:
        print("Serverless container context detected. Bypassing schema reflection loops.")
        return

    # Local execution safety net fallback
    try:
        async with engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
    except Exception as e:
        print(f"Supabase PostgreSQL Initialization Failed: {str(e)}")
        raise e

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session