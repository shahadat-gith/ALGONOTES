# app/routes/leetcode.py

import asyncio
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException

from app.middlewares import get_current_user
from app.models import User
from app.utils.leetcode_queries import (
    CONTEST_QUERY,
    GET_USER_PROFILE_QUERY,
    LANGUAGE_STATS_QUERY,
    SKILL_STATS_QUERY,
    USER_PROFILE_QUERY,
)
from app.utils.leetcode_formatters import (
    format_badges_data,
    format_contest_data,
    format_language_stats,
    format_skill_stats,
    format_solved_problems_data,
    format_user_data,
    format_user_profile_data,
)

LEETCODE_API = "https://leetcode.com/graphql"

router = APIRouter(
    prefix="/leetcode",
    tags=["LeetCode"],
)



# ──────────────────────────────────────────────
# GraphQL helpers
# ──────────────────────────────────────────────

async def _fetch_graphql(variables: dict[str, Any], query: str) -> dict:
    """Raw GraphQL POST to LeetCode."""
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            LEETCODE_API,
            json={"query": query, "variables": variables},
            headers={
                "Content-Type": "application/json",
                "Referer": "https://leetcode.com",
            },
        )
        result = resp.json()

    if "errors" in result:
        raise ValueError(
            result["errors"][0].get("message", "LeetCode API error")
        )
    return result.get("data", {})


async def _fetch_endpoint(username: str, query: str) -> dict:
    return await _fetch_graphql({"username": username}, query)


# ──────────────────────────────────────────────
# Combined profile fetcher
# ──────────────────────────────────────────────

async def fetch_leetcode_profile(username: str) -> dict:
    """
    Fetch all LeetCode profile data in a single combined call.
    Shares the USER_PROFILE_QUERY response across user/solved/badges formatters
    so only one network request is made for those sections.
    """
    async def _fetch_section(name: str, query: str, formatter) -> tuple[str, Any]:
        try:
            raw = await _fetch_endpoint(username, query)
            return name, formatter(raw)
        except Exception:
            return name, None

    # Fetch the main profile query once, then apply multiple formatters
    async def _fetch_shared() -> dict | None:
        try:
            return await _fetch_endpoint(username, USER_PROFILE_QUERY)
        except Exception:
            return None

    tasks = [
        _fetch_section("contest", CONTEST_QUERY, format_contest_data),
        _fetch_section("skill", SKILL_STATS_QUERY, format_skill_stats),
        _fetch_section("language", LANGUAGE_STATS_QUERY, format_language_stats),
        _fetch_section("profile", GET_USER_PROFILE_QUERY, format_user_profile_data),
    ]

    raw_profile, *section_results = await asyncio.gather(
        _fetch_shared(), *tasks
    )

    combined: dict[str, Any] = {}

    # Apply all three formatters to the same raw profile data
    if raw_profile:
        combined["user"] = format_user_data(raw_profile)
        combined["solved"] = format_solved_problems_data(raw_profile)
        combined["badges"] = format_badges_data(raw_profile)
    else:
        combined["user"] = None
        combined["solved"] = None
        combined["badges"] = None

    for name, data in section_results:
        combined[name] = data

    return combined


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────



@router.get("/profile")
async def get_my_leetcode_profile(
    current_user: User = Depends(get_current_user),
):
    """
    Get the authenticated user's full LeetCode profile (single combined call).
    Returns user info, solved stats, badges, contest data, skills, languages,
    and recent submissions — all in one response.
    Uses the leetcode_username saved in the user's profile.
    """
    if not current_user.leetcode_username:
        raise HTTPException(
            status_code=400,
            detail="No LeetCode username linked. Please connect one first.",
        )

    username = (
        current_user.leetcode_username
        if isinstance(current_user.leetcode_username, str)
        else None
    )
    if not username:
        raise HTTPException(
            status_code=400,
            detail="Invalid LeetCode username in profile.",
        )

    try:
        data = await fetch_leetcode_profile(username)
        return {"success": True, "data": data}
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
