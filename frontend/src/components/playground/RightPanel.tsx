import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import StandingsTable from './StandingsTable';
import BracketView from './BracketView';
import { Play, Menu, Info, Trophy, Target, Shield, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RightPanelProps {
  onToggleMenu?: () => void;
}

import { en } from '../../locales/en';
import { id } from '../../locales/id';

const RightPanel: React.FC<RightPanelProps> = ({ onToggleMenu }) => {
  const { simulationData, runSimulation, isLoading, liveStandings, selectedModel, selectedMode, isSimulatingKnockout, language } = useAppStore();
  const t = language === 'id' ? id : en;
  const p = t.components.playground.rightPanel;

  const [activeTab, setActiveTab] = useState<'standings' | 'bracket'>('standings');

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterOptions = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H', 'Group I', 'Group J', 'Group K', 'Group L', 'Best 3rd Place'];
  const [selectedFilters, setSelectedFilters] = useState<string[]>(filterOptions);
  
  const [showMetrics, setShowMetrics] = useState(true);
  type MetricSort = 'default' | 'highest_1st' | 'lowest_1st' | 'highest_adv' | 'lowest_adv';
  const [metricSort, setMetricSort] = useState<MetricSort>('default');

  // Probability Semantic Colors helper
  const getProbColor = (prob: number) => {
    if (prob >= 70) return 'text-green-400';
    if (prob >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const currentStandingsRaw = simulationData?.sample_standings || liveStandings || [];
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

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSimulate = () => {
    if (!isLoading) {
      if (activeTab === 'standings' && selectedMode === 'Live Standings') {
        setToastMessage(p.groupStageComplete);
        setTimeout(() => setToastMessage(null), 5000);
        return;
      }
      runSimulation('', selectedModel, selectedMode);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050814] relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-[#050814]/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="flex gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full bg-primary-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 rounded-full bg-primary-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 rounded-full bg-primary-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-primary-cyan font-semibold animate-pulse">{p.runningSim}</p>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 md:px-6 py-4 border-b border-white/10 bg-[#080d1e] gap-4 sm:gap-0">
        <div className="flex items-center space-x-3 md:space-x-6 overflow-x-auto scrollbar-custom pb-1 sm:pb-0">
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
            {p.groupStandings}
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
            {p.knockoutBracket}
            {activeTab === 'bracket' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-cyan shadow-[0_0_8px_rgba(76,215,246,0.8)]" />
            )}
          </button>
        </div>
        
        {/* Simulate / Restart Trigger Button */}
        <button 
          onClick={() => {
            if (activeTab === 'standings') {
              handleSimulate();
            } else {
              window.dispatchEvent(new Event('simulate-knockout'));
            }
          }}
          disabled={isLoading || isSimulatingKnockout}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary-cyan/10 hover:bg-primary-cyan/20 text-primary-cyan text-xs font-semibold rounded-lg border border-primary-cyan/30 transition-colors disabled:opacity-50 w-full sm:w-auto ml-auto"
        >
          <Play size={14} />
          {p.playSim}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-custom p-4 md:p-6 space-y-6 relative">
        {activeTab === 'standings' ? (
          <>
            {/* Matchday Badge and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{p.liveProgression}</h2>
                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 bg-white/5 rounded-full border border-white/10 transition-all duration-300">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isLoading || currentMatchday < 3 ? 'bg-primary-cyan animate-pulse' : 'bg-green-500'}`}></span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    {currentMatchday === 0 ? p.preTournament : `${p.matchday} ${currentMatchday}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 relative">
                {/* Search Box */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text"
                    placeholder={p.searchTeam}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#0a1128] text-white text-xs pl-8 pr-4 py-2 rounded-lg border border-white/10 focus:border-primary-cyan/50 outline-none w-full sm:w-48 transition-colors"
                  />
                </div>
                
                {/* Toggle Metrics */}
                <button
                  onClick={() => setShowMetrics(!showMetrics)}
                  className={`bg-[#0a1128] text-white text-xs px-3 py-2 rounded-lg border transition-colors flex items-center gap-2 ${showMetrics ? 'border-primary-cyan/50 bg-primary-cyan/5' : 'border-white/10 hover:bg-white/5'}`}
                >
                  <Target size={14} className={showMetrics ? 'text-primary-cyan' : ''} />
                  <span className="hidden sm:inline">{showMetrics ? p.hideMetrics : p.showMetrics}</span>
                </button>
                
                {/* Filter Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`bg-[#0a1128] text-white text-xs px-3 py-2 rounded-lg border transition-colors flex items-center gap-2 ${isFilterOpen || selectedFilters.length < filterOptions.length ? 'border-primary-cyan/50 bg-primary-cyan/5' : 'border-white/10 hover:bg-white/5'}`}
                  >
                    <Filter size={14} className={selectedFilters.length < filterOptions.length ? 'text-primary-cyan' : ''} />
                    <span className="hidden sm:inline">{p.filter}</span>
                  </button>
                  <AnimatePresence>
                    {isFilterOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-[#0a1128] border border-white/10 rounded-xl shadow-xl z-50 p-2 max-h-64 overflow-y-auto scrollbar-custom"
                        >
                          <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-white/10">
                            <span className="text-xs font-bold text-gray-300">{p.showGroups}</span>
                            <button 
                              onClick={() => setSelectedFilters(selectedFilters.length === filterOptions.length ? [] : [...filterOptions])}
                              className="text-[10px] text-primary-cyan hover:underline"
                            >
                              {selectedFilters.length === filterOptions.length ? p.clearAll : p.selectAll}
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
            {simulationData && showMetrics && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{p.probOverview}</h3>
                  <select 
                    value={metricSort}
                    onChange={(e) => setMetricSort(e.target.value as MetricSort)}
                    className="bg-[#0a1128] text-white text-xs px-2 py-1 rounded border border-white/10 outline-none cursor-pointer"
                  >
                    <option value="default">{p.defaultSort}</option>
                    <option value="highest_1st">{p.highest1st}</option>
                    <option value="lowest_1st">{p.lowest1st}</option>
                    <option value="highest_adv">{p.highestAdv}</option>
                    <option value="lowest_adv">{p.lowestAdv}</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(simulationData.probabilities)
                    .map(([teamCode, metrics]) => {
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
                      return { teamCode, metrics, groupName, crest };
                    })
                    .filter(item => item.groupName !== "")
                    .sort((a, b) => {
                      if (metricSort === 'highest_1st') return b.metrics['1st'] - a.metrics['1st'];
                      if (metricSort === 'lowest_1st') return a.metrics['1st'] - b.metrics['1st'];
                      if (metricSort === 'highest_adv') return b.metrics['qualify'] - a.metrics['qualify'];
                      if (metricSort === 'lowest_adv') return a.metrics['qualify'] - b.metrics['qualify'];
                      return 0; // Default sort
                    })
                    .map(({ teamCode, metrics, groupName, crest }) => (
                      <div key={teamCode} className="bg-linear-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden group hover:border-primary-cyan/50 transition-colors">
                        <div className="absolute top-0 right-0 bg-white/10 px-2 py-1 text-[10px] text-gray-300 rounded-bl-lg font-bold uppercase tracking-wider backdrop-blur-sm z-10">{groupName}</div>
                        
                        <div className="flex items-center gap-3 mb-4">
                          {crest && <img src={crest} alt={teamCode} className="w-8 h-8 object-contain drop-shadow-md" />}
                          <h3 className="text-white font-black text-xl tracking-tight">{teamCode}</h3>
                        </div>
                        
                        <div className="space-y-2 font-mono text-xs">
                          <div className="flex justify-between items-center bg-black/20 px-1.5 sm:px-2 py-1.5 rounded">
                            <span className="text-gray-400 flex items-center gap-1 sm:gap-1.5 truncate mr-1"><Trophy size={12} className="shrink-0"/> <span className="truncate">1st Place</span></span>
                            <span className={`font-bold shrink-0 ${getProbColor(metrics['1st'])}`}>{metrics['1st']}%</span>
                          </div>
                          <div className="flex justify-between items-center bg-black/20 px-1.5 sm:px-2 py-1.5 rounded">
                            <span className="text-gray-400 flex items-center gap-1 sm:gap-1.5 truncate mr-1"><Target size={12} className="shrink-0"/> <span className="truncate">2nd Place</span></span>
                            <span className={`font-bold shrink-0 ${getProbColor(metrics['2nd'])}`}>{metrics['2nd']}%</span>
                          </div>
                          <div className="flex justify-between items-center bg-primary-cyan/10 px-1.5 sm:px-2 py-1.5 rounded border border-primary-cyan/20 mt-2">
                            <span className="text-primary-cyan font-bold flex items-center gap-1 sm:gap-1.5 truncate mr-1"><Shield size={12} className="shrink-0"/> <span className="truncate">Advancing</span></span>
                            <span className={`font-black shrink-0 ${getProbColor(metrics['qualify'])}`}>{metrics['qualify']}%</span>
                          </div>
                        </div>
                        
                        {/* Decorative background accent */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-cyan/10 rounded-full blur-2xl group-hover:bg-primary-cyan/20 transition-colors pointer-events-none" />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Standings Tables */}
            {currentStandingsRaw.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <div className="w-8 h-8 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm animate-pulse">{p.loadingStadium}</p>
              </div>
            ) : currentStandings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4 border border-dashed border-white/10 rounded-xl bg-white/5">
                <svg className="w-12 h-12 text-gray-500 opacity-50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <p className="text-gray-400 text-sm font-semibold">{p.noGroupsMatch}</p>
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
          <BracketView />
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg shadow-red-500/20 border border-red-400 text-sm flex items-center gap-2 w-[90%] sm:w-auto text-center font-sans"
          >
            <Info size={16} className="shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RightPanel;
