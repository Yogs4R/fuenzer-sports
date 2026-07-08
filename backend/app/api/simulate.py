from fastapi import APIRouter
from app.models.simulation import SimulationRequest, SimulationResponse
from app.integrations.mock_data import get_mock_wc_teams
from app.services.simulation import MonteCarloEngine

router = APIRouter()

@router.post("/simulate", response_model=SimulationResponse)
def run_simulation(request: SimulationRequest = None):
    # Setup parameters
    iterations = 10000
    custom_weights = None
    
    if request:
        iterations = request.iterations
        custom_weights = request.custom_weights
        
    # Get base teams
    teams_dict = get_mock_wc_teams()
    teams = teams_dict.get("teams", [])
    
    # Apply custom weights if provided
    # The weights might be keyed by TLA or Full Name, we will try to match both
    if custom_weights:
        for team in teams:
            tla = team["tla"]
            name = team["name"]
            
            boost = custom_weights.get(tla, 0.0) + custom_weights.get(name, 0.0)
            if boost != 0:
                team["power_rating"] += boost
                
    # Initialize Engine
    engine = MonteCarloEngine(teams_data=teams, n_iterations=iterations)
    
    # Run simulation
    response = engine.run()
    
    return response
