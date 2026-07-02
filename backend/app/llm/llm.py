from openai import OpenAI

from app.config import settings

client = OpenAI(
    api_key=settings.OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
)

MODEL = settings.OPENROUTER_MODEL
TEMPERATURE = 0.2


