# app/sqs/handler.py

import asyncio
import json
from app.database import init_db, close_db
from .router import route_incoming_ai_job  

async def start_async_queue_handler(event, context):

    await init_db()
    batch_item_failures = []
    
    try:
        for record in event.get("Records", []):
            try:
                message = json.loads(record["body"])
                await route_incoming_ai_job(message)
            except Exception as e:
                print(f"[SQS Handler Critical] Failed to completely digest message ID {record.get('messageId')}: {str(e)}")
                batch_item_failures.append({"itemIdentifier": record["messageId"]})
                
        return {"batchItemFailures": batch_item_failures}
    finally:
        await close_db()


def handler(event, context):
    return asyncio.run(start_async_queue_handler(event, context))