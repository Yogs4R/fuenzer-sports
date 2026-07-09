import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LeftPanel from '../components/playground/LeftPanel';
import RightPanel from '../components/playground/RightPanel';


const Playground: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);


  // Close mobile menu automatically if the chat responds (just for UX testing, or keep it open so user can see it)
  // Actually, better to keep it open so they can read the AI response.

  useEffect(() => {
    // Scroll to top when entering playground
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen w-full pt-[72px] relative">
      {/* Mobile Toggle Button (Visible only when Left Panel is closed on Mobile, positioned top-left under navbar) */}
      {!isMobileMenuOpen && (
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden absolute top-[85px] left-4 z-40 bg-bg-1 border border-white/10 text-gray-300 hover:text-white p-2.5 rounded-full shadow-lg flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Left Panel (AI Chat) - Desktop: Fixed 35% width, Mobile: Slide over full screen */}
      <div className="hidden md:block w-[35%] h-[calc(100vh-72px)] sticky top-[72px] z-30">
        <LeftPanel onCloseMobile={() => {}} />
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden absolute inset-0 z-50 w-full h-full bg-[#050814]"
          >
            <LeftPanel onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Panel (Data Viz) - Desktop: 65% width, Mobile: Full width */}
      <div className="w-full md:w-[65%] min-h-[calc(100vh-72px)]">
        <RightPanel />
      </div>
    </div>
  );
};

export default Playground;
