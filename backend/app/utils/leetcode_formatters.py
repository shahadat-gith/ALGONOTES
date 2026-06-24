# app/utils/leetcode_formatters.py
# LeetCode GraphQL response formatters

import json
from typing import Any


def format_user_data(data: dict) -> dict:
    matched = data.get("matchedUser", {})
    profile = matched.get("profile", {})
    return {
        "username": matched.get("username"),
        "name": profile.get("realName"),
        "birthday": profile.get("birthday"),
        "avatar": profile.get("userAvatar"),
        "ranking": profile.get("ranking"),
        "reputation": profile.get("reputation"),
        "gitHub": matched.get("githubUrl"),
        "twitter": matched.get("twitterUrl"),
        "linkedIN": matched.get("linkedinUrl"),
        "website": profile.get("websites"),
        "country": profile.get("countryName"),
        "company": profile.get("company"),
        "school": profile.get("school"),
        "skillTags": profile.get("skillTags"),
        "about": profile.get("aboutMe"),
    }


def format_solved_problems_data(data: dict) -> dict:
    matched = data.get("matchedUser", {})
    submit_stats = matched.get("submitStats", {})
    ac_submission_num = submit_stats.get("acSubmissionNum", [])
    total_submission_num = submit_stats.get("totalSubmissionNum", [])

    return {
        "solvedProblem": ac_submission_num[0]["count"] if len(ac_submission_num) > 0 else 0,
        "easySolved": ac_submission_num[1]["count"] if len(ac_submission_num) > 1 else 0,
        "mediumSolved": ac_submission_num[2]["count"] if len(ac_submission_num) > 2 else 0,
        "hardSolved": ac_submission_num[3]["count"] if len(ac_submission_num) > 3 else 0,
        "totalSubmissionNum": total_submission_num,
        "acSubmissionNum": ac_submission_num,
    }


def format_badges_data(data: dict) -> dict:
    matched = data.get("matchedUser", {})
    badges = matched.get("badges", [])
    return {
        "badgesCount": len(badges),
        "badges": badges,
        "upcomingBadges": matched.get("upcomingBadges", []),
        "activeBadge": matched.get("activeBadge"),
    }


def format_contest_data(data: dict) -> dict:
    ranking = data.get("userContestRanking") or {}
    history = data.get("userContestRankingHistory", [])
    return {
        "contestAttend": ranking.get("attendedContestsCount"),
        "contestRating": ranking.get("rating"),
        "contestGlobalRanking": ranking.get("globalRanking"),
        "totalParticipants": ranking.get("totalParticipants"),
        "contestTopPercentage": ranking.get("topPercentage"),
        "contestBadges": ranking.get("badge"),
        "contestParticipation": [h for h in history if h.get("attended")],
    }


def format_skill_stats(data: dict) -> dict:
    matched = data.get("matchedUser", {})
    tag_counts = matched.get("tagProblemCounts", {})
    return {
        "fundamental": tag_counts.get("fundamental", []),
        "intermediate": tag_counts.get("intermediate", []),
        "advanced": tag_counts.get("advanced", []),
    }


def format_language_stats(data: dict) -> dict:
    matched = data.get("matchedUser", {})
    return {
        "languageProblemCount": matched.get("languageProblemCount", []),
    }


def format_user_profile_data(data: dict) -> dict:
    matched = data.get("matchedUser", {})
    submit_stats = matched.get("submitStats", {})
    ac_submission_num = submit_stats.get("acSubmissionNum", [])
    total_submission_num = submit_stats.get("totalSubmissionNum", [])
    all_questions = data.get("allQuestionsCount", [])
    profile = matched.get("profile", {})
    submission_calendar_raw = matched.get("submissionCalendar", "{}")

    try:
        submission_calendar = json.loads(submission_calendar_raw)
    except (json.JSONDecodeError, TypeError):
        submission_calendar = {}

    return {
        "totalSolved": ac_submission_num[0]["count"] if len(ac_submission_num) > 0 else 0,
        "totalSubmissions": total_submission_num,
        "totalQuestions": all_questions[0]["count"] if len(all_questions) > 0 else 0,
        "easySolved": ac_submission_num[1]["count"] if len(ac_submission_num) > 1 else 0,
        "totalEasy": all_questions[1]["count"] if len(all_questions) > 1 else 0,
        "mediumSolved": ac_submission_num[2]["count"] if len(ac_submission_num) > 2 else 0,
        "totalMedium": all_questions[2]["count"] if len(all_questions) > 2 else 0,
        "hardSolved": ac_submission_num[3]["count"] if len(ac_submission_num) > 3 else 0,
        "totalHard": all_questions[3]["count"] if len(all_questions) > 3 else 0,
        "ranking": profile.get("ranking"),
        "contributionPoint": matched.get("contributions", {}).get("points"),
        "reputation": profile.get("reputation"),
        "submissionCalendar": submission_calendar,
        "recentSubmissions": data.get("recentSubmissionList", []),
        "matchedUserStats": submit_stats,
    }
