import { useAppStore } from '../store/useAppStore';
import { id } from '../locales/id';
import { en } from '../locales/en';

const StandingsPage = () => {
  const { language } = useAppStore();
  const t = language === 'id' ? id : en;

  return (
    <div className="min-h-screen relative w-full pt-12 pb-10 flex flex-col items-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-cyan/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-4xl bg-bg-1 border border-white/5 rounded-3xl p-8 relative z-10 shadow-2xl">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-white">
          {t.navbar.standings}
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          This is a template page for tournament standings. Real-time Monte Carlo simulations will populate this standings table soon.
        </p>

        {/* Dummy Table */}
        <div className="w-full overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-bg-0 text-gray-400 border-b border-white/10 text-xs font-semibold">
                <th className="p-4">Pos</th>
                <th className="p-4">Team</th>
                <th className="p-4">Pld</th>
                <th className="p-4">W</th>
                <th className="p-4">D</th>
                <th className="p-4">L</th>
                <th className="p-4 font-mono">Pts</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5 text-gray-300">
                <td className="p-4 font-bold text-primary-cyan">1</td>
                <td className="p-4 font-semibold text-white">Argentina</td>
                <td className="p-4">0</td>
                <td className="p-4">0</td>
                <td className="p-4">0</td>
                <td className="p-4">0</td>
                <td className="p-4 font-mono font-bold text-white">0</td>
              </tr>
              <tr className="border-b border-white/5 text-gray-300">
                <td className="p-4 font-bold text-primary-cyan">2</td>
                <td className="p-4 font-semibold text-white">France</td>
                <td className="p-4">0</td>
                <td className="p-4">0</td>
                <td className="p-4">0</td>
                <td className="p-4">0</td>
                <td className="p-4 font-mono font-bold text-white">0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StandingsPage;
