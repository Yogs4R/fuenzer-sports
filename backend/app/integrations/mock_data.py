from typing import Dict, Any

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
    
    teams = []
    for idx, c in enumerate(countries):
        # Assign static power ratings based on historical tiers for realistic simulations
        tier1 = ["ARG", "FRA", "BRA", "ENG", "ESP", "GER", "POR", "NED", "BEL", "ITA", "CRO", "URU"]
        tier2 = ["SEN", "USA", "MEX", "KOR", "SUI", "DEN", "MAR", "COL", "JPN", "SRB", "SWE", "UKR"]
        tier3 = ["CMR", "GHA", "CAN", "ECU", "POL", "AUS", "TUN", "CRC", "PER", "CHI", "NGA", "EGY"]
        # Others will be tier 4
        
        if c["code"] in tier1:
            power = 85 + (idx % 10)  # 85-94
        elif c["code"] in tier2:
            power = 75 + (idx % 10)  # 75-84
        elif c["code"] in tier3:
            power = 65 + (idx % 10)  # 65-74
        else:
            power = 55 + (idx % 10)  # 55-64
            
        group_idx = idx // 4
        teams.append({
            "id": idx + 1,
            "name": c["name"],
            "shortName": c["code"],
            "tla": c["code"],
            "group": groups[group_idx],
            "power_rating": power,
            # Normally from API, but we'll mock it
            "crest": f"https://crests.football-data.org/{idx+1}.png"
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
