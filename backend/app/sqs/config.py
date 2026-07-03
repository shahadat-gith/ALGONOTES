import boto3
from app.config import settings

sqs_client = boto3.client(
    "sqs",
    region_name=settings.AWS_REGION,
)

QUEUE_URL = settings.SQS_QUEUE_URL