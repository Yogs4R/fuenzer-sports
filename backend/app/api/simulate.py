import os
import logging
from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.models.simulation import SimulationRequest, SimulationResponse
from app.integrations.mock_data import get_mock_wc_teams
from app.services.simulation import MonteCarloEngine
from app.integrations.llm import generate_narrative, orchestrate_agent

logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

@router.post("/simulate", response_model=SimulationResponse)
@limiter.limit("10/minute")
def run_simulation(request: Request, payload: SimulationRequest = None):
    
    # Setup parameters
    iterations = 10000
    custom_weights = None
    prompt = ""
    model = "Auto"
    competition = "World Cup"
    mode = "Live Standings"
    style = "Commentator Style"
    chat_history = []
    
    if payload:
        iterations = payload.iterations
        custom_weights = payload.custom_weights
        prompt = payload.prompt
        model = payload.model
        competition = payload.competition
        mode = payload.mode
        style = payload.style
        chat_history = payload.chat_history
        
    teams = []
    teams_per_group = 4
    
    if payload and payload.custom_teams:
        teams = payload.custom_teams
        teams_per_group = 4 if len(teams) >= 4 else len(teams)
    elif competition == "Custom":
        teams = []
    else:
        teams_dict = get_mock_wc_teams()
        teams = teams_dict.get("teams", [])

    if custom_weights:
        for team in teams:
            tla = team["tla"]
            name = team["name"]
            boost = custom_weights.get(tla, 0.0) + custom_weights.get(name, 0.0)
            if boost != 0:
                team["power_rating"] += boost

    # Route the prompt via the master Orchestrator if provided
    if prompt:
        effective_prompt = prompt
        if payload and payload.resolved_clarification:
            target = payload.resolved_clarification.get("target")
            team_val = payload.resolved_clarification.get("team")
            effective_prompt += f"\n[System Note: The user confirmed that '{target}' plays for the team '{team_val}'.]"
            
        orchestrator_result = orchestrate_agent(effective_prompt, teams, model, chat_history, competition)
        action = orchestrator_result.get("action")
        
        if action == "chat":
            return SimulationResponse(
                iterations=0,
                execution_time_ms=0.0,
                probabilities={},
                sample_standings=[],
                title="Fuenzer AI Chat",
                ai_narrative=orchestrator_result.get("response", ""),
                is_general_chat=True
            )
        elif action == "clarify":
            return SimulationResponse(
                iterations=0,
                execution_time_ms=0.0,
                probabilities={},
                sample_standings=[],
                needs_clarification=True,
                clarification_target=orchestrator_result.get("unknown_entity")
            )
        elif action == "create_custom":
            # The LLM generated the custom teams inside the tool call!
            generated_teams = orchestrator_result.get("teams", [])
            if generated_teams:
                teams = generated_teams
                teams_per_group = 4 if len(teams) >= 4 else len(teams)
            # Proceed to simulate the newly generated custom teams
        elif action == "simulate":
            # Apply modifiers
            modifiers = orchestrator_result.get("modifiers", [])
            for mod in modifiers:
                tla = mod.get("tla")
                boost = mod.get("boost", 0)
                for t in teams:
                    if t["tla"] == tla or t["name"] == tla:
                        t["power_rating"] += boost
                        
    # Ensure teams exist
    if not teams:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="No teams available to simulate.")
        
    # Initialize Engine
    engine = MonteCarloEngine(teams_data=teams, n_iterations=iterations, teams_per_group=teams_per_group)

    
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
                generate_title=payload.generate_title if payload else False
            )
        except Exception as e:
            from fastapi import HTTPException
            logger.error("LLM narrative generation failed: %s", e)
            raise HTTPException(status_code=500, detail="Simulation service temporarily unavailable. Please try again.")
            
    response.ai_narrative = ai_narrative
    response.title = "Custom Tournament Simulation" if competition == "Custom" else f"{competition} Simulation"
    
    if ai_narrative and ai_narrative.startswith("TITLE:"):
        lines = ai_narrative.split("\n", 1)
        response.title = lines[0].replace("TITLE:", "").replace("*", "").replace("#", "").strip()
        response.ai_narrative = lines[1].strip() if len(lines) > 1 else ""

    return response
