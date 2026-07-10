import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { id } from '../locales/id';
import { en } from '../locales/en';
import { Loader2 } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const StandingsPage = () => {
  useSEO({ title: 'Fuenzer Sports | Live Standings' });
  const { 
    language, 
    liveStandings, 
    isLiveLoading, 
    fetchLiveStandings 
  } = useAppStore();
  const t = language === 'id' ? id : en;
  const [activeTab, setActiveTab] = useState('World Cup');

  useEffect(() => {
    if (!liveStandings && !isLiveLoading) {
      fetchLiveStandings();
    }
  }, [liveStandings, isLiveLoading, fetchLiveStandings]);

  const groups = liveStandings || [];
  const showLoading = isLiveLoading && !liveStandings;

  const bestThirdPlaceTeams = useMemo(() => {
    if (!groups.length) return [];
    
    // Extract the 3rd place team from each group
    const thirdPlaces = groups.map(g => {
      const team = g.teams[2]; // index 2 is 3rd place
      return {
        ...team,
        group: g.group_name
      };
    });

    // Sort by points, then goal difference, then goals for
    thirdPlaces.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
      return b.goals_for - a.goals_for;
    });

    return thirdPlaces;
  }, [groups]);

  const tabs = [
    { name: 'World Cup', soon: false },
    { name: 'AFC', soon: true },
    { name: 'AFCON', soon: true },
    { name: 'UEFA', soon: true },
  ];

  const getIndicatorColor = (idx: number) => {
    if (idx === 0 || idx === 1) return 'bg-emerald-500'; // Green (Direct Qualifiers)
    if (idx === 2) return 'bg-amber-500'; // Yellow (Contender for 3rd place)
    return 'bg-rose-500'; // Red (Eliminated)
  };

  const getThirdPlaceIndicatorColor = (idx: number) => {
    if (idx < 8) return 'bg-emerald-500'; // Green (Top 8 Qualified)
    return 'bg-rose-500'; // Red (Bottom 4 Eliminated)
  };

  return (
    <div className="min-h-screen relative w-full pt-32 pb-20 flex flex-col items-center px-4">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-cyan/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-7xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            {t.navbar.standings}
          </h1>
          <p className="text-gray-400 text-sm">
            {t.pages.standings.subtitle}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-start md:justify-center gap-2 mb-12 border-b border-white/5 pb-4 overflow-x-auto w-full scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              disabled={tab.soon}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.name
                  ? 'bg-primary-cyan text-bg-0 shadow-[0_0_15px_rgba(76,215,246,0.3)]'
                  : tab.soon
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.name}</span>
              {tab.soon && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-gray-500">
                  {t.pages.standings.soon}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {showLoading && groups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary-cyan mb-4" size={40} />
            <p className="text-gray-400">Loading live standings data...</p>
          </div>
        )}

        {/* Tab Content */}
        {!showLoading && activeTab === 'World Cup' && groups.length > 0 && (
          <div className="space-y-16">
            
            {/* Groups Grid (12 Groups) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {groups.map((group, index) => (
                <div key={index} className="bg-bg-1 border border-white/5 rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">
                    {group.group_name}
                  </h3>
                  
                  <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="text-gray-500 border-b border-white/5 uppercase tracking-wider font-bold">
                          <th className="pb-3 w-8">Pos</th>
                          <th className="pb-3 min-w-[120px]">Team</th>
                          <th className="pb-3 text-center w-8">Pld</th>
                          <th className="pb-3 text-center w-8">W</th>
                          <th className="pb-3 text-center w-8">D</th>
                          <th className="pb-3 text-center w-8">L</th>
                          <th className="pb-3 text-center w-8">GF</th>
                          <th className="pb-3 text-center w-8">GA</th>
                          <th className="pb-3 text-center w-8">GD</th>
                          <th className="pb-3 text-center w-10 font-mono text-primary-cyan">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.teams.map((team, tIdx) => (
                          <tr key={tIdx} className="border-b border-white/5 last:border-0 text-gray-300 hover:bg-white/5 transition-colors">
                            <td className="py-3 font-bold flex items-center gap-1.5">
                              <span className={`w-1.5 h-3 rounded-full ${getIndicatorColor(tIdx)}`}></span>
                              <span className="text-white">{tIdx + 1}</span>
                            </td>
                            <td className="py-3 font-semibold text-white truncate max-w-[150px]">
                              <div className="flex items-center gap-2">
                                <img 
                                  src={team.crest} 
                                  alt={`${team.name} Flag`} 
                                  className="w-5 h-4 object-contain rounded-[2px]"
                                />
                                <span>{team.name}</span>
                              </div>
                            </td>
                            <td className="py-3 text-center font-mono">{team.matches_played}</td>
                            <td className="py-3 text-center font-mono">{team.won}</td>
                            <td className="py-3 text-center font-mono">{team.draw}</td>
                            <td className="py-3 text-center font-mono">{team.lost}</td>
                            <td className="py-3 text-center font-mono text-gray-400">{team.goals_for}</td>
                            <td className="py-3 text-center font-mono text-gray-400">{team.goals_against}</td>
                            <td className="py-3 text-center font-mono text-gray-400">{team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}</td>
                            <td className="py-3 text-center font-mono font-bold text-white">{team.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Best 3rd Place Table (13th Group - Now 12 Teams) */}
            <div className="bg-bg-1 border border-white/5 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {t.pages.standings.best3rdTitle}
                </h3>
                <p className="text-gray-400 text-xs">
                  {t.pages.standings.best3rdDesc}
                </p>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-white/10 text-xs font-semibold uppercase tracking-wider">
                      <th className="pb-4 w-12">Pos</th>
                      <th className="pb-4">Team</th>
                      <th className="pb-4 text-center w-16">Group</th>
                      <th className="pb-4 text-center w-8">Pld</th>
                      <th className="pb-4 text-center w-8">W</th>
                      <th className="pb-4 text-center w-8">D</th>
                      <th className="pb-4 text-center w-8">L</th>
                      <th className="pb-4 text-center w-8">GF</th>
                      <th className="pb-4 text-center w-8">GA</th>
                      <th className="pb-4 text-center w-8">GD</th>
                      <th className="pb-4 text-center w-16 font-mono text-primary-cyan">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bestThirdPlaceTeams.map((team, idx) => (
                      <tr key={idx} className="border-b border-white/5 last:border-0 text-gray-300 hover:bg-white/5 transition-colors">
                        <td className="py-4 font-bold flex items-center gap-1.5">
                          <span className={`w-1.5 h-3 rounded-full ${getThirdPlaceIndicatorColor(idx)}`}></span>
                          <span className="text-white">{idx + 1}</span>
                        </td>
                        <td className="py-4 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <img 
                              src={team.crest} 
                              alt={`${team.name} Flag`} 
                              className="w-5 h-4 object-contain rounded-[2px]"
                            />
                            <span>{team.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-center text-gray-400 font-bold">{team.group}</td>
                        <td className="py-4 text-center font-mono">{team.matches_played}</td>
                        <td className="py-4 text-center font-mono">{team.won}</td>
                        <td className="py-4 text-center font-mono">{team.draw}</td>
                        <td className="py-4 text-center font-mono">{team.lost}</td>
                        <td className="py-4 text-center font-mono text-gray-400">{team.goals_for}</td>
                        <td className="py-4 text-center font-mono text-gray-400">{team.goals_against}</td>
                        <td className="py-4 text-center font-mono text-gray-400">{team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}</td>
                        <td className="py-4 text-center font-mono font-bold text-white">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default StandingsPage;
