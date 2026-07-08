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
    """Returns mock data for World Cup teams (48 teams)."""
    countries = [
        {"name": "Argentina", "code": "ARG"}, {"name": "France", "code": "FRA"}, {"name": "Japan", "code": "JPN"}, {"name": "Morocco", "code": "MAR"},
        {"name": "Brazil", "code": "BRA"}, {"name": "Germany", "code": "GER"}, {"name": "Spain", "code": "ESP"}, {"name": "England", "code": "ENG"},
        {"name": "Netherlands", "code": "NED"}, {"name": "Portugal", "code": "POR"}, {"name": "Croatia", "code": "CRO"}, {"name": "Belgium", "code": "BEL"},
        {"name": "Uruguay", "code": "URU"}, {"name": "Senegal", "code": "SEN"}, {"name": "USA", "code": "USA"}, {"name": "Mexico", "code": "MEX"},
        {"name": "South Korea", "code": "KOR"}, {"name": "Switzerland", "code": "SUI"}, {"name": "Cameroon", "code": "CMR"}, {"name": "Ghana", "code": "GHA"},
        {"name": "Canada", "code": "CAN"}, {"name": "Ecuador", "code": "ECU"}, {"name": "Poland", "code": "POL"}, {"name": "Australia", "code": "AUS"},
        {"name": "Denmark", "code": "DEN"}, {"name": "Tunisia", "code": "TUN"}, {"name": "Costa Rica", "code": "CRC"}, {"name": "Saudi Arabia", "code": "KSA"},
        {"name": "Qatar", "code": "QAT"}, {"name": "Iran", "code": "IRN"}, {"name": "Serbia", "code": "SRB"}, {"name": "Wales", "code": "WAL"},
        {"name": "Italy", "code": "ITA"}, {"name": "Colombia", "code": "COL"}, {"name": "Sweden", "code": "SWE"}, {"name": "Ukraine", "code": "UKR"},
        {"name": "Peru", "code": "PER"}, {"name": "Chile", "code": "CHI"}, {"name": "Nigeria", "code": "NGA"}, {"name": "Egypt", "code": "EGY"},
        {"name": "Algeria", "code": "ALG"}, {"name": "Turkey", "code": "TUR"}, {"name": "Austria", "code": "AUT"}, {"name": "Hungary", "code": "HUN"},
        {"name": "Czech Republic", "code": "CZE"}, {"name": "Romania", "code": "ROU"}, {"name": "Greece", "code": "GRE"}, {"name": "New Zealand", "code": "NZL"}
    ]
    # 12 Groups (A to L), 4 teams per group
    groups = [
        "Group A", "Group B", "Group C", "Group D", "Group E", "Group F",
        "Group G", "Group H", "Group I", "Group J", "Group K", "Group L"
    ]
    
    # Load real Elo points
    elo_ratings = get_elo_ratings()
    # Load WC Stats (host, market value)
    wc_stats = get_wc_stats()
    
    teams = []
    for idx, c in enumerate(countries):
        name = c["name"]
        
        # Get raw Elo points (default to 1500 if not found)
        raw_points = elo_ratings.get(name, 1500.0)
        
        # Scale to a 0-100ish power rating for our Poisson calculation
        # Elo ratings usually span from 1000 to 2200
        # e.g., 2100 points -> 110 power, 1500 points -> 50 power
        power = max(10, (raw_points - 1000) / 10)
        
        # Get WC Stats
        stats = wc_stats.get(name, {})
        is_host = stats.get("is_host", 0)
        market_value = stats.get("squad_total_market_value_eur", 0)
        if market_value is None:
            market_value = 0
            
        group_idx = idx // 4
        teams.append({
            "id": idx + 1,
            "name": c["name"],
            "shortName": c["code"],
            "tla": c["code"],
            "crest": f"https://crests.football-data.org/{idx + 1}.svg",
            "group": groups[group_idx],
            "power_rating": power,
            "is_host": is_host,
            "market_value": market_value
        })
        
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
