# configs/huggingface.py

from huggingface_hub import InferenceClient

from configs.config import settings

hf_client = InferenceClient(
    api_key=settings.HF_API_KEY
)