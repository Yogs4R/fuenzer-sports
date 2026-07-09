import type { GroupStandings, TeamStats } from '../store/useAppStore';

export interface MatchNode {
  id: string;
  round: string; // 'R32', 'R16', 'QF', 'SF', 'FINAL'
  home?: TeamStats;
  away?: TeamStats;
  homeScore?: number;
  awayScore?: number;
  winnerId?: number;
  nextMatchId?: string;
  position: number; // Vertical ordering
}

// 8 Matches: Group Winners vs Best 3rd-Place Teams
const W_3RD_MAPPING: Record<string, string[]> = {
  'A': ['C', 'E', 'F', 'H'],
  'B': ['A', 'C', 'E', 'F'],
  'D': ['B', 'F', 'G', 'I'],
  'E': ['A', 'B', 'C', 'D'],
  'G': ['I', 'J', 'K', 'L'],
  'I': ['G', 'H', 'J', 'K'],
  'K': ['D', 'G', 'H', 'I'],
  'L': ['D', 'E', 'I', 'J'],
};

// 4 Matches: Group Winners vs Runners-up
const W_R_MAPPING: Array<[string, string]> = [
  ['C', 'F'],
  ['F', 'C'],
  ['H', 'J'],
  ['J', 'H'],
];

// 4 Matches: Runners-up vs Runners-up
const R_R_MAPPING: Array<[string, string]> = [
  ['A', 'B'],
  ['D', 'E'],
  ['G', 'H'],
  ['K', 'L'],
];

export const generateBracket = (standings: GroupStandings[]): MatchNode[] => {
  if (!standings || standings.length === 0) return [];

  // 1. Extract teams by position
  const winners = new Map<string, TeamStats>();
  const runnersUp = new Map<string, TeamStats>();
  const thirdPlaces: Array<{group: string, team: TeamStats}> = [];

  standings.forEach(group => {
    const groupLetter = group.group_name.replace('Group ', '');
    // Ensure teams are sorted by points/gd/gf (assume backend sorted them)
    if (group.teams.length > 0) winners.set(groupLetter, group.teams[0]);
    if (group.teams.length > 1) runnersUp.set(groupLetter, group.teams[1]);
    if (group.teams.length > 2) thirdPlaces.push({ group: groupLetter, team: group.teams[2] });
  });

  // 2. Find best 8 3rd places
  thirdPlaces.sort((a, b) => {
    if (b.team.points !== a.team.points) return b.team.points - a.team.points;
    if (b.team.goal_difference !== a.team.goal_difference) return b.team.goal_difference - a.team.goal_difference;
    return b.team.goals_for - a.team.goals_for;
  });
  const best8Third = thirdPlaces.slice(0, 8);

  const matches: MatchNode[] = [];
  let matchCounter = 1;

  // Function to create a match
  const addMatch = (home: TeamStats | undefined, away: TeamStats | undefined) => {
    matches.push({
      id: `R32-${matchCounter}`,
      round: 'R32',
      home,
      away,
      position: matchCounter
    });
    matchCounter++;
  };

  // 3. Assign 4 Matches: Winners vs Runners-up
  W_R_MAPPING.forEach(([wGrp, rGrp]) => {
    addMatch(winners.get(wGrp), runnersUp.get(rGrp));
  });

  // 4. Assign 4 Matches: Runners-up vs Runners-up
  R_R_MAPPING.forEach(([r1Grp, r2Grp]) => {
    addMatch(runnersUp.get(r1Grp), runnersUp.get(r2Grp));
  });

  // 5. Greedy Assignment (Bipartite matching) for Winners vs Best 3rd
  const wGroupLetters = Object.keys(W_3RD_MAPPING); // A, B, D, E, G, I, K, L
  const assignments = new Map<string, TeamStats>();

  // Backtracking function
  const solve = (index: number, availableThirds: Array<{group: string, team: TeamStats}>): boolean => {
    if (index === wGroupLetters.length) return true; // All assigned
    const wGrp = wGroupLetters[index];
    const allowed = W_3RD_MAPPING[wGrp];

    for (let i = 0; i < availableThirds.length; i++) {
      const third = availableThirds[i];
      if (allowed.includes(third.group)) {
        // Try assign
        assignments.set(wGrp, third.team);
        const nextAvailable = [...availableThirds.slice(0, i), ...availableThirds.slice(i + 1)];
        if (solve(index + 1, nextAvailable)) {
          return true;
        }
        assignments.delete(wGrp);
      }
    }
    return false;
  };

  // Attempt to solve, if it fails (due to strict rules and weird combinations), just fallback to any available to prevent crash
  if (!solve(0, best8Third)) {
     console.warn("Could not find perfect Annex C matching for 3rd places. Falling back to simple matching.");
     const remaining = [...best8Third];
     wGroupLetters.forEach(wGrp => {
         const t = remaining.shift();
         if(t) assignments.set(wGrp, t.team);
     });
  }

  // Add the 8 Winners vs 3rd matches
  wGroupLetters.forEach(wGrp => {
    addMatch(winners.get(wGrp), assignments.get(wGrp));
  });

  // Pre-generate empty slots for R16, QF, SF, FINAL
  const generateEmptyRounds = (roundName: string, count: number, startPos: number) => {
    for (let i = 0; i < count; i++) {
      matches.push({
        id: `${roundName}-${i + 1}`,
        round: roundName,
        position: startPos + i
      });
    }
  };

  generateEmptyRounds('R16', 8, 1);
  generateEmptyRounds('QF', 4, 1);
  generateEmptyRounds('SF', 2, 1);
  generateEmptyRounds('FINAL', 1, 1);

  // Link matches
  const linkRounds = (prevRound: string, currRound: string, prevCount: number) => {
    for (let i = 1; i <= prevCount; i++) {
      const pMatch = matches.find(m => m.id === `${prevRound}-${i}`);
      const currMatchId = `${currRound}-${Math.ceil(i / 2)}`;
      if (pMatch) pMatch.nextMatchId = currMatchId;
    }
  };

  linkRounds('R32', 'R16', 16);
  linkRounds('R16', 'QF', 8);
  linkRounds('QF', 'SF', 4);
  linkRounds('SF', 'FINAL', 2);

  return matches;
};
