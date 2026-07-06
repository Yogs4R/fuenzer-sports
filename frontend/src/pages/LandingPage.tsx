
import HeroSearchBox from '../components/search/HeroSearchBox';
import QuickActionChips from '../components/search/QuickActionChips';
import BelowTheFold from '../components/layout/BelowTheFold';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen relative w-full pt-20 pb-10 flex flex-col items-center">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-cyan/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <HeroSearchBox />
      <QuickActionChips />
      <BelowTheFold />
    </div>
  );
};

export default LandingPage;
