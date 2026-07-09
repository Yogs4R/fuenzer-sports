import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LeftPanel from '../components/playground/LeftPanel';
import RightPanel from '../components/playground/RightPanel';


const Playground: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  // Close mobile menu automatically if the chat responds (just for UX testing, or keep it open so user can see it)
  // Actually, better to keep it open so they can read the AI response.

  useEffect(() => {
    // Scroll to top when entering playground
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden relative">
      {/* Mobile Toggle Button (Visible only when Left Panel is closed on Mobile) */}
      <button 
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden absolute bottom-6 right-6 z-40 bg-primary-cyan text-[#050814] p-4 rounded-full shadow-[0_0_15px_rgba(76,215,246,0.5)] flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Left Panel (AI Chat) - Desktop: Fixed 35% width, Mobile: Slide over full screen */}
      <div className="hidden md:block w-[35%] h-full z-30">
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
      <div className="w-full md:w-[65%] h-full">
        <RightPanel />
      </div>
    </div>
  );
};

export default Playground;
