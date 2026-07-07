import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, ChevronDown, Image as ImageIcon, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuickActionChips from './QuickActionChips';

type DropdownType = 'model' | 'mode' | 'style' | null;

const HeroSearchBox: React.FC = () => {
  const [query, setQuery] = useState('');
  const [tempQuery, setTempQuery] = useState('');
  
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [selectedModel, setSelectedModel] = useState('Auto');
  const [selectedMode, setSelectedMode] = useState('Live Standings');
  const [selectedStyle, setSelectedStyle] = useState('Komentator Style');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChipHover = (chip: string) => {
    setTempQuery(chip);
  };

  const handleChipLeave = () => {
    setTempQuery('');
  };

  const handleChipClick = (chip: string) => {
    setQuery(chip);
    setTempQuery('');
  };

  const displayQuery = tempQuery || query;

  return (
    <div className="w-full max-w-4xl mx-auto mt-20 md:mt-32 relative z-10 flex flex-col">
      {/* Title */}
      <div className="text-center mb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400 pb-2 leading-normal">
          Ask Anything. Simulate Everything.
        </h1>
        <p className="text-lg text-gray-400">
          Powered by advanced Monte Carlo algorithms for the ultimate sports predictions.
        </p>
      </div>

      {/* Main Search Box */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-bg-1 border border-white/10 rounded-3xl p-2 shadow-2xl relative mx-4"
      >
        <div className="relative">
          <textarea
            value={displayQuery}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Simulate World Cup 2026 Group A matches..."
            className="w-full h-32 bg-transparent text-white placeholder-gray-500 p-6 pb-12 rounded-2xl resize-none focus:outline-none text-lg"
          />
          {/* Add Images Button */}
          <button className="absolute bottom-4 left-4 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
            <ImageIcon size={20} />
          </button>
        </div>
        
        {/* Bottom Bar inside the search box */}
        <div className="flex items-center justify-between p-2 relative" ref={dropdownRef}>
          {/* Left: Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Model Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'model' ? null : 'model')}
                className={`flex items-center gap-2 border transition-all rounded-full px-4 py-2 text-sm ${activeDropdown === 'model' ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan' : 'bg-bg-0 border-white/5 hover:border-white/20 text-gray-300'}`}
              >
                <Sparkles size={14} className={activeDropdown === 'model' ? 'text-primary-cyan' : 'text-gray-400'} />
                <span className="hidden sm:inline">Model: {selectedModel}</span>
                <span className="sm:hidden">{selectedModel}</span>
                <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'model' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'model' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 w-48 bg-bg-0 border border-white/10 rounded-xl shadow-xl overflow-hidden z-20"
                  >
                    {['Auto', 'Fast', 'Pro'].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => { setSelectedModel(opt); setActiveDropdown(null); }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${selectedModel === opt ? 'text-primary-cyan bg-primary-cyan/5' : 'text-gray-300'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mode Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'mode' ? null : 'mode')}
                className={`flex items-center gap-2 border transition-all rounded-full px-4 py-2 text-sm ${activeDropdown === 'mode' ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan' : 'bg-bg-0 border-white/5 hover:border-white/20 text-gray-300'}`}
              >
                <span className="hidden sm:inline">Mode: {selectedMode}</span>
                <span className="sm:hidden">{selectedMode}</span>
                <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'mode' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'mode' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 w-48 bg-bg-0 border border-white/10 rounded-xl shadow-xl overflow-hidden z-20"
                  >
                    {['Live Standings', 'Custom Standings'].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => { setSelectedMode(opt); setActiveDropdown(null); }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${selectedMode === opt ? 'text-primary-cyan bg-primary-cyan/5' : 'text-gray-300'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Style Dropdown */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'style' ? null : 'style')}
                className={`flex items-center gap-2 border transition-all rounded-full px-4 py-2 text-sm ${activeDropdown === 'style' ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan' : 'bg-bg-0 border-white/5 hover:border-white/20 text-gray-300'}`}
              >
                <span>Style: {selectedStyle}</span>
                <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'style' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'style' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 w-56 bg-bg-0 border border-white/10 rounded-xl shadow-xl overflow-hidden z-20"
                  >
                    {['Komentator Style', 'Coach Style', 'Football Analyst Style'].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => { setSelectedStyle(opt); setActiveDropdown(null); }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${selectedStyle === opt ? 'text-primary-cyan bg-primary-cyan/5' : 'text-gray-300'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Right: Mic & Submit Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <Mic size={20} />
            </button>
            <button 
              className="w-12 h-12 bg-primary-cyan text-bg-0 rounded-full flex items-center justify-center hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(76,215,246,0.3)] hover:shadow-[0_0_30px_rgba(76,215,246,0.5)]"
            >
              <ArrowUp size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Quick Action Chips are now child to HeroSearchBox to share state seamlessly */}
      <QuickActionChips 
        onChipHover={handleChipHover}
        onChipLeave={handleChipLeave}
        onChipClick={handleChipClick}
      />
    </div>
  );
};

export default HeroSearchBox;
