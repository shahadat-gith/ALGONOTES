# app/services/sqs.py

import json
import boto3
from app.config import settings


sqs_client = boto3.client("sqs", region_name="ap-south-1")


def send_ai_generation_job(
    *,
    note_id: str,
    user_id: str,
    problem_link: str,
    user_code: str,
    language: str,
):
    message = {
        "note_id": note_id,
        "user_id": user_id,
        "problem_link": problem_link,
        "user_code": user_code,
        "language": language,
    }

    sqs_client.send_message(
        QueueUrl=settings.AI_GENERATION_QUEUE_URL,
        MessageBody=json.dumps(message),
    )