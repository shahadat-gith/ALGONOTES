# app/prompts/__init__.py

from .note_prompt import generate_note_prompt
from .theory_prompt import generate_theory_prompt

__all__ = [
    "generate_note_prompt",
    "generate_theory_prompt",
]