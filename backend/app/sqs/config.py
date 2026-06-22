# app/sqs/config.py

import boto3
from app.config import settings

sqs_client = boto3.client(
    "sqs",
    region_name=settings.AWS_REGION,
)

# Centralize the deployment Queue URL parameter string references
QUEUE_URL = settings.SQS_QUEUE_URL
