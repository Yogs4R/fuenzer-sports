import pytest
from app.services.simulation import MonteCarloEngine
from app.integrations.mock_data import get_mock_wc_teams

def test_monte_carlo_engine_execution():
    data = get_mock_wc_teams()
    teams = data.get("teams", [])
    engine = MonteCarloEngine(teams_data=teams, n_iterations=1000)
    
    response = engine.run()
    
    assert response.iterations == 1000
    assert response.execution_time_ms > 0
    assert len(response.sample_standings) == 12
    assert len(response.probabilities) == 48

def test_monte_carlo_engine_qualifications():
    teams_data = get_mock_wc_teams()["teams"]
    # Run a small iteration count to verify the logic
    engine = MonteCarloEngine(teams_data=teams_data, n_iterations=10)
    response = engine.run()
    
    # Check that probabilities exist for top tier teams
    assert "ARG" in response.probabilities
    
    # Sum of 1st, 2nd, 3rd, 4th probabilities for any team should be exactly 100%
    for tla, probs in response.probabilities.items():
        total_pos = probs["1st"] + probs["2nd"] + probs["3rd"] + probs["4th"]
        assert pytest.approx(total_pos, 0.1) == 100.0
        
    # The total number of teams qualifying per iteration is exactly 32.
    # Therefore, the sum of all "qualify" probabilities across all 48 teams should be exactly 3200%
    total_qualify = sum(probs["qualify"] for probs in response.probabilities.values())
    assert pytest.approx(total_qualify, 0.1) == 3200.0
