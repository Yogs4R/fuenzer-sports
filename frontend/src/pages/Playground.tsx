import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import LeftPanel from '../components/playground/LeftPanel';
import RightPanel from '../components/playground/RightPanel';


const Playground: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);


  // Close mobile menu automatically if the chat responds (just for UX testing, or keep it open so user can see it)
  // Actually, better to keep it open so they can read the AI response.

  const { fetchLiveStandings, liveStandings } = useAppStore();

  useEffect(() => {
    // Scroll to top when entering playground
    window.scrollTo(0, 0);
    
    // Fetch live standings if empty
    if (!liveStandings || liveStandings.length === 0) {
      fetchLiveStandings();
    }
  }, [fetchLiveStandings, liveStandings?.length]);

  return (
    <div className="flex h-[calc(100vh-72px)] w-full mt-[72px] relative overflow-hidden">
      {/* Left Panel (AI Chat) - Desktop: Fixed 30% width, Mobile: Slide over full screen */}
      <div className="hidden md:block w-[30%] h-full z-30">
        <LeftPanel onCloseMobile={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="md:hidden fixed top-[72px] bottom-0 left-0 right-0 z-50 bg-[#080d1e]"
          >
            <LeftPanel onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Panel (Data Viz) - Desktop: 70% width, Mobile: Full width */}
      <div className="w-full md:w-[70%] h-full overflow-hidden">
        <RightPanel onToggleMenu={() => setIsMobileMenuOpen(true)} />
      </div>
    </div>
  );
};

export default Playground;
