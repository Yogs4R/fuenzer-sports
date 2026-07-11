import os
import logging
from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.models.simulation import SimulationRequest, SimulationResponse
from app.integrations.mock_data import get_mock_wc_teams
from app.services.simulation import MonteCarloEngine
from app.integrations.llm import generate_narrative, route_prompt

logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

@router.post("/simulate", response_model=SimulationResponse)
@limiter.limit("10/minute")
def run_simulation(request_obj: Request, request: SimulationRequest = None):
    
    # Setup parameters
    iterations = 10000
    custom_weights = None
    prompt = ""
    model = "Auto"
    competition = "World Cup"
    mode = "Live Standings"
    style = "Commentator Style"
    chat_history = []
    
    if request:
        iterations = request.iterations
        custom_weights = request.custom_weights
        prompt = request.prompt
        model = request.model
        competition = request.competition
        mode = request.mode
        style = request.style
        chat_history = request.chat_history
        
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
                
    # Route the prompt if provided
    if prompt:
        route_result = route_prompt(prompt, model, chat_history, competition)
        if route_result["route"] in ["GENERAL_SPORTS", "OUT_OF_CONTEXT"]:
            return SimulationResponse(
                iterations=0,
                execution_time_ms=0.0,
                probabilities={},
                sample_standings=[],
                title="Fuenzer AI Chat",
                ai_narrative=route_result["response"],
                is_general_chat=True
            )
                
    # Initialize Engine
    engine = MonteCarloEngine(teams_data=teams, n_iterations=iterations)
    
    # Run simulation
    response = engine.run()
    
    # Generate Narrative if there is a prompt
    ai_narrative = "Simulation complete."
    if prompt:
        try:
            ai_narrative = generate_narrative(
                prompt=prompt,
                chat_history=chat_history,
                simulation_results=response.model_dump(),
                selected_model=model,
                competition=competition,
                mode=mode,
                style=style,
                generate_title=request.generate_title
            )
        except Exception as e:
            from fastapi import HTTPException
            logger.error("LLM narrative generation failed: %s", e)
            raise HTTPException(status_code=500, detail="Simulation service temporarily unavailable. Please try again.")
            
    response.ai_narrative = ai_narrative
    response.title = "World Cup Simulation"
    
    if ai_narrative and ai_narrative.startswith("TITLE:"):
        lines = ai_narrative.split("\n", 1)
        response.title = lines[0].replace("TITLE:", "").replace("*", "").replace("#", "").strip()
        response.ai_narrative = lines[1].strip() if len(lines) > 1 else ""

    return response
