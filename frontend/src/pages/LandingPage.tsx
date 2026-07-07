import HeroSearchBox from '../components/search/HeroSearchBox';
import BelowTheFold from '../components/layout/BelowTheFold';

const LandingPage: React.FC = () => {
  return (
    <div 
      className="min-h-screen overflow-hidden relative w-full pt-28 pb-20 flex flex-col items-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-[#0a1128] via-[#050814] to-[#050814]"
    >
      {/* Dot Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #4cd7f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-cyan/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <HeroSearchBox />
      
      <div className="mt-auto w-full pt-10">
        <BelowTheFold />
      </div>
    </div>
  );
};

export default LandingPage;
