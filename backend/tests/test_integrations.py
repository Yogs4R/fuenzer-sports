import pytest
from app.integrations.mock_data import generate_mock_teams

def test_mock_data_generation():
    """Test that the mock data generates 48 teams for the World Cup format."""
    teams = generate_mock_teams()
    assert len(teams) == 48
    
    # Check that required keys exist
    first_team = teams[0]
    assert "id" in first_team
    assert "name" in first_team
    assert "tla" in first_team
    assert "group" in first_team
    
    # Check that groups go from A to L (12 groups of 4 teams = 48)
    groups = set(team["group"] for team in teams)
    assert "Group A" in groups
    assert "Group L" in groups
    assert len(groups) == 12
