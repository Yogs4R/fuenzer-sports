import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { generateBracket } from '../../utils/bracketGenerator';
import { calculateWinProbability, getHostAdvantage } from '../../utils/probability';
import { motion, AnimatePresence } from 'framer-motion';
import { en } from '../../locales/en';
import { id } from '../../locales/id';

const ROUNDS = ['R32', 'R16', 'QF', 'SF', 'FINAL'];
const SIMULATION_ROUNDS = ['R32', 'R16', 'QF', 'SF', '3RD', 'FINAL'];
const ROUND_NAMES: Record<string, string> = {
  'R32': 'Round of 32',
  'R16': 'Round of 16',
  'QF': 'Quarter-Finals',
  'SF': 'Semi-Finals',
  'FINAL': 'Final'
};

const BracketView: React.FC = () => {
  const { 
    simulationData, 
    liveStandings, 
    selectedMode, 
    isSimulatingKnockout, 
    setIsSimulatingKnockout,
    bracketMatches: matches,
    setBracketMatches: setMatches,
    language
  } = useAppStore();

  const t = language === 'id' ? id : en;
  const p = t.components.playground.bracket;

  const [showMetrics, setShowMetrics] = React.useState(false);
  const [selectedMetricsRound, setSelectedMetricsRound] = React.useState<string | null>(null);

  useEffect(() => {
    const dataToUse = selectedMode === 'Live Standings' ? liveStandings : simulationData?.sample_standings;
    if (dataToUse && dataToUse.length > 0) {
      if (matches.length === 0 || matches[0]?.homeScore === undefined) {
          setMatches(generateBracket(dataToUse));
      }
    }
  }, [simulationData, liveStandings, selectedMode]);

  const simulateMatch = (homePower: number, awayPower: number, homeTla: string, awayTla: string) => {
    const finalHome = homePower + getHostAdvantage(homeTla);
    const finalAway = awayPower + getHostAdvantage(awayTla);

    const lamHome = Math.max(0.1, 1.2 + (finalHome - finalAway) * 0.05);
    const lamAway = Math.max(0.1, 1.0 + (finalAway - finalHome) * 0.05);
    
    const samplePoisson = (lambda: number) => {
      let L = Math.exp(-lambda), k = 0, p = 1;
      do { k++; p *= Math.random(); } while (p > L);
      return k - 1;
    };

    let homeGoals = samplePoisson(lamHome);
    let awayGoals = samplePoisson(lamAway);

    if (homeGoals === awayGoals) {
      if (Math.random() > 0.5) homeGoals++; else awayGoals++;
    }

    return { homeGoals, awayGoals };
  };

  const handleSimulateKnockout = async () => {
    if (isSimulatingKnockout || matches.length === 0) return;
    setIsSimulatingKnockout(true);

    const dataToUse = selectedMode === 'Live Standings' ? liveStandings : simulationData?.sample_standings;
    
    let currentMatches = [...matches];
    // Re-simulate logic: wipe and reset if already played
    if (currentMatches[0]?.homeScore !== undefined) {
       currentMatches = generateBracket(dataToUse || []);
       setMatches(currentMatches);
       await new Promise(r => setTimeout(r, 100)); 
    }

    for (const round of SIMULATION_ROUNDS) {
      const roundMatches = currentMatches.filter(m => m.round === round);
      let updated = false;

      for (const match of roundMatches) {
        if (match.home && match.away && match.homeScore === undefined) {
          // Play Match
          const homePower = match.home.power_rating || 60;
          const awayPower = match.away.power_rating || 60;
          
          const { homeGoals, awayGoals } = simulateMatch(homePower, awayPower, match.home.tla, match.away.tla);
          
          match.homeScore = homeGoals;
          match.awayScore = awayGoals;
          match.winnerId = homeGoals > awayGoals ? match.home.id : match.away.id;
          updated = true;

          // Advance winner
          if (match.nextMatchId) {
            const nextMatch = currentMatches.find(m => m.id === match.nextMatchId);
            if (nextMatch) {
              const isHome = parseInt(match.id.split('-')[1]) % 2 !== 0;
              if (isHome) {
                nextMatch.home = homeGoals > awayGoals ? match.home : match.away;
              } else {
                nextMatch.away = homeGoals > awayGoals ? match.home : match.away;
              }
            }
          }
          
          // Advance loser (for 3rd place match)
          if (match.loserNextMatchId) {
            const nextMatch = currentMatches.find(m => m.id === match.loserNextMatchId);
            if (nextMatch) {
              const isHome = parseInt(match.id.split('-')[1]) % 2 !== 0;
              if (isHome) {
                nextMatch.home = homeGoals < awayGoals ? match.home : match.away;
              } else {
                nextMatch.away = homeGoals < awayGoals ? match.home : match.away;
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
    
    // Trigger confetti if final match is played
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4cd7f6', '#ffffff', '#eab308']
      });
    }).catch(err => console.log('Confetti not loaded', err));

    setIsSimulatingKnockout(false);
  };

  useEffect(() => {
    const handleTriggerSim = () => handleSimulateKnockout();
    window.addEventListener('simulate-knockout', handleTriggerSim);
    return () => window.removeEventListener('simulate-knockout', handleTriggerSim);
  });

  const furthestRound = [...SIMULATION_ROUNDS].reverse().find(round => {
    return matches.some(m => m.round === round && m.home && m.away);
  });

  useEffect(() => {
    if (furthestRound) {
      setSelectedMetricsRound(furthestRound);
    }
  }, [furthestRound]);

  const dataToUse = selectedMode === 'Live Standings' ? liveStandings : simulationData?.sample_standings;
  
  if (!dataToUse || matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 min-h-[400px]">
        <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        <p className="text-lg">{p.noData}</p>
        <p className="text-sm mt-2">{p.runSimulation}</p>
      </div>
    );
  }

  const metricsRoundMatches = selectedMetricsRound ? matches.filter(m => m.round === selectedMetricsRound && m.home && m.away) : [];
  const availableRounds = SIMULATION_ROUNDS.filter(round => matches.some(m => m.round === round && m.home && m.away));

  const getProbColor = (prob: number) => {
    if (prob >= 60) return 'bg-green-500';
    if (prob >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  const getProbTextColor = (prob: number) => {
    if (prob >= 60) return 'text-green-500';
    if (prob >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#050814] overflow-hidden">
      {/* Top Action Bar */}
      {availableRounds.length > 0 && (
        <div className="flex justify-end p-2 border-b border-white/5 shrink-0 bg-[#050814] z-40 relative">
          <button 
            onClick={() => setShowMetrics(!showMetrics)}
            className="bg-[#0a1024] hover:bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/50 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(76,215,246,0.2)] flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            {showMetrics ? p.hideMetrics : p.showMetrics}
          </button>
        </div>
      )}

      {/* Floating Metrics Box */}
      <AnimatePresence>
        {showMetrics && availableRounds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-12 left-2 right-2 md:left-auto md:right-4 md:w-80 max-h-[calc(100%-4rem)] z-50 bg-[#0a1024]/95 backdrop-blur-xl border border-primary-cyan/30 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-primary-cyan/10 border-b border-primary-cyan/20 p-3 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h3 className="text-white text-xs font-bold uppercase tracking-widest">{p.winProb}</h3>
              </div>
              <div className="flex gap-1 overflow-x-auto scrollbar-custom pb-1">
                {availableRounds.map(round => (
                  <button
                    key={round}
                    onClick={() => setSelectedMetricsRound(round)}
                    className={`px-2 py-1 text-[10px] rounded whitespace-nowrap font-bold transition-colors ${selectedMetricsRound === round ? 'bg-primary-cyan text-[#0a1024]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {round}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-y-auto scrollbar-custom p-3 flex flex-col gap-3">
              {metricsRoundMatches.map(m => {
                const probs = calculateWinProbability(m.home!.power_rating || 60, m.away!.power_rating || 60, m.home!.tla, m.away!.tla);
                const homeProbNum = parseFloat(probs.homeWinProb);
                const awayProbNum = parseFloat(probs.awayWinProb);
                
                return (
                  <div key={`metric-${m.id}`} className="bg-white/5 rounded p-2 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        {m.home!.crest && <img src={m.home!.crest} alt="" className="w-4 h-4 object-contain" />}
                        <span className="text-gray-300 font-semibold">{m.home!.tla}</span>
                      </div>
                      <span className={`${getProbTextColor(homeProbNum)} font-mono font-bold`}>{probs.homeWinProb}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                      <div className={`${getProbColor(homeProbNum)} h-full transition-all duration-500`} style={{ width: `${probs.homeWinProb}%` }} />
                    </div>
                    
                    <div className="flex justify-between items-center mb-1 mt-2">
                      <div className="flex items-center gap-2">
                        {m.away!.crest && <img src={m.away!.crest} alt="" className="w-4 h-4 object-contain" />}
                        <span className="text-gray-300 font-semibold">{m.away!.tla}</span>
                      </div>
                      <span className={`${getProbTextColor(awayProbNum)} font-mono font-bold`}>{probs.awayWinProb}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className={`${getProbColor(awayProbNum)} h-full transition-all duration-500`} style={{ width: `${probs.awayWinProb}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bracket Container (Scrollable) */}
      <div className="flex-1 overflow-auto p-4 md:p-8 scrollbar-custom">
        <div className="flex gap-12 md:gap-16 min-w-max pb-16 pt-4">
          {ROUNDS.map((round, rIndex) => {
            const roundMatches = matches.filter(m => m.round === round);
            // If it's the FINAL round, also include the 3RD place match
            if (round === 'FINAL') {
              const thirdPlaceMatch = matches.find(m => m.round === '3RD');
              if (thirdPlaceMatch) roundMatches.push(thirdPlaceMatch);
            }

            const matchSpacing = rIndex === 0 ? 'mt-0' : (rIndex === 1 ? 'mt-[46px]' : (rIndex === 2 ? 'mt-[138px]' : (rIndex === 3 ? 'mt-[322px]' : 'mt-[714px]')));
            const matchGap = rIndex === 0 ? 'gap-4' : (rIndex === 1 ? 'gap-[108px]' : (rIndex === 2 ? 'gap-[292px]' : (rIndex === 3 ? 'gap-[660px]' : 'gap-[80px]')));

            return (
              <div key={round} className="flex flex-col relative" style={{ minWidth: '220px' }}>
                {/* Round Header */}
                <div className="text-center font-bold text-sm text-primary-cyan mb-4 uppercase tracking-widest sticky top-0 z-20 bg-[#050814] py-2 border-b border-primary-cyan/20 w-full shadow-[0_4px_6px_-1px_rgba(5,8,20,1)]">
                  {ROUND_NAMES[round]}
                </div>
                
                {round === 'FINAL' && (
                  <div className="absolute top-[620px] left-1/2 -translate-x-1/2 flex justify-center z-0">
                    <div className="text-yellow-400 text-6xl drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] opacity-80">🏆</div>
                  </div>
                )}
                
                {/* Matches Container */}
                <div className={`flex flex-col ${matchGap} ${matchSpacing} relative`}>
                  {roundMatches.map((match, mIndex) => {
                    const isSecondHalfStart = roundMatches.length > 1 && mIndex === roundMatches.length / 2 && round !== 'FINAL';
                    return (
                    <div key={match.id} className={`relative flex flex-col items-center ${isSecondHalfStart ? 'mt-[48px]' : ''}`}>
                      {match.round === '3RD' && (
                        <div className="text-yellow-500 font-bold text-xs uppercase mb-2 tracking-widest bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">{p.thirdPlace}</div>
                      )}
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`flex flex-col bg-white/5 border rounded-lg overflow-hidden shadow-lg w-full z-10 ${match.round === 'FINAL' ? 'border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'border-white/10'}`}
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
                      
                      {/* Connection Lines to Next Round */}
                      {match.nextMatchId && rIndex < ROUNDS.length - 1 && (
                        <div className="absolute left-full top-1/2 w-6 md:w-8 border-t-2 border-white/20 z-0"></div>
                      )}
                      
                      {/* Vertical Connection Line for Home/Away Pairs */}
                      {match.nextMatchId && rIndex < ROUNDS.length - 1 && mIndex % 2 === 0 && (
                        <div className={`absolute left-[calc(100%+24px)] md:left-[calc(100%+32px)] top-1/2 w-0.5 border-l-2 border-white/20 z-0
                          ${rIndex === 0 ? 'h-[92px]' : (rIndex === 1 ? 'h-[184px]' : (rIndex === 2 ? 'h-[368px]' : 'h-[784px]'))}
                        `}></div>
                      )}
                      {/* Horizontal line entering next match */}
                      {match.nextMatchId && rIndex < ROUNDS.length - 1 && mIndex % 2 === 0 && (
                        <div className={`absolute left-[calc(100%+24px)] md:left-[calc(100%+32px)] top-[calc(50%+46px)] 
                          ${rIndex === 1 ? 'top-[calc(50%+92px)]' : (rIndex === 2 ? 'top-[calc(50%+184px)]' : (rIndex === 3 ? 'top-[calc(50%+392px)]' : ''))}
                          w-6 md:w-8 border-t-2 border-white/20 z-0`}></div>
                      )}
                    </div>
                  );
                })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Disclaimer - Hidden on mobile to save space */}
      <div className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-40 w-auto max-w-md">
        <div className="bg-[#080d1e] px-4 py-1.5 rounded-full border border-white/20 shadow-xl text-[10px] text-gray-400 text-center whitespace-normal leading-tight">
          <p>{p.disclaimer}</p>
          <p className="mt-1 text-primary-cyan">{p.hypothetical}</p>
        </div>
      </div>
    </div>
  );
};

export default BracketView;
