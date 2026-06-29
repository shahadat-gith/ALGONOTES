from motor.motor_asyncio import AsyncIOMotorClient
from configs.config import settings

client = AsyncIOMotorClient(settings.MONGODB_URI)

db = client[settings.DATABASE_NAME]