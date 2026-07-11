import time
import numpy as np
from typing import List, Dict, Any
from app.models.simulation import SimulationResponse, GroupStandings, TeamStats

class MonteCarloEngine:
    def __init__(self, teams_data: List[Dict[str, Any]], n_iterations: int = 10000, teams_per_group: int = 4):
        self.teams_data = teams_data
        self.n_iterations = n_iterations
        self.teams_per_group = teams_per_group
        self.n_teams = len(teams_data)
        self.n_groups = self.n_teams // self.teams_per_group if self.teams_per_group > 0 else 0
        
        # Parse data
        self.tlas = [t["tla"] for t in self.teams_data]
        self.powers = np.array([t.get("power_rating", 60) for t in self.teams_data])
        self.is_host = np.array([t.get("is_host", 0) for t in self.teams_data])
        self.market_value = np.array([t.get("market_value", 0) for t in self.teams_data])
        
        self.setup_matches()

    def setup_matches(self):
        """Pre-calculate matchups for all 12 groups."""
        self.matches = []
        for g in range(self.n_groups):
            base = g * self.teams_per_group
            for i in range(self.teams_per_group):
                for j in range(i + 1, self.teams_per_group):
                    self.matches.append((base + i, base + j))
        
        self.matches = np.array(self.matches) # Shape (72, 2)
        
    def run(self) -> SimulationResponse:
        start_time = time.time()
        
        N = self.n_iterations
        M = len(self.matches)
        
        home_idx = self.matches[:, 0]
        away_idx = self.matches[:, 1]
        
        home_power = self.powers[home_idx]
        away_power = self.powers[away_idx]
        
        home_is_host = self.is_host[home_idx]
        away_is_host = self.is_host[away_idx]
        
        # Add host advantage (+50 Elo = +5.0 power rating)
        home_power = home_power + (home_is_host * 5.0)
        away_power = away_power + (away_is_host * 5.0)
        
        # Calculate expected goals (lambda for Poisson)
        # Baseline home advantage + power difference
        lam_home = np.maximum(0.1, 1.2 + (home_power - away_power) * 0.03)
        lam_away = np.maximum(0.1, 1.0 + (away_power - home_power) * 0.03)
        
        # Simulate matches -> shape (N, M)
        home_goals = np.random.poisson(lam=lam_home, size=(N, M))
        away_goals = np.random.poisson(lam=lam_away, size=(N, M))
        
        # Outcomes
        home_wins = (home_goals > away_goals).astype(int)
        draws = (home_goals == away_goals).astype(int)
        away_wins = (home_goals < away_goals).astype(int)
        
        # Accumulators
        points = np.zeros((N, self.n_teams), dtype=int)
        gd = np.zeros((N, self.n_teams), dtype=int)
        gf = np.zeros((N, self.n_teams), dtype=int)
        wins = np.zeros((N, self.n_teams), dtype=int)
        draws_acc = np.zeros((N, self.n_teams), dtype=int)
        losses = np.zeros((N, self.n_teams), dtype=int)
        mv = np.tile(self.market_value, (N, 1))
        
        # Vectorized accumulation across all N iterations
        for i in range(M):
            h = home_idx[i]
            a = away_idx[i]
            
            points[:, h] += home_wins[:, i] * 3 + draws[:, i]
            points[:, a] += away_wins[:, i] * 3 + draws[:, i]
            
            wins[:, h] += home_wins[:, i]
            wins[:, a] += away_wins[:, i]
            
            draws_acc[:, h] += draws[:, i]
            draws_acc[:, a] += draws[:, i]
            
            losses[:, h] += away_wins[:, i]
            losses[:, a] += home_wins[:, i]
            
            gd[:, h] += (home_goals[:, i] - away_goals[:, i])
            gd[:, a] += (away_goals[:, i] - home_goals[:, i])
            
            gf[:, h] += home_goals[:, i]
            gf[:, a] += away_goals[:, i]
            
        # Tie-breaking & standings
        # Shape: (N, 12, 4)
        group_points = points.reshape(N, self.n_groups, self.teams_per_group)
        group_gd = gd.reshape(N, self.n_groups, self.teams_per_group)
        group_gf = gf.reshape(N, self.n_groups, self.teams_per_group)
        group_mv = mv.reshape(N, self.n_groups, self.teams_per_group)
        
        # lexsort sorts ascending, so we use negative values to sort descending
        # sort_keys shape: (4, N, 12, 4)
        sort_keys = (-group_mv, -group_gf, -group_gd, -group_points)
        ranks = np.lexsort(sort_keys, axis=2) # Shape: (N, 12, 4) containing indices 0-3
        
        # Calculate probabilities
        pos_keys = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"]
        base_counters = {pos_keys[i]: 0 for i in range(min(self.teams_per_group, len(pos_keys)))}
        base_counters["qualify"] = 0
        prob_counters = {tla: base_counters.copy() for tla in self.tlas}
        
        is_world_cup = (self.n_teams == 48 and self.n_groups == 12 and self.teams_per_group == 4)
        
        for n in range(N):
            thirds_global_idx = []
            
            for g in range(self.n_groups):
                for i in range(self.teams_per_group):
                    local_idx = ranks[n, g, i]
                    global_idx = g * self.teams_per_group + local_idx
                    tla = self.tlas[global_idx]
                    
                    if i < len(pos_keys):
                        prob_counters[tla][pos_keys[i]] += 1
                    
                    if i < 2:
                        prob_counters[tla]["qualify"] += 1
                    elif i == 2 and is_world_cup:
                        thirds_global_idx.append(global_idx)
                        
            if is_world_cup and len(thirds_global_idx) == 12:
                # Sort the 12 third-placed teams
                thirds_pts = points[n, thirds_global_idx]
                thirds_gd = gd[n, thirds_global_idx]
                thirds_gf = gf[n, thirds_global_idx]
                thirds_mv = mv[n, thirds_global_idx]
                
                t_sort_keys = (-thirds_mv, -thirds_gf, -thirds_gd, -thirds_pts)
                t_ranks = np.lexsort(t_sort_keys)
                
                for i in range(8):
                    best_third_global_idx = thirds_global_idx[t_ranks[i]]
                    prob_counters[self.tlas[best_third_global_idx]]["qualify"] += 1

        # Convert to percentages
        probabilities = {}
        for tla, counts in prob_counters.items():
            probabilities[tla] = {k: round((v / N) * 100, 2) for k, v in counts.items()}
            
        # Create 1 sample standing (from n=0)
        sample_standings = []
        import string
        groups_names = [f"Group {string.ascii_uppercase[i % 26]}" for i in range(self.n_groups)]
        
        for g in range(self.n_groups):
            group_name = groups_names[g]
            sorted_indices = ranks[0, g] # ranks already has the best team at index 0 because we used negative values in lexsort
                
            team_stats_list = []
            for rank_idx in sorted_indices:
                global_team_idx = g * self.teams_per_group + rank_idx
                team_info = self.teams_data[global_team_idx]
                
                # For goals against: GA = GF - GD
                t_gf = int(group_gf[0, g, rank_idx])
                t_gd = int(group_gd[0, g, rank_idx])
                t_ga = t_gf - t_gd
                
                team_stats = TeamStats(
                    id=team_info["id"],
                    tla=team_info["tla"],
                    name=team_info.get("name", team_info["tla"]),
                    crest=team_info.get("crest", ""),
                    power_rating=team_info.get("power_rating", 60),
                    points=int(group_points[0, g, rank_idx]),
                    goals_for=t_gf,
                    goals_against=t_ga,
                    goal_difference=t_gd,
                    matches_played=self.teams_per_group - 1,
                    won=int(wins[0, global_team_idx]),
                    draw=int(draws_acc[0, global_team_idx]),
                    lost=int(losses[0, global_team_idx])
                )
                team_stats_list.append(team_stats)
            sample_standings.append(GroupStandings(group_name=group_name, teams=team_stats_list))
            
        exec_time = (time.time() - start_time) * 1000
        
        return SimulationResponse(
            iterations=N,
            execution_time_ms=round(exec_time, 2),
            probabilities=probabilities,
            sample_standings=sample_standings
        )
