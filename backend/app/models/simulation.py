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
    name: str
    crest: str
    power_rating: float = 60.0
    points: int = 0
    goals_for: int = 0
    goals_against: int = 0
    goal_difference: int = 0
    matches_played: int = 0
    won: int = 0
    draw: int = 0
    lost: int = 0

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
    title: str = "World Cup Simulation"
    ai_narrative: str = None
    is_general_chat: bool = False
    needs_clarification: bool = False
    clarification_target: str = None

class ChatMessage(BaseModel):
    role: str
    content: str

class SimulationRequest(BaseModel):
    iterations: int = 10000
    custom_weights: Dict[str, float] = None
    prompt: str = ""
    model: str = "Auto"
    competition: str = "World Cup"
    mode: str = "Live Standings"
    style: str = "Commentator Style"
    chat_history: List[ChatMessage] = []
    generate_title: bool = False
    custom_teams: List[Dict] = None
    resolved_clarification: Dict[str, str] = None
