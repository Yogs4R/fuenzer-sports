import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { TeamStats } from '../../store/useAppStore';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';

interface StandingsTableProps {
  teams: TeamStats[];
}

const StandingsTable: React.FC<StandingsTableProps> = ({ teams }) => {
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
          <div className="col-span-4 text-left">Club</div>
          <div className="col-span-1 text-center">MP</div>
          <div className="col-span-1 text-center">W</div>
          <div className="col-span-1 text-center">D</div>
          <div className="col-span-1 text-center">L</div>
          <div className="col-span-1 text-center">GD</div>
          <div className="col-span-1 text-center font-bold text-white">Pts</div>
        </div>

        {/* Body */}
        <div className="flex flex-col relative pb-2">
          {sortedTeams.map((team, index) => {
            const prevIndex = prevOrderRef.current[team.id];
            const hasPrev = prevIndex !== undefined;
            const diff = hasPrev ? prevIndex - index : 0;
            
            return (
              <motion.div
                key={team.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 15,
                  mass: 1
                }}
                className="grid grid-cols-12 gap-1 md:gap-2 p-3 items-center border-b border-white/5 hover:bg-white/5 transition-colors text-xs md:text-sm font-mono"
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
                <div className="col-span-4 flex items-center space-x-3 font-sans">
                  <img src={team.crest} alt={team.name} className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.tla}&background=random&color=fff&rounded=true&font-size=0.4` }} />
                  <span className="font-semibold text-white truncate">{team.name}</span>
                  <span className="text-xs text-gray-500 hidden sm:inline">{team.tla}</span>
                </div>
                <div className="col-span-1 text-center text-gray-300">{team.matches_played}</div>
                <div className="col-span-1 text-center text-gray-300">{team.won}</div>
                <div className="col-span-1 text-center text-gray-300">{team.draw}</div>
                <div className="col-span-1 text-center text-gray-300">{team.lost}</div>
                <div className="col-span-1 text-center text-gray-300">{team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}</div>
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
