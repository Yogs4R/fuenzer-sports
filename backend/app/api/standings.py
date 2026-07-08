import os
import json
from fastapi import APIRouter
from typing import List
from app.models.simulation import GroupStandings, TeamStats

router = APIRouter()

@router.get("/standings/live", response_model=List[GroupStandings])
def get_live_standings():
    """Returns the live World Cup 2026 group standings from football-data."""
    live_standings_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
        "data", "football_data_standings.json"
    )
    
    if not os.path.exists(live_standings_path):
        return []
        
    result = []
    try:
        with open(live_standings_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        for group_data in data.get("standings", []):
            group_name = group_data.get("group", "Unknown Group")
            teams_list = []
            
            for t_data in group_data.get("table", []):
                raw_name = t_data["team"]["name"]
                tla = t_data["team"].get("tla")
                if not tla:
                    tla = raw_name[:3].upper()
                crest = t_data["team"].get("crest", "")
                
                team_stats = TeamStats(
                    id=t_data["team"]["id"],
                    tla=tla,
                    name=raw_name,
                    crest=crest,
                    points=t_data.get("points", 0),
                    goals_for=t_data.get("goalsFor", 0),
                    goals_against=t_data.get("goalsAgainst", 0),
                    goal_difference=t_data.get("goalDifference", 0),
                    matches_played=t_data.get("playedGames", 0),
                    won=t_data.get("won", 0),
                    draw=t_data.get("draw", 0),
                    lost=t_data.get("lost", 0)
                )
                teams_list.append(team_stats)
                
            result.append(GroupStandings(group_name=group_name, teams=teams_list))
    except Exception as e:
        print(f"Error parsing live standings: {e}")
        
    return result
