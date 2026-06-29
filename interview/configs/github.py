import httpx

from configs.config import settings


github_client = httpx.AsyncClient(
    base_url="https://api.github.com",
    headers={
        "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "ALGONOTES-Interview-Service"
    },
    timeout=httpx.Timeout(30.0),
    follow_redirects=True,
)