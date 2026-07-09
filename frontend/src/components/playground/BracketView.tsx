import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { generateBracket, type MatchNode } from '../../utils/bracketGenerator';
import { motion } from 'framer-motion';

const ROUNDS = ['R32', 'R16', 'QF', 'SF', 'FINAL'];
const ROUND_NAMES: Record<string, string> = {
  'R32': 'Round of 32',
  'R16': 'Round of 16',
  'QF': 'Quarter-Finals',
  'SF': 'Semi-Finals',
  'FINAL': 'Final'
};

const BracketView: React.FC = () => {
  const { simulationData } = useAppStore();
  const [matches, setMatches] = useState<MatchNode[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (simulationData?.sample_standings && simulationData.sample_standings.length > 0) {
      // Only generate if matches are empty or we want to reset
      if (matches.length === 0 || matches[0]?.homeScore === undefined) {
          setMatches(generateBracket(simulationData.sample_standings));
      }
    }
  }, [simulationData]);

  const simulateMatch = (homePower: number, awayPower: number) => {
    const lamHome = Math.max(0.1, 1.2 + (homePower - awayPower) * 0.03);
    const lamAway = Math.max(0.1, 1.0 + (awayPower - homePower) * 0.03);
    
    // Simple poisson sampling
    const samplePoisson = (lambda: number) => {
      let L = Math.exp(-lambda), k = 0, p = 1;
      do { k++; p *= Math.random(); } while (p > L);
      return k - 1;
    };

    let homeGoals = samplePoisson(lamHome);
    let awayGoals = samplePoisson(lamAway);

    // If draw in knockout, flip coin for penalties (simplified)
    if (homeGoals === awayGoals) {
      if (Math.random() > 0.5) homeGoals++; else awayGoals++;
    }

    return { homeGoals, awayGoals };
  };

  const handleSimulateKnockout = async () => {
    if (isSimulating || matches.length === 0) return;
    setIsSimulating(true);

    let currentMatches = [...matches];

    for (const round of ROUNDS) {
      const roundMatches = currentMatches.filter(m => m.round === round);
      let updated = false;

      for (const match of roundMatches) {
        if (match.home && match.away && match.homeScore === undefined) {
          // Play Match
          const homePower = match.home.power_rating || 60;
          const awayPower = match.away.power_rating || 60;
          
          const { homeGoals, awayGoals } = simulateMatch(homePower, awayPower);
          
          match.homeScore = homeGoals;
          match.awayScore = awayGoals;
          match.winnerId = homeGoals > awayGoals ? match.home.id : match.away.id;
          updated = true;

          // Advance winner
          if (match.nextMatchId) {
            const nextMatch = currentMatches.find(m => m.id === match.nextMatchId);
            if (nextMatch) {
              // R32-1 goes to home of R16-1, R32-2 goes to away of R16-1
              const isHome = parseInt(match.id.split('-')[1]) % 2 !== 0;
              if (isHome) {
                nextMatch.home = homeGoals > awayGoals ? match.home : match.away;
              } else {
                nextMatch.away = homeGoals > awayGoals ? match.home : match.away;
              }
            }
          }
        }
      }

      if (updated) {
        setMatches([...currentMatches]);
        await new Promise(r => setTimeout(r, 800)); // Delay for animation
      }
    }
    
    setIsSimulating(false);
  };

  if (!simulationData || matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 min-h-[400px]">
        <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        <p className="text-lg">No bracket data available.</p>
        <p className="text-sm mt-2">Run a "From Scratch" group stage simulation first.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-[#050814]">
      {/* Header & Controls */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 sticky top-0 z-20">
        <div>
          <h2 className="text-white font-bold text-lg">Knockout Stage</h2>
          <p className="text-xs text-gray-400">Round of 32 to Final</p>
        </div>
        <button 
          onClick={handleSimulateKnockout}
          disabled={isSimulating}
          className="bg-primary-cyan text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-cyan-400 disabled:opacity-50 transition-colors"
        >
          {isSimulating ? 'Simulating...' : 'Play Knockout Simulation'}
        </button>
      </div>

      {/* Bracket Container (Scrollable) */}
      <div className="flex-1 overflow-auto p-8">
        <div className="flex gap-16 min-w-max pb-16">
          {ROUNDS.map((round) => {
            const roundMatches = matches.filter(m => m.round === round);
            
            return (
              <div key={round} className="flex flex-col gap-4 relative justify-around" style={{ minWidth: '220px' }}>
                {/* Round Header */}
                <div className="text-center font-bold text-sm text-primary-cyan mb-4 uppercase tracking-widest sticky top-0 z-10 bg-[#050814] py-2">
                  {ROUND_NAMES[round]}
                </div>
                
                {/* Matches */}
                {roundMatches.map((match) => (
                  <motion.div 
                    key={match.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col bg-white/5 border border-white/10 rounded-lg overflow-hidden shadow-lg"
                  >
                    {/* Home Team */}
                    <div className={`flex items-center justify-between p-2 text-sm border-b border-white/5 ${match.winnerId === match.home?.id ? 'bg-primary-cyan/10 font-bold text-white' : 'text-gray-300'}`}>
                      <div className="flex items-center gap-2">
                        {match.home?.crest ? (
                          <img src={match.home.crest} alt="" className="w-5 h-5 object-contain" />
                        ) : (
                          <div className="w-5 h-5 bg-white/10 rounded-full" />
                        )}
                        <span className="truncate max-w-[120px]">{match.home?.name || 'TBD'}</span>
                      </div>
                      <span className="font-mono text-white">{match.homeScore ?? '-'}</span>
                    </div>
                    {/* Away Team */}
                    <div className={`flex items-center justify-between p-2 text-sm ${match.winnerId === match.away?.id ? 'bg-primary-cyan/10 font-bold text-white' : 'text-gray-300'}`}>
                      <div className="flex items-center gap-2">
                        {match.away?.crest ? (
                          <img src={match.away.crest} alt="" className="w-5 h-5 object-contain" />
                        ) : (
                          <div className="w-5 h-5 bg-white/10 rounded-full" />
                        )}
                        <span className="truncate max-w-[120px]">{match.away?.name || 'TBD'}</span>
                      </div>
                      <span className="font-mono text-white">{match.awayScore ?? '-'}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BracketView;
