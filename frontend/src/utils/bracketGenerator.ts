import type { GroupStandings, TeamStats } from '../store/useAppStore';

export interface MatchNode {
  id: string;
  round: string; // 'R32', 'R16', 'QF', 'SF', 'FINAL', '3RD'
  home?: TeamStats;
  away?: TeamStats;
  homeScore?: number;
  awayScore?: number;
  winnerId?: number;
  nextMatchId?: string;
  loserNextMatchId?: string;
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

// Note: W_R_MAPPING and R_R_MAPPING were removed because matches are now mapped to explicit slots.

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

  // 3. Greedy Assignment (Bipartite matching) for Winners vs Best 3rd
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

  // After solving, map the exactly matched teams into their fixed horizontal bracket slots
  const r32Slots: Array<{ home: TeamStats | undefined, away: TeamStats | undefined }> = new Array(16).fill({ home: undefined, away: undefined });

  // Left Bracket (Matches 1-8)
  r32Slots[0] = { home: winners.get('E'), away: assignments.get('E') }; // Match 1
  r32Slots[1] = { home: winners.get('I'), away: assignments.get('I') }; // Match 2
  r32Slots[2] = { home: runnersUp.get('A'), away: runnersUp.get('B') }; // Match 3
  r32Slots[3] = { home: winners.get('F'), away: runnersUp.get('C') }; // Match 4
  r32Slots[4] = { home: runnersUp.get('K'), away: runnersUp.get('L') }; // Match 5
  r32Slots[5] = { home: winners.get('H'), away: runnersUp.get('J') }; // Match 6
  r32Slots[6] = { home: winners.get('D'), away: assignments.get('D') }; // Match 7
  r32Slots[7] = { home: winners.get('G'), away: assignments.get('G') }; // Match 8

  // Right Bracket (Matches 9-16)
  r32Slots[8] = { home: winners.get('C'), away: runnersUp.get('F') }; // Match 9
  r32Slots[9] = { home: runnersUp.get('E'), away: runnersUp.get('I') }; // Match 10
  r32Slots[10] = { home: winners.get('A'), away: assignments.get('A') }; // Match 11
  r32Slots[11] = { home: winners.get('L'), away: assignments.get('L') }; // Match 12
  r32Slots[12] = { home: winners.get('J'), away: runnersUp.get('H') }; // Match 13
  r32Slots[13] = { home: runnersUp.get('D'), away: runnersUp.get('G') }; // Match 14
  r32Slots[14] = { home: winners.get('B'), away: assignments.get('B') }; // Match 15
  r32Slots[15] = { home: winners.get('K'), away: assignments.get('K') }; // Match 16

  r32Slots.forEach((slot, idx) => {
    matches.push({
      id: `R32-${idx + 1}`,
      round: 'R32',
      home: slot.home,
      away: slot.away,
      position: idx + 1
    });
  });

  // Pre-generate empty slots for R16, QF, SF, FINAL, 3RD
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
  generateEmptyRounds('3RD', 1, 1);

  // Link matches
  const linkRounds = (prevRound: string, currRound: string, prevCount: number) => {
    for (let i = 1; i <= prevCount; i++) {
      const pMatch = matches.find(m => m.id === `${prevRound}-${i}`);
      const currMatchId = `${currRound}-${Math.ceil(i / 2)}`;
      if (pMatch) pMatch.nextMatchId = currMatchId;
      
      // Special case for Semi-Finals going to 3rd Place match
      if (prevRound === 'SF') {
        if (pMatch) pMatch.loserNextMatchId = `3RD-1`;
      }
    }
  };

  linkRounds('R32', 'R16', 16);
  linkRounds('R16', 'QF', 8);
  linkRounds('QF', 'SF', 4);
  linkRounds('SF', 'FINAL', 2);

  return matches;
};
