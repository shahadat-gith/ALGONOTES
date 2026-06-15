from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.config import settings
from app.models import User, Note


client = None


async def init_db():
    global client

    try:
        client = AsyncIOMotorClient(
            settings.DATABASE_URL
        )

        db = client.get_default_database()

        await init_beanie(
            database=db,
            document_models=[
                User,
                Note
            ]
        )

        print("MongoDB connected successfully.")

    except Exception as e:
        print(f"MongoDB connection failed: {str(e)}")
        raise


async def close_db():
    global client

    if client:
        client.close()
        print("MongoDB connection closed.")