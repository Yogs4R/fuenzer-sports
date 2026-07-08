from typing import Dict, Any
import json
import os

def get_elo_ratings() -> dict:
    """Reads the Elo ratings JSON and returns a dictionary mapping team names to ratings."""
    points_map = {}
    json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "eloratings.json")
    
    if os.path.exists(json_path):
        with open(json_path, mode='r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                for item in data:
                    points_map[item["Team"]] = float(item["Rating"])
            except (json.JSONDecodeError, KeyError):
                pass
    return points_map

def get_wc_stats() -> dict:
    """Reads the World Cup stats JSON and returns a dictionary mapping team names to their stats."""
    stats_map = {}
    json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "fifa_world_cup_mens_2026.json")
    
    if os.path.exists(json_path):
        with open(json_path, mode='r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                for item in data:
                    stats_map[item["team"]] = item
            except (json.JSONDecodeError, KeyError):
                pass
    return stats_map

def get_mock_wc_teams() -> Dict[str, Any]:
    """Returns mock data for World Cup teams (48 teams) loaded from live JSON."""
    # Load real Elo points
    elo_ratings = get_elo_ratings()
    # Load WC Stats (host, market value)
    wc_stats = get_wc_stats()
    
    # Try to load live standings
    live_standings_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "football_data_standings.json")
    
    teams = []
    
    # Name aliases mapping (football-data API -> kaggle/elo names)
    name_aliases = {
        "Korea Republic": "South Korea",
        "Czechia": "Czech Republic",
        "USA": "United States",
        "IR Iran": "Iran"
    }
    
    if os.path.exists(live_standings_path):
        with open(live_standings_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                idx = 0
                for group_data in data.get("standings", []):
                    group_name = group_data.get("group", "Unknown Group")
                    for t_data in group_data.get("table", []):
                        raw_name = t_data["team"]["name"]
                        tla = t_data["team"].get("tla", raw_name[:3].upper())
                        crest = t_data["team"].get("crest", f"https://crests.football-data.org/{t_data['team']['id']}.svg")
                        
                        # Apply alias if exists
                        name = name_aliases.get(raw_name, raw_name)
        
                        # Get raw Elo points (default to 1500 if not found)
                        raw_points = elo_ratings.get(name, 1500.0)
                        power = max(10, (raw_points - 1000) / 10)
                        
                        # Get WC Stats
                        stats = wc_stats.get(name, {})
                        is_host = stats.get("is_host", 0)
                        market_value = stats.get("squad_total_market_value_eur", 0)
                        if market_value is None:
                            market_value = 0
                            
                        teams.append({
                            "id": idx + 1,
                            "name": name,
                            "shortName": tla,
                            "tla": tla,
                            "crest": crest,
                            "group": group_name,
                            "power_rating": power,
                            "is_host": is_host,
                            "market_value": market_value
                        })
                        idx += 1
            except Exception as e:
                pass
        
    return {
        "count": len(teams),
        "teams": teams
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
                "homeTeam": {"id": 15, "name": "USA", "shortName": "USA", "tla": "USA"},
                "awayTeam": {"id": 1, "name": "Argentina", "shortName": "ARG", "tla": "ARG"},
                "score": {"winner": None, "fullTime": {"home": None, "away": None}}
            }
        ]
    }
