import { useState } from 'react';
import { ArrowUp, Sparkles, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSearchBox: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="w-full max-w-4xl mx-auto mt-32 relative z-10">
      {/* Title */}
      <div className="text-center mb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Simulate World Cup 2026 Group A matches..."
            className="w-full h-32 bg-transparent text-white placeholder-gray-500 p-6 rounded-2xl resize-none focus:outline-none text-lg"
          />
        </div>
        
        {/* Bottom Bar inside the search box */}
        <div className="flex items-center justify-between p-2">
          {/* Left: Selectors */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-bg-0 border border-white/5 hover:border-white/20 transition-all rounded-full px-4 py-2 text-sm text-gray-300">
              <Sparkles size={14} className="text-primary-cyan" />
              <span className="hidden sm:inline">Model: FS-Alpha</span>
              <span className="sm:hidden">FS-Alpha</span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>
            <button className="flex items-center gap-2 bg-bg-0 border border-white/5 hover:border-white/20 transition-all rounded-full px-4 py-2 text-sm text-gray-300">
              <span className="hidden sm:inline">Mode: Tournament</span>
              <span className="sm:hidden">Tournament</span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>
          </div>

          {/* Right: Submit Button */}
          <button 
            className="w-12 h-12 shrink-0 bg-primary-cyan text-bg-0 rounded-full flex items-center justify-center hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(76,215,246,0.3)] hover:shadow-[0_0_30px_rgba(76,215,246,0.5)]"
          >
            <ArrowUp size={24} strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSearchBox;
