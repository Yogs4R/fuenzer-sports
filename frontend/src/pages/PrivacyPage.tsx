import { useAppStore } from '../store/useAppStore';
import { id } from '../locales/id';
import { en } from '../locales/en';

const PrivacyPage = () => {
  const { language } = useAppStore();
  const t = language === 'id' ? id : en;

  return (
    <div className="min-h-screen relative w-full pt-32 pb-20 flex flex-col items-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-cyan/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-4xl bg-bg-1 border border-white/5 rounded-3xl p-8 relative z-10 shadow-2xl text-left">
        <h1 className="text-3xl font-bold tracking-tight mb-6 text-white">
          {t.pages.privacy.title}
        </h1>
        <p className="text-gray-400 mb-6 text-xs">{t.pages.privacy.lastUpdated}</p>
        
        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <p>
            {t.pages.privacy.p1}
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-2">{t.pages.privacy.h1}</h2>
          <p>
            {t.pages.privacy.p2Part1}<strong>{t.pages.privacy.guestFirst}</strong>{t.pages.privacy.p2Part2}<code>localStorage</code>{t.pages.privacy.p2Part3}
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-2">{t.pages.privacy.h2}</h2>
          <p>
            {t.pages.privacy.p3}
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-2">{t.pages.privacy.h3}</h2>
          <p>
            {t.pages.privacy.p4}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
