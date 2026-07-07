import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { id } from '../locales/id';
import { en } from '../locales/en';

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

  // Helper to generate Group letters A to L
  const groups = Array.from({ length: 12 }, (_, i) => {
    const groupLetter = String.fromCharCode(65 + i); // A to L
    return {
      name: `Group ${groupLetter}`,
      teams: [
        { name: `${groupLetter}1 - Argentina`, pld: 0, w: 0, d: 0, l: 0, pts: 0 },
        { name: `${groupLetter}2 - France`, pld: 0, w: 0, d: 0, l: 0, pts: 0 },
        { name: `${groupLetter}3 - Japan`, pld: 0, w: 0, d: 0, l: 0, pts: 0 },
        { name: `${groupLetter}4 - Morocco`, pld: 0, w: 0, d: 0, l: 0, pts: 0 },
      ]
    };
  });

  const bestThirdPlaceTeams = Array.from({ length: 8 }, (_, i) => ({
    pos: i + 1,
    name: `Team ${String.fromCharCode(65 + i)}3 (Placeholder)`,
    group: String.fromCharCode(65 + i),
    pld: 0,
    w: 0,
    d: 0,
    l: 0,
    pts: 0
  }));

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
        <div className="flex justify-center gap-2 mb-12 border-b border-white/5 pb-4 overflow-x-auto w-full scrollbar-hide">
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
                            <td className="py-3 font-bold text-primary-cyan">{tIdx + 1}</td>
                            <td className="py-3 font-semibold text-white truncate max-w-[120px]">{team.name}</td>
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

            {/* Best 3rd Place Table (13th Group) */}
            <div className="bg-bg-1 border border-white/5 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Best 3rd Place Standings
                </h3>
                <p className="text-gray-400 text-xs">
                  The top 8 third-place teams evaluated for knockout stage qualification.
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
                        <td className="py-4 font-bold text-primary-cyan">{team.pos}</td>
                        <td className="py-4 font-semibold text-white">{team.name}</td>
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
