import HeroSearchBox from '../components/search/HeroSearchBox';
import BelowTheFold from '../components/layout/BelowTheFold';
import FloatingSportsObjects from '../components/3d/FloatingSportsObjects';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] relative w-full pt-20 pb-10 flex flex-col justify-center items-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-bg-1 via-bg-0 to-bg-0">
      {/* Background glow effects & 3D Objects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-cyan/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <FloatingSportsObjects />
      
      <HeroSearchBox />
      
      <div className="mt-auto w-full">
        <BelowTheFold />
      </div>
    </div>
  );
};

export default LandingPage;
