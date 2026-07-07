from typing import Dict, Any

def get_mock_wc_teams() -> Dict[str, Any]:
    """Returns mock data for World Cup teams."""
    return {
        "count": 48,
        "teams": [
            {"id": 1, "name": "Argentina", "shortName": "ARG", "tla": "ARG", "crest": "https://crests.football-data.org/762.png"},
            {"id": 2, "name": "France", "shortName": "FRA", "tla": "FRA", "crest": "https://crests.football-data.org/773.png"},
            {"id": 3, "name": "Brazil", "shortName": "BRA", "tla": "BRA", "crest": "https://crests.football-data.org/764.png"},
            {"id": 4, "name": "England", "shortName": "ENG", "tla": "ENG", "crest": "https://crests.football-data.org/770.png"},
            # Added a few as examples; a real mock would list all 48 or represent the expected structure
            {"id": 5, "name": "USA", "shortName": "USA", "tla": "USA", "crest": "https://crests.football-data.org/776.png"},
            {"id": 6, "name": "Mexico", "shortName": "MEX", "tla": "MEX", "crest": "https://crests.football-data.org/777.png"},
            {"id": 7, "name": "Canada", "shortName": "CAN", "tla": "CAN", "crest": "https://crests.football-data.org/780.png"}
        ]
    }

def get_mock_wc_matches() -> Dict[str, Any]:
    """Returns mock data for World Cup matches."""
    return {
        "matches": [
            {
                "id": 101,
                "utcDate": "2026-06-11T20:00:00Z",
                "status": "SCHEDULED",
                "stage": "GROUP_STAGE",
                "group": "GROUP A",
                "homeTeam": {"id": 5, "name": "USA", "shortName": "USA", "tla": "USA"},
                "awayTeam": {"id": 1, "name": "Argentina", "shortName": "ARG", "tla": "ARG"},
                "score": {"winner": None, "fullTime": {"home": None, "away": None}}
            }
        ]
    }
