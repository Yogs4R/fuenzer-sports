import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import StandingsTable from './StandingsTable';

const RightPanel: React.FC = () => {
  const { simulationData } = useAppStore();
  const [activeTab, setActiveTab] = useState<'standings' | 'bracket'>('standings');

  // Probability Semantic Colors helper
  const getProbColor = (prob: number) => {
    if (prob >= 70) return 'text-green-400';
    if (prob >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="flex flex-col h-full bg-[#050814]">
      {/* Tabs Header */}
      <div className="flex items-center space-x-6 px-6 py-4 border-b border-white/10 bg-[#080d1e]">
        <button
          onClick={() => setActiveTab('standings')}
          className={`pb-2 text-sm font-semibold transition-colors relative ${
            activeTab === 'standings' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Group Standings
          {activeTab === 'standings' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-cyan shadow-[0_0_8px_rgba(76,215,246,0.8)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('bracket')}
          className={`pb-2 text-sm font-semibold transition-colors relative ${
            activeTab === 'bracket' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Knockout Bracket
          {activeTab === 'bracket' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-cyan shadow-[0_0_8px_rgba(76,215,246,0.8)]" />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
        {activeTab === 'standings' && simulationData ? (
          <>
            {/* Probability Metrics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(simulationData.probabilities).map(([teamCode, metrics]) => (
                <div key={teamCode} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h3 className="text-white font-bold mb-2">{teamCode}</h3>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">1st Place:</span>
                      <span className={getProbColor(metrics['1st'])}>{metrics['1st']}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">2nd Place:</span>
                      <span className={getProbColor(metrics['2nd'])}>{metrics['2nd']}%</span>
                    </div>
                    <div className="flex justify-between pt-1 mt-1 border-t border-white/10">
                      <span className="text-gray-300 font-semibold">Knockout:</span>
                      <span className={`font-bold ${getProbColor(metrics['Knockout'])}`}>{metrics['Knockout']}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Standings Tables */}
            {simulationData.sample_standings.map((group) => (
              <div key={group.group_name} className="space-y-3">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="w-2 h-6 bg-primary-cyan rounded-full mr-3"></span>
                  {group.group_name}
                </h2>
                <StandingsTable teams={group.teams} />
              </div>
            ))}
          </>
        ) : activeTab === 'bracket' ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 border border-dashed border-white/20 rounded-xl">
            <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <p>Tournament bracket visualization coming soon.</p>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            No simulation data available.
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
