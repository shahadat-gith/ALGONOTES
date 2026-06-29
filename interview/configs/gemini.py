# configs/gemini.py

from google import genai

from configs.config import settings

gemini_client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)