# app/config/mailer.py
from fastapi_mail import ConnectionConfig
from app.config import settings

mail_config = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,    
    MAIL_PASSWORD=settings.MAIL_PASSWORD,    
    MAIL_FROM=settings.MAIL_FROM,            
    MAIL_PORT=int(settings.MAIL_PORT), 
    MAIL_SERVER=settings.MAIL_SERVER,        
    MAIL_STARTTLS=True,                      
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME
)