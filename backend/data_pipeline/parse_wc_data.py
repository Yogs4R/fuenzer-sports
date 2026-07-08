import csv
import json
import os
import re

def parse_market_value(val_str):
    """Convert string like €1.22bn, €807.50m, €575k to integer."""
    val_str = val_str.replace('€', '').strip()
    if val_str == '-':
        return 0
        
    multiplier = 1
    if val_str.endswith('bn'):
        multiplier = 1000000000
        val_str = val_str[:-2]
    elif val_str.endswith('m'):
        multiplier = 1000000
        val_str = val_str[:-1]
    elif val_str.endswith('k'):
        multiplier = 1000
        val_str = val_str[:-1]
        
    try:
        return int(float(val_str) * multiplier)
    except ValueError:
        return 0

def process_data(csv_path, md_path, json_path):
    # 1. Parse Markdown for updated market values
    market_values = {}
    with open(md_path, 'r', encoding='utf-8') as f:
        for line in f:
            parts = line.strip().split('\t')
            if len(parts) >= 5:
                # E.g., ['1  ', 'Argentina Argentina', '26', '29.2', '€807.50m', 'CONMEBOL', '1877']
                team_col = parts[1].strip()
                val_col = parts[4].strip()
                
                # The team name is duplicated in the markdown (e.g. "Spain Spain" or "United States USA")
                # We extract the unique words to match against the CSV
                words = team_col.split()
                # Often it's like "United States USA", we'll just store the mapping using the first word or known names
                market_values[team_col] = parse_market_value(val_col)

    # 2. Read CSV
    wc_data = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            team = row['team']
            
            # Find matching team in market_values
            # E.g. "United States" in "United States USA"
            new_value = None
            for md_team, val in market_values.items():
                if team.lower() in md_team.lower():
                    new_value = val
                    break
            
            # Type casting for JSON
            for k, v in row.items():
                if v == '':
                    row[k] = None
                elif v.isdigit():
                    row[k] = int(v)
                else:
                    try:
                        row[k] = float(v)
                    except ValueError:
                        pass
            
            if new_value is not None:
                row['squad_total_market_value_eur'] = new_value
                
            wc_data.append(row)
            
    # 3. Save JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(wc_data, f, indent=4)
        
    print(f"Successfully merged updated market values and saved to {json_path}")

if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    csv_file = os.path.join(base_dir, "fifa_world_cup_mens_2026.csv")
    md_file = os.path.join(base_dir, "fifa_national_teams_value.md")
    json_file = os.path.join(base_dir, "fifa_world_cup_mens_2026.json")
    
    process_data(csv_file, md_file, json_file)
