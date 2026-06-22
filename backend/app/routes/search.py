# app/routes/search.py

import re
from typing import Optional

from fastapi import APIRouter, Depends, Query

from app.models import User, Note, Theory
from app.models.note import NoteStatus
from app.models.theory import TheoryStatus
from app.middlewares import get_current_user

router = APIRouter(
    prefix="/search",
    tags=["Global Search"],
)


def _escape_regex(text: str) -> str:
    """Escape special regex characters in the search query."""
    return re.escape(text)


@router.get("/global")
async def global_search(
    q: Optional[str] = Query(default=None, min_length=2),
    current_user: User = Depends(get_current_user),
):
    query = q.strip() if q else ""

    if not query:
        return {
            "success": True,
            "results": {"notes": [], "theories": []},
        }

    escaped = _escape_regex(query)
    regex_pattern = {"$regex": escaped, "$options": "i"}

    # Search notes using the motor collection directly for raw MongoDB queries
    notes_collection = Note.get_motor_collection()
    notes_cursor = notes_collection.find(
        {
            "user_id": current_user.id,
            "status": {"$in": [NoteStatus.draft.value, NoteStatus.final.value]},
            "$or": [
                {"problem.title": regex_pattern},
                {"language": regex_pattern},
                {"problem.platform": regex_pattern},
                {"problem.difficulty": regex_pattern},
                {"problem.topics": regex_pattern},
                {"problem.description": regex_pattern},
            ],
        },
        {
            "problem.title": 1,
            "problem.difficulty": 1,
            "problem.platform": 1,
            "language": 1,
            "status": 1,
        },
    ).sort("createdAt", -1).limit(5)

    notes = await notes_cursor.to_list(length=5)

    # Search theories using motor collection
    theories_collection = Theory.get_motor_collection()
    theories_cursor = theories_collection.find(
        {
            "user_id": current_user.id,
            "status": {"$in": [TheoryStatus.draft.value, TheoryStatus.final.value]},
            "$or": [
                {"topic": regex_pattern},
                {"content": regex_pattern},
            ],
        },
        {
            "topic": 1,
            "status": 1,
        },
    ).sort("createdAt", -1).limit(5)

    theories = await theories_cursor.to_list(length=5)

    return {
        "success": True,
        "results": {
            "notes": [
                {
                    "_id": str(n["_id"]),
                    "title": n.get("problem", {}).get("title", "") or "Untitled Note",
                    "difficulty": n.get("problem", {}).get("difficulty", "") or "",
                    "platform": n.get("problem", {}).get("platform", "") or "",
                    "language": n.get("language", "") or "",
                    "status": n.get("status", ""),
                    "type": "note",
                }
                for n in notes
            ],
            "theories": [
                {
                    "_id": str(t["_id"]),
                    "title": t.get("topic", "") or "Untitled Theory",
                    "status": t.get("status", ""),
                    "type": "theory",
                }
                for t in theories
            ],
        },
    }
