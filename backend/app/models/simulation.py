from pydantic import BaseModel
from typing import List, Dict

class TeamRating(BaseModel):
    id: int
    tla: str
    name: str
    group: str
    power_rating: int

class TeamStats(BaseModel):
    id: int
    tla: str
    points: int = 0
    goals_for: int = 0
    goals_against: int = 0
    goal_difference: int = 0
    matches_played: int = 0

class MatchResult(BaseModel):
    home_team_id: int
    away_team_id: int
    home_goals: int
    away_goals: int

class GroupStandings(BaseModel):
    group_name: str
    teams: List[TeamStats]

class SimulationResponse(BaseModel):
    iterations: int
    execution_time_ms: float
    probabilities: Dict[str, Dict[str, float]]
    sample_standings: List[GroupStandings]
