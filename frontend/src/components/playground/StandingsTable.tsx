import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, type TeamStats } from '../../store/useAppStore';
import { ChevronUp, ChevronDown, Minus, Pencil, Check, X } from 'lucide-react';

interface StandingsTableProps {
  teams: TeamStats[];
  qualifyCount?: number;
}

const StandingsTable: React.FC<StandingsTableProps> = ({ teams, qualifyCount = 2 }) => {
  const { selectedCompetition, updateTeamName } = useAppStore();
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  
  // Sort teams by points (descending) as a fallback, though backend should send them sorted
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.goal_difference - a.goal_difference;
  });

  const prevOrderRef = useRef<{ [teamId: number]: number }>({});
  
  // Update the ref AFTER render so during render we can compare with the previous state
  useEffect(() => {
    const newOrder: { [teamId: number]: number } = {};
    sortedTeams.forEach((team, idx) => {
      newOrder[team.id] = idx;
    });
    prevOrderRef.current = newOrder;
  }, [sortedTeams]);

  return (
    <div className="w-full overflow-x-auto scrollbar-hide rounded-xl border border-white/10 bg-[#080d1e]">
      <div className="min-w-[500px]">
        {/* Header */}
        <div className="grid grid-cols-12 gap-1 md:gap-2 p-3 text-[10px] md:text-sm font-semibold text-gray-400 border-b border-white/10 bg-white/5 uppercase">
          <div className="col-span-2 text-center">Pos</div>
          <div className={`text-left ${selectedCompetition === 'Custom' ? 'col-span-5' : 'col-span-4'}`}>Club</div>
          <div className="col-span-1 text-center">MP</div>
          <div className="col-span-1 text-center">W</div>
          <div className="col-span-1 text-center">D</div>
          <div className="col-span-1 text-center">L</div>
          {selectedCompetition !== 'Custom' && (
            <div className="col-span-1 text-center">GD</div>
          )}
          <div className="col-span-1 text-center font-bold text-white">Pts</div>
        </div>

        {/* Body */}
        <div className="flex flex-col relative pb-2">
          {sortedTeams.map((team, index) => {
            const prevIndex = prevOrderRef.current[team.id];
            const hasPrev = prevIndex !== undefined;
            const rawDiff = hasPrev ? prevIndex - index : 0;
            const isPreTournament = team.matches_played === 0;
            const diff = isPreTournament ? 0 : rawDiff;
            const isQualified = qualifyCount > 0 && index < qualifyCount;
            const isThirdPlace = index === 2;
            
            return (
              <motion.div
                key={team.tla}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 15,
                  mass: 1
                }}
                className={`grid grid-cols-12 gap-1 md:gap-2 p-3 items-center border-b hover:bg-white/5 transition-colors text-xs md:text-sm font-mono ${
                  isQualified 
                    ? 'border-l-[3px] border-l-green-400 bg-green-500/5 border-b-white/5' 
                    : isThirdPlace 
                      ? 'border-l-[3px] border-l-yellow-400 bg-yellow-500/5 border-b-white/5' 
                      : 'border-white/5 border-l-[3px] border-l-transparent'
                }`}
              >
                <div className="col-span-2 flex items-center justify-center space-x-2 text-gray-400">
                  <span className="font-bold text-white">{index + 1}</span>
                  {/* Position Change Indicator */}
                  <div className="flex items-center text-[10px] w-6 justify-center">
                    {diff > 0 ? (
                      <span className="text-green-400 flex items-center bg-green-400/10 px-1 py-0.5 rounded"><ChevronUp size={10} />{diff}</span>
                    ) : diff < 0 ? (
                      <span className="text-red-400 flex items-center bg-red-400/10 px-1 py-0.5 rounded"><ChevronDown size={10} />{Math.abs(diff)}</span>
                    ) : (
                      <span className="text-gray-500"><Minus size={10} /></span>
                    )}
                  </div>
                </div>
                <div className={`flex items-center space-x-2 font-sans min-w-0 overflow-hidden ${selectedCompetition === 'Custom' ? 'col-span-5' : 'col-span-4'}`}>
                  {selectedCompetition === 'Custom' ? (
                     <div className="w-6 h-6 rounded bg-primary-cyan/20 text-primary-cyan flex items-center justify-center font-bold text-[10px] shadow-inner shrink-0">
                       {team.tla.slice(0, 3)}
                     </div>
                  ) : (
                     <img src={team.crest} alt={team.name} crossOrigin="anonymous" className="w-6 h-6 object-contain shrink-0" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.tla}&background=random&color=fff&rounded=true&font-size=0.4` }} />
                  )}
                  
                  {editingTeamId === team.id ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-black/50 border border-primary-cyan/50 rounded px-1.5 py-0.5 text-xs text-white outline-none w-24"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && editName.trim()) {
                            updateTeamName(team.id, editName.trim());
                            setEditingTeamId(null);
                          } else if (e.key === 'Escape') {
                            setEditingTeamId(null);
                          }
                        }}
                      />
                      <button onClick={() => {
                        if (editName.trim()) updateTeamName(team.id, editName.trim());
                        setEditingTeamId(null);
                      }} className="text-green-400 hover:text-green-300">
                        <Check size={14} />
                      </button>
                      <button onClick={() => setEditingTeamId(null)} className="text-red-400 hover:text-red-300">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 group cursor-pointer min-w-0 shrink" onClick={() => {
                      if (selectedCompetition === 'Custom') {
                        setEditingTeamId(team.id);
                        setEditName(team.name);
                      }
                    }}>
                      <span className="font-semibold text-white truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[180px] shrink">{team.name}</span>
                      {selectedCompetition === 'Custom' && (
                        <Pencil size={12} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      )}
                    </div>
                  )}
                  
                  {selectedCompetition !== 'Custom' && (
                    <span className="text-xs text-gray-500 hidden sm:inline shrink-0">{team.tla}</span>
                  )}
                  {/* @ts-ignore */}
                  {team.group_name && (
                    <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                      {/* @ts-ignore */}
                      {team.group_name}
                    </span>
                  )}
                </div>
                <div className="col-span-1 text-center text-gray-300">{team.matches_played}</div>
                <div className="col-span-1 text-center text-gray-300">{team.won}</div>
                <div className="col-span-1 text-center text-gray-300">{team.draw}</div>
                <div className="col-span-1 text-center text-gray-300">{team.lost}</div>
                {selectedCompetition !== 'Custom' && (
                  <div className="col-span-1 text-center font-mono text-gray-400">
                    {team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}
                  </div>
                )}
                <div className="col-span-1 text-center font-bold text-primary-cyan">{team.points}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StandingsTable;
