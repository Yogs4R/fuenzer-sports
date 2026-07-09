import React from 'react';
import { motion } from 'framer-motion';
import type { TeamStats } from '../../store/useAppStore';

interface StandingsTableProps {
  teams: TeamStats[];
}

const StandingsTable: React.FC<StandingsTableProps> = ({ teams }) => {
  // Sort teams by points (descending) as a fallback, though backend should send them sorted
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.goal_difference - a.goal_difference;
  });

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-[#080d1e]">
      <div className="min-w-[600px]">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 p-3 text-xs md:text-sm font-semibold text-gray-400 border-b border-white/10 bg-white/5 uppercase">
          <div className="col-span-1 text-center">Pos</div>
          <div className="col-span-5 text-left">Club</div>
          <div className="col-span-1 text-center">MP</div>
          <div className="col-span-1 text-center">W</div>
          <div className="col-span-1 text-center">D</div>
          <div className="col-span-1 text-center">L</div>
          <div className="col-span-1 text-center">GD</div>
          <div className="col-span-1 text-center font-bold text-white">Pts</div>
        </div>

        {/* Body */}
        <div className="flex flex-col relative pb-2">
          {sortedTeams.map((team, index) => (
            <motion.div
              key={team.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1
              }}
              className="grid grid-cols-12 gap-2 p-3 items-center border-b border-white/5 hover:bg-white/5 transition-colors text-sm font-mono"
            >
              <div className="col-span-1 text-center text-gray-400">
                {index + 1}
              </div>
              <div className="col-span-5 flex items-center space-x-3 font-sans">
                <img src={team.crest} alt={team.name} className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/24?text=' + team.tla }} />
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default StandingsTable;
