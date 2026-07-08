import os

def format_markdown(md_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    table_lines = [
        "| Rank | Nation | Squad Size | Avg. Age | Total Value | Confederation | Points |",
        "|---|---|---|---|---|---|---|"
    ]
    
    for line in lines:
        line = line.strip()
        # Skip empty lines or header fragments
        if not line or line.startswith("Nation") or line.startswith("Avg. age") or line.startswith("Total value") or line.startswith("Confederation") or line.startswith("Points"):
            continue
            
        parts = line.split('\t')
        if len(parts) >= 5:
            rank = parts[0].strip()
            team_raw = parts[1].strip()
            
            # Simple heuristic to clean up duplicate names like "Spain Spain", "United States USA"
            # It takes the first half roughly.
            words = team_raw.split()
            if len(words) == 2 and words[0] == words[1]:
                team = words[0]
            elif " " in team_raw:
                # E.g. "United States USA"
                team = " ".join(words[:-1])
            else:
                team = team_raw
                
            squad_size = parts[2].strip()
            avg_age = parts[3].strip()
            value = parts[4].strip()
            confed = parts[5].strip() if len(parts) > 5 else "-"
            points = parts[6].strip() if len(parts) > 6 else "-"
            
            table_lines.append(f"| {rank} | {team} | {squad_size} | {avg_age} | {value} | {confed} | {points} |")
            
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(table_lines) + "\n")
        
if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    md_file = os.path.join(base_dir, "fifa_national_teams_value.md")
    format_markdown(md_file)
