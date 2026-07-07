import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { id } from '../locales/id';
import { en } from '../locales/en';
import { groups, bestThirdPlaceTeams } from '../data/standingsData';

const StandingsPage = () => {
  const { language } = useAppStore();
  const t = language === 'id' ? id : en;
  const [activeTab, setActiveTab] = useState('World Cup');

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
            Explore tournament group stages and standings simulated by Monte Carlo AI.
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
                  soon
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'World Cup' && (
          <div className="space-y-16">
            
            {/* Groups Grid (12 Groups) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groups.map((group, index) => (
                <div key={index} className="bg-bg-1 border border-white/5 rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">
                    {group.name}
                  </h3>
                  
                  <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="text-gray-500 border-b border-white/5 uppercase tracking-wider font-bold">
                          <th className="pb-3 w-8">Pos</th>
                          <th className="pb-3">Team</th>
                          <th className="pb-3 text-center w-8">Pld</th>
                          <th className="pb-3 text-center w-8">W</th>
                          <th className="pb-3 text-center w-8">D</th>
                          <th className="pb-3 text-center w-8">L</th>
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
                                  src={`https://flagcdn.com/16x12/${team.code}.png`} 
                                  alt={`${team.name} Flag`} 
                                  className="w-4 h-3 object-cover rounded-[1px] border border-white/10"
                                />
                                <span>{team.name}</span>
                              </div>
                            </td>
                            <td className="py-3 text-center">{team.pld}</td>
                            <td className="py-3 text-center">{team.w}</td>
                            <td className="py-3 text-center">{team.d}</td>
                            <td className="py-3 text-center">{team.l}</td>
                            <td className="py-3 text-center font-mono font-bold text-white">{team.pts}</td>
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
                  Best 3rd Place Standings
                </h3>
                <p className="text-gray-400 text-xs">
                  The top 8 third-place teams qualify for the knockout stage (marked in green).
                </p>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-white/10 text-xs font-semibold uppercase tracking-wider">
                      <th className="pb-4 w-12">Pos</th>
                      <th className="pb-4">Team</th>
                      <th className="pb-4 text-center w-16">Group</th>
                      <th className="pb-4 text-center w-12">Pld</th>
                      <th className="pb-4 text-center w-12">W</th>
                      <th className="pb-4 text-center w-12">D</th>
                      <th className="pb-4 text-center w-12">L</th>
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
                              src={`https://flagcdn.com/16x12/${team.code}.png`} 
                              alt={`${team.name} Flag`} 
                              className="w-4 h-3 object-cover rounded-[1px] border border-white/10"
                            />
                            <span>{team.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-center text-gray-400 font-bold">{team.group}</td>
                        <td className="py-4 text-center">{team.pld}</td>
                        <td className="py-4 text-center">{team.w}</td>
                        <td className="py-4 text-center">{team.d}</td>
                        <td className="py-4 text-center">{team.l}</td>
                        <td className="py-4 text-center font-mono font-bold text-white">{team.pts}</td>
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
