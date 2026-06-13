# app/services/mailer.py (Example structure)
from fastapi_mail import FastMail, MessageSchema, MessageType
from app.config.mailer import mail_config

async def send_email(email_to: str, subject: str, body_html: str):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=body_html,
        subtype=MessageType.html
    )
    fm = FastMail(mail_config)
    await fm.send_message(message)