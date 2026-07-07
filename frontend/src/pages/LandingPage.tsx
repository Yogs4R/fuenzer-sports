import HeroSearchBox from '../components/search/HeroSearchBox';
import BelowTheFold from '../components/layout/BelowTheFold';
import FloatingSportsObjects from '../components/3d/FloatingSportsObjects';

const LandingPage: React.FC = () => {
  return (
    <div 
      className="min-h-[calc(100vh-80px)] relative w-full pt-8 pb-10 flex flex-col justify-center items-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-[#0a1128] via-[#050814] to-[#050814]"
    >
      {/* Dot Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #4cd7f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Background glow effects & 3D Objects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-cyan/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <FloatingSportsObjects />
      
      <HeroSearchBox />
      
      <div className="mt-auto w-full pt-10">
        <BelowTheFold />
      </div>
    </div>
  );
};

export default LandingPage;
