import { useAppStore } from '../store/useAppStore';
import { id } from '../locales/id';
import { en } from '../locales/en';

const HistoryPage = () => {
  const { language } = useAppStore();
  const t = language === 'id' ? id : en;

  return (
    <div className="min-h-screen relative w-full pt-32 pb-20 flex flex-col items-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-cyan/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-4xl bg-bg-1 border border-white/5 rounded-3xl p-8 relative z-10 shadow-2xl">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-white">
          {t.navbar.history}
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          This is a template page for simulation history. Your past tournament runs and simulation queries will be shown here.
        </p>

        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-bg-0 text-gray-500 text-sm">
          No simulation history available yet. Try running a tournament simulation!
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
