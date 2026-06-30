from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from pymongo.errors import ConfigurationError

from app.config import settings
from app.models import User, Note, Theory
from app.models import TempPromptJob
from app.models import Analytics
from app.models import ApiLog


client = None


async def init_db():
    global client

    try:
        client = AsyncIOMotorClient(settings.DATABASE_URL)
        db_name = client.get_default_database().name
        db = client[db_name]

        await init_beanie(
            database=db,
            document_models=[
                User,
                Note,
                Theory,
                TempPromptJob,
                Analytics,
                ApiLog,
            ]
        )

        print(f"MongoDB connected successfully")

    except Exception as e:
        print(f"MongoDB connection failed: {str(e)}")
        raise


async def close_db():
    global client

    if client:
        client.close()
        print("MongoDB connection closed.")