import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import StandingsTable from './StandingsTable';
import { Play, RotateCcw, Menu, Info, Trophy, Target, Shield, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RightPanelProps {
  onToggleMenu?: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ onToggleMenu }) => {
  const { simulationData, runSimulation, isLoading, liveStandings, selectedModel, selectedMode } = useAppStore();
  const [activeTab, setActiveTab] = useState<'standings' | 'bracket'>('standings');

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterOptions = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H', 'Group I', 'Group J', 'Group K', 'Group L', 'Best 3rd Place'];
  const [selectedFilters, setSelectedFilters] = useState<string[]>(filterOptions);

  // Probability Semantic Colors helper
  const getProbColor = (prob: number) => {
    if (prob >= 70) return 'text-green-400';
    if (prob >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const currentStandingsRaw = simulationData?.sample_standings || liveStandings || [];
  const isSimulated = !!simulationData;
  const currentMatchday = currentStandingsRaw[0]?.teams[0]?.matches_played || 0;

  // Search and Checkbox Filter Logic
  const currentStandings = currentStandingsRaw
    .filter(group => selectedFilters.includes(group.group_name))
    .map(group => ({
      ...group,
      teams: group.teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.tla.toLowerCase().includes(searchQuery.toLowerCase()))
    })).filter(group => group.teams.length > 0);

  // Compute Best Third-Placed Teams
  const thirdPlacedTeams = selectedFilters.includes('Best 3rd Place') ? currentStandingsRaw
    .map(group => {
      const team = group.teams[2];
      if (team) {
        return { ...team, group_name: group.group_name };
      }
      return null;
    })
    .filter((t): t is (typeof currentStandingsRaw[0]['teams'][0] & { group_name: string }) => t !== null)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
      return b.goals_for - a.goals_for;
    })
    .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.tla.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  const handleSimulate = () => {
    if (!isLoading) {
      runSimulation('', selectedModel, selectedMode);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050814]">
      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 md:px-6 py-4 border-b border-white/10 bg-[#080d1e] gap-4 sm:gap-0">
        <div className="flex items-center space-x-3 md:space-x-6 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
          {onToggleMenu && (
            <button 
              onClick={onToggleMenu}
              className="md:hidden text-gray-400 hover:text-white p-1.5 shrink-0 bg-white/5 rounded-lg border border-white/10"
            >
              <Menu size={18} />
            </button>
          )}
          <button
            onClick={() => setActiveTab('standings')}
            className={`pb-2 text-sm font-semibold transition-colors relative whitespace-nowrap ${
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
            className={`pb-2 text-sm font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === 'bracket' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Knockout Bracket
            {activeTab === 'bracket' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-cyan shadow-[0_0_8px_rgba(76,215,246,0.8)]" />
            )}
          </button>
        </div>
        
        {/* Simulate / Restart Trigger Button */}
        {activeTab === 'standings' && (
          <button 
            onClick={handleSimulate}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary-cyan/10 hover:bg-primary-cyan/20 text-primary-cyan text-xs font-semibold rounded-lg border border-primary-cyan/30 transition-colors disabled:opacity-50 w-full sm:w-auto ml-auto"
          >
            {isSimulated ? <RotateCcw size={14} /> : <Play size={14} />}
            Play Simulation
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-6 space-y-6">
        {activeTab === 'standings' ? (
          <>
            {/* Matchday Badge and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Live Progression</h2>
                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 bg-white/5 rounded-full border border-white/10 transition-all duration-300">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isLoading || currentMatchday < 3 ? 'bg-primary-cyan animate-pulse' : 'bg-green-500'}`}></span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    {currentMatchday === 0 ? 'Pre-Tournament' : `Matchday ${currentMatchday}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 relative">
                {/* Search Box */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text"
                    placeholder="Search team..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#0a1128] text-white text-xs pl-8 pr-4 py-2 rounded-lg border border-white/10 focus:border-primary-cyan/50 outline-none w-full sm:w-48 transition-colors"
                  />
                </div>
                
                {/* Filter Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`bg-[#0a1128] text-white text-xs px-3 py-2 rounded-lg border transition-colors flex items-center gap-2 ${isFilterOpen || selectedFilters.length < filterOptions.length ? 'border-primary-cyan/50 bg-primary-cyan/5' : 'border-white/10 hover:bg-white/5'}`}
                  >
                    <Filter size={14} className={selectedFilters.length < filterOptions.length ? 'text-primary-cyan' : ''} />
                    <span className="hidden sm:inline">Filter</span>
                  </button>
                  <AnimatePresence>
                    {isFilterOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-[#0a1128] border border-white/10 rounded-xl shadow-xl z-50 p-2 max-h-64 overflow-y-auto scrollbar-hide"
                        >
                          <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-white/10">
                            <span className="text-xs font-bold text-gray-300">Show Groups</span>
                            <button 
                              onClick={() => setSelectedFilters(selectedFilters.length === filterOptions.length ? [] : [...filterOptions])}
                              className="text-[10px] text-primary-cyan hover:underline"
                            >
                              {selectedFilters.length === filterOptions.length ? 'Clear All' : 'Select All'}
                            </button>
                          </div>
                          {filterOptions.map(opt => (
                            <label key={opt} className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded cursor-pointer transition-colors">
                              <input 
                                type="checkbox" 
                                checked={selectedFilters.includes(opt)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedFilters([...selectedFilters, opt]);
                                  else setSelectedFilters(selectedFilters.filter(f => f !== opt));
                                }}
                                className="accent-primary-cyan"
                              />
                              <span className="text-xs text-gray-300">{opt}</span>
                            </label>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Probability Metrics Overview */}
            {simulationData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(simulationData.probabilities).map(([teamCode, metrics]) => {
                  let groupName = "";
                  let crest = "";
                  for (const group of currentStandings) {
                    const t = group.teams.find(t => t.tla === teamCode);
                    if (t) {
                      groupName = group.group_name;
                      crest = t.crest;
                      break;
                    }
                  }
                  
                  return (
                    <div key={teamCode} className="bg-linear-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden group hover:border-primary-cyan/50 transition-colors">
                      <div className="absolute top-0 right-0 bg-white/10 px-2 py-1 text-[10px] text-gray-300 rounded-bl-lg font-bold uppercase tracking-wider backdrop-blur-sm z-10">{groupName}</div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        {crest && <img src={crest} alt={teamCode} className="w-8 h-8 object-contain drop-shadow-md" />}
                        <h3 className="text-white font-black text-xl tracking-tight">{teamCode}</h3>
                      </div>
                      
                      <div className="space-y-2 font-mono text-xs">
                        <div className="flex justify-between items-center bg-black/20 px-2 py-1.5 rounded">
                          <span className="text-gray-400 flex items-center gap-1.5"><Trophy size={12}/> 1st Place</span>
                          <span className={`font-bold ${getProbColor(metrics['1st'])}`}>{metrics['1st']}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-black/20 px-2 py-1.5 rounded">
                          <span className="text-gray-400 flex items-center gap-1.5"><Target size={12}/> 2nd Place</span>
                          <span className={`font-bold ${getProbColor(metrics['2nd'])}`}>{metrics['2nd']}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-primary-cyan/10 px-2 py-1.5 rounded border border-primary-cyan/20 mt-2">
                          <span className="text-primary-cyan font-bold flex items-center gap-1.5"><Shield size={12}/> Advancing</span>
                          <span className={`font-black ${getProbColor(metrics['qualify'])}`}>{metrics['qualify']}%</span>
                        </div>
                      </div>
                      
                      {/* Decorative background accent */}
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-cyan/10 rounded-full blur-2xl group-hover:bg-primary-cyan/20 transition-colors pointer-events-none" />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Standings Tables */}
            {currentStandings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <div className="w-8 h-8 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm animate-pulse">Loading stadium data...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {currentStandings.map((group) => (
                    <div key={group.group_name} className="space-y-3">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="w-2 h-6 bg-primary-cyan rounded-full mr-3"></span>
                        {group.group_name}
                      </h2>
                      <StandingsTable teams={group.teams} qualifyCount={2} />
                    </div>
                  ))}
                </div>
                
                {/* Best Third-Placed Teams */}
                {thirdPlacedTeams.length > 0 && (
                  <div className="mt-8 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="w-2 h-6 bg-yellow-400 rounded-full mr-3"></span>
                        Ranking of Third-Placed Teams
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        <Info size={14} className="text-yellow-400" />
                        <span>Top 8 advance to Round of 32</span>
                      </div>
                    </div>
                    <div className="bg-[#0a1024] p-1 rounded-xl border border-white/10">
                       <StandingsTable teams={thirdPlacedTeams} qualifyCount={8} />
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 border border-dashed border-white/20 rounded-xl">
            <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <p>Tournament bracket visualization coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
