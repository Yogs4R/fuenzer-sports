import HeroSearchBox from '../components/search/HeroSearchBox';
import BelowTheFold from '../components/layout/BelowTheFold';
import { motion } from 'framer-motion';
import { useSEO } from '../hooks/useSEO';

const LandingPage: React.FC = () => {
  useSEO({
    canonical: 'https://sports.fuenzer.web.id/',
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Fuenzer Sports",
        "alternateName": "Fuenzer Sports | AI-Driven Tournament Simulator",
        "url": "https://sports.fuenzer.web.id",
        "description": "Ask Anything. Simulate Everything. Run thousands of Monte Carlo simulations to predict World Cup 2026 outcomes.",
        "inLanguage": "en"
      },
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Fuenzer Sports",
        "url": "https://sports.fuenzer.web.id",
        "description": "AI-driven sports analytics simulation platform that runs thousands of mathematical Monte Carlo simulations in seconds.",
        "applicationCategory": "SportsApplication",
        "operatingSystem": "Any",
        "browserRequirements": "Requires JavaScript",
        "inLanguage": "en",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Monte Carlo simulation of World Cup 2026",
          "Natural language query processing",
          "Live interactive standings and knockout brackets",
          "Stateless AI architecture"
        ],
        "creator": {
          "@type": "Organization",
          "name": "Fuenzer Sports",
          "url": "https://sports.fuenzer.web.id"
        }
      }
    ]
  });

  return (
    <div 
      className="min-h-screen overflow-hidden relative w-full pt-28 pb-20 flex flex-col items-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-[#0a1128] via-[#050814] to-[#050814]"
    >
      {/* Dot Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #4cd7f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-cyan/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full z-10 flex flex-col items-center"
      >
        <HeroSearchBox />
      </motion.div>
      
      <div className="mt-auto w-full pt-10">
        <BelowTheFold />
      </div>
    </div>
  );
};

export default LandingPage;
