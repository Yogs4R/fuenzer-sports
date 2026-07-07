import httpx
import logging
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class FootballDataClient:
    BASE_URL = "https://api.football-data.org/v4"

    def __init__(self):
        self.api_key = settings.FOOTBALL_DATA_API_KEY
        self.headers = {
            "X-Auth-Token": self.api_key
        }

    async def _get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Helper method to make async GET requests."""
        if not self.api_key:
            logger.warning("No FOOTBALL_DATA_API_KEY set. API requests will likely fail.")
            
        async with httpx.AsyncClient() as client:
            url = f"{self.BASE_URL}{endpoint}"
            try:
                response = await client.get(url, headers=self.headers, params=params)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error occurred: {e}")
                raise
            except httpx.RequestError as e:
                logger.error(f"Request error occurred: {e}")
                raise

    async def get_competition_teams(self, competition_code: str = "WC") -> Dict[str, Any]:
        """Fetch all teams for a specific competition."""
        return await self._get(f"/competitions/{competition_code}/teams")

    async def get_competition_matches(self, competition_code: str = "WC") -> Dict[str, Any]:
        """Fetch all matches for a specific competition."""
        return await self._get(f"/competitions/{competition_code}/matches")

football_data_client = FootballDataClient()
