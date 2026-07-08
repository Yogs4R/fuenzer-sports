import os
from fastapi import APIRouter
from app.models.simulation import SimulationRequest, SimulationResponse
from app.integrations.mock_data import get_mock_wc_teams
from app.services.simulation import MonteCarloEngine

router = APIRouter()

def get_count_filepath():
    return os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
        "data", "simulation_count.txt"
    )

def get_simulation_count() -> int:
    count_file = get_count_filepath()
    if not os.path.exists(count_file):
        os.makedirs(os.path.dirname(count_file), exist_ok=True)
        try:
            with open(count_file, 'w') as f:
                f.write("12450")
            return 12450
        except Exception:
            return 12450
    try:
        with open(count_file, 'r') as f:
            return int(f.read().strip())
    except Exception:
        return 12450

def increment_simulation_count():
    count_file = get_count_filepath()
    count = get_simulation_count()
    try:
        with open(count_file, 'w') as f:
            f.write(str(count + 1))
    except Exception:
        pass

@router.get("/simulate/count")
def get_count():
    return {"count": get_simulation_count()}

@router.post("/simulate", response_model=SimulationResponse)
def run_simulation(request: SimulationRequest = None):
    # Increment counter
    increment_simulation_count()
    
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
