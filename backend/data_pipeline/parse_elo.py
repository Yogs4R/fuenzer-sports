import json
import re
import os

def safe_int(val):
    val = val.replace('−', '-').replace('+', '').strip()
    try:
        return int(val)
    except ValueError:
        return 0

def parse_elo_markdown(md_path, json_path):
    teams_data = []
    
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f if line.strip()]
        
    current_team = None
    team_values = []
    rank = 1
    
    for line in lines:
        match = re.match(r'^\[(.*?)\]\(.*?\)$', line)
        if match:
            current_team = match.group(1)
            team_values = []
        elif current_team:
            team_values.append(line)
            if len(team_values) == 14:
                team_dict = {
                    "Rank": rank,
                    "Team": current_team,
                    "Rating": safe_int(team_values[0]),
                    "Average_Rank": safe_int(team_values[1]),
                    "Average_Rating": safe_int(team_values[2]),
                    "One_Year_Change_Rank": safe_int(team_values[3]),
                    "One_Year_Change_Rating": safe_int(team_values[4]),
                    "Matches_Total": safe_int(team_values[5]),
                    "Matches_Home": safe_int(team_values[6]),
                    "Matches_Away": safe_int(team_values[7]),
                    "Matches_Neutral": safe_int(team_values[8]),
                    "Wins": safe_int(team_values[9]),
                    "Losses": safe_int(team_values[10]),
                    "Draws": safe_int(team_values[11]),
                    "Goals_For": safe_int(team_values[12]),
                    "Goals_Against": safe_int(team_values[13])
                }
                teams_data.append(team_dict)
                current_team = None
                team_values = []
                rank += 1
                
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(teams_data, f, indent=4)
        
    print(f"Successfully parsed {len(teams_data)} teams into {json_path}")

if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    md_file = os.path.join(base_dir, "eloratings.md")
    json_file = os.path.join(base_dir, "eloratings.json")
    
    parse_elo_markdown(md_file, json_file)
