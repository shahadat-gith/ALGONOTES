# app/constants/__init__.py

from .email_templates import (
    welcome_email_template,
    otp_email_template,
    base_email_template
)

# Explicitly define exposed module interfaces
__all__ = [
    "welcome_email_template",
    "otp_email_template",
    "base_email_template"
]