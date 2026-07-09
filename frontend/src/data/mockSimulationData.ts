import type { SimulationResponse, GroupStandings } from '../store/useAppStore';

export const mockPrompts = [
  "What are the chances of Argentina and Spain passing the group stage?",
  "What if Spain loses to Croatia in their first match?",
  "Who is the most likely to win Group B now?"
];

export const mockInitialStandings: GroupStandings[] = [
  {
    group_name: "Group C",
    teams: [
      { id: 1, tla: "ARG", name: "Argentina", crest: "https://crests.football-data.org/762.png", points: 0, matches_played: 0, won: 0, draw: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0 },
      { id: 2, tla: "MEX", name: "Mexico", crest: "https://crests.football-data.org/769.png", points: 0, matches_played: 0, won: 0, draw: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0 },
      { id: 4, tla: "POL", name: "Poland", crest: "https://crests.football-data.org/794.png", points: 0, matches_played: 0, won: 0, draw: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0 },
      { id: 3, tla: "KSA", name: "Saudi Arabia", crest: "https://crests.football-data.org/801.png", points: 0, matches_played: 0, won: 0, draw: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0 }
    ]
  },
  {
    group_name: "Group B",
    teams: [
      { id: 8, tla: "ALB", name: "Albania", crest: "https://crests.football-data.org/ALB.png", points: 0, matches_played: 0, won: 0, draw: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0 },
      { id: 6, tla: "CRO", name: "Croatia", crest: "https://crests.football-data.org/799.png", points: 0, matches_played: 0, won: 0, draw: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0 },
      { id: 7, tla: "ITA", name: "Italy", crest: "https://crests.football-data.org/784.png", points: 0, matches_played: 0, won: 0, draw: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0 },
      { id: 5, tla: "ESP", name: "Spain", crest: "https://crests.football-data.org/760.png", points: 0, matches_played: 0, won: 0, draw: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0 }
    ]
  }
];

export const mockSimulations: SimulationResponse[] = [
  {
    iterations: 10000,
    execution_time_ms: 145,
    ai_narrative: "Based on 10,000 Monte Carlo simulations, Argentina has a very strong chance (95%) of advancing from their group. Spain also holds a solid position, but they face a tougher group scenario. The probabilities strongly favor both teams making it to the knockout stage.",
    probabilities: {
      "ARG": { "1st": 75.5, "2nd": 19.5, "Knockout": 95.0 },
      "ESP": { "1st": 55.2, "2nd": 30.1, "Knockout": 85.3 },
      "CRO": { "1st": 30.5, "2nd": 45.2, "Knockout": 75.7 },
      "MEX": { "1st": 20.0, "2nd": 60.0, "Knockout": 80.0 },
      "KSA": { "1st": 4.5, "2nd": 20.5, "Knockout": 25.0 },
      "POL": { "1st": 0.0, "2nd": 0.0, "Knockout": 0.0 },
      "ITA": { "1st": 0.0, "2nd": 0.0, "Knockout": 0.0 },
      "ALB": { "1st": 0.0, "2nd": 0.0, "Knockout": 0.0 }
    },
    sample_standings: [
      {
        group_name: "Group C",
        teams: [
          { id: 1, tla: "ARG", name: "Argentina", crest: "https://crests.football-data.org/762.png", points: 9, matches_played: 3, won: 3, draw: 0, lost: 0, goals_for: 6, goals_against: 1, goal_difference: 5 },
          { id: 2, tla: "MEX", name: "Mexico", crest: "https://crests.football-data.org/769.png", points: 4, matches_played: 3, won: 1, draw: 1, lost: 1, goals_for: 3, goals_against: 3, goal_difference: 0 },
          { id: 3, tla: "KSA", name: "Saudi Arabia", crest: "https://crests.football-data.org/801.png", points: 3, matches_played: 3, won: 1, draw: 0, lost: 2, goals_for: 2, goals_against: 4, goal_difference: -2 },
          { id: 4, tla: "POL", name: "Poland", crest: "https://crests.football-data.org/794.png", points: 1, matches_played: 3, won: 0, draw: 1, lost: 2, goals_for: 1, goals_against: 4, goal_difference: -3 }
        ]
      },
      {
        group_name: "Group B",
        teams: [
          { id: 5, tla: "ESP", name: "Spain", crest: "https://crests.football-data.org/760.png", points: 7, matches_played: 3, won: 2, draw: 1, lost: 0, goals_for: 5, goals_against: 2, goal_difference: 3 },
          { id: 6, tla: "CRO", name: "Croatia", crest: "https://crests.football-data.org/799.png", points: 5, matches_played: 3, won: 1, draw: 2, lost: 0, goals_for: 4, goals_against: 3, goal_difference: 1 },
          { id: 7, tla: "ITA", name: "Italy", crest: "https://crests.football-data.org/784.png", points: 4, matches_played: 3, won: 1, draw: 1, lost: 1, goals_for: 3, goals_against: 3, goal_difference: 0 },
          { id: 8, tla: "ALB", name: "Albania", crest: "https://crests.football-data.org/ALB.png", points: 0, matches_played: 3, won: 0, draw: 0, lost: 3, goals_for: 1, goals_against: 5, goal_difference: -4 }
        ]
      }
    ]
  },
  {
    iterations: 10000,
    execution_time_ms: 120,
    ai_narrative: "If Spain loses their opening match to Croatia, their probability of topping Group B drops significantly to 15.2%. Croatia would take the driver's seat. Spain's chance of qualifying for the knockouts would fall from 85.3% to around 62%, putting immense pressure on their fixture against Italy.",
    probabilities: {
      "CRO": { "1st": 65.5, "2nd": 25.2, "Knockout": 90.7 },
      "ITA": { "1st": 19.3, "2nd": 40.1, "Knockout": 59.4 },
      "ESP": { "1st": 15.2, "2nd": 46.8, "Knockout": 62.0 },
      "ALB": { "1st": 0.0, "2nd": 5.0, "Knockout": 5.0 }
    },
    sample_standings: [
      {
        group_name: "Group B",
        teams: [
          { id: 6, tla: "CRO", name: "Croatia", crest: "https://crests.football-data.org/799.png", points: 9, matches_played: 3, won: 3, draw: 0, lost: 0, goals_for: 6, goals_against: 2, goal_difference: 4 },
          { id: 7, tla: "ITA", name: "Italy", crest: "https://crests.football-data.org/784.png", points: 4, matches_played: 3, won: 1, draw: 1, lost: 1, goals_for: 3, goals_against: 3, goal_difference: 0 },
          { id: 5, tla: "ESP", name: "Spain", crest: "https://crests.football-data.org/760.png", points: 4, matches_played: 3, won: 1, draw: 1, lost: 1, goals_for: 4, goals_against: 4, goal_difference: 0 },
          { id: 8, tla: "ALB", name: "Albania", crest: "https://crests.football-data.org/ALB.png", points: 0, matches_played: 3, won: 0, draw: 0, lost: 3, goals_for: 1, goals_against: 5, goal_difference: -4 }
        ]
      }
    ]
  },
  {
    iterations: 10000,
    execution_time_ms: 110,
    ai_narrative: "With the new weights applied, Croatia is overwhelmingly the favorite to win Group B. Their disciplined defense and the updated constraints result in a 65.5% probability of a 1st place finish.",
    probabilities: {
      "CRO": { "1st": 80.5, "2nd": 15.2, "Knockout": 95.7 },
      "ITA": { "1st": 12.3, "2nd": 50.1, "Knockout": 62.4 },
      "ESP": { "1st": 7.2, "2nd": 34.7, "Knockout": 41.9 },
      "ALB": { "1st": 0.0, "2nd": 0.0, "Knockout": 0.0 }
    },
    sample_standings: [
      {
        group_name: "Group B",
        teams: [
          { id: 6, tla: "CRO", name: "Croatia", crest: "https://crests.football-data.org/799.png", points: 7, matches_played: 3, won: 2, draw: 1, lost: 0, goals_for: 5, goals_against: 1, goal_difference: 4 },
          { id: 5, tla: "ESP", name: "Spain", crest: "https://crests.football-data.org/760.png", points: 5, matches_played: 3, won: 1, draw: 2, lost: 0, goals_for: 3, goals_against: 2, goal_difference: 1 },
          { id: 7, tla: "ITA", name: "Italy", crest: "https://crests.football-data.org/784.png", points: 4, matches_played: 3, won: 1, draw: 1, lost: 1, goals_for: 2, goals_against: 2, goal_difference: 0 },
          { id: 8, tla: "ALB", name: "Albania", crest: "https://crests.football-data.org/ALB.png", points: 0, matches_played: 3, won: 0, draw: 0, lost: 3, goals_for: 0, goals_against: 5, goal_difference: -5 }
        ]
      }
    ]
  }
];
