# app/constants/__init__.py

from .email_templates import (
    otp_email_template,
    base_email_template,
    welcome_email_template
)

# Explicitly define exposed module interfaces
__all__ = [
    "otp_email_template",
    "base_email_template",
    "welcome_email_template"
]