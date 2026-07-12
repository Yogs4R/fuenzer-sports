import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, ChevronDown, Mic, Loader2, Image, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuickActionChips from './QuickActionChips';
import { useAppStore } from '../../store/useAppStore';
import { id } from '../../locales/id';
import { en } from '../../locales/en';

// Add type for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type DropdownType = 'competition' | 'model' | 'mode' | 'style' | null;

const HeroSearchBox: React.FC = () => {
  const { 
    language, 
    runSimulation, 
    isLoading,
    selectedCompetition, setSelectedCompetition,
    selectedModel, setSelectedModel,
    selectedMode, setSelectedMode,
    selectedStyle, setSelectedStyle,
    startNewSession
  } = useAppStore();
  
  const t = language === 'id' ? id : en;
  const [query, setQuery] = useState('');
  const [tempQuery, setTempQuery] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  
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

  const toggleRecording = () => {
    if (isRecording) {
      return; // The API auto-stops when you stop talking, or we can manually stop
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice chat is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsRecording(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(prev => prev ? `${prev} ${transcript}` : transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };
    
    recognition.onend = () => setIsRecording(false);
    
    recognition.start();
  };

  const displayQuery = tempQuery || query;
  const isSubmitActive = displayQuery.trim().length >= 4 || !!imageBase64;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSimulate = () => {
    if (isSubmitActive && !isLoading) {
      startNewSession();
      runSimulation(displayQuery, selectedModel, selectedMode, imageBase64 || undefined);
      setImageBase64(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-2 md:mt-6 relative z-10 flex flex-col">
      {/* Title */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-linear-to-r from-white via-cyan-100 to-primary-cyan/70 pb-2 leading-normal">
          {t.components.hero.title}
        </h1>
        <p className="text-lg text-gray-400">
          {t.components.hero.subtitle}
        </p>
      </div>

      {/* Main Search Box */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-bg-1 border border-white/10 rounded-3xl p-2 shadow-2xl relative mx-4 flex flex-col"
      >

        <div className="relative">
          <textarea
            value={displayQuery}
            onChange={(e) => {
              const val = e.target.value;
              if (val.startsWith('/custom ')) {
                setSelectedCompetition('Custom');
                setQuery(val.substring(8));
              } else if (val.startsWith('/world-cup ')) {
                setSelectedCompetition('World Cup');
                setQuery(val.substring(11));
              } else {
                setQuery(val);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSimulate();
              }
            }}
            placeholder={selectedCompetition === 'Custom' ? (t.components.hero as any).placeholderCustom : t.components.hero.placeholder}
            className="w-full h-40 md:h-32 bg-transparent text-white placeholder-gray-500 p-6 pb-6 rounded-2xl resize-none focus:outline-none text-lg"
          />
          
          <AnimatePresence>
             {displayQuery.startsWith('/') && !displayQuery.includes(' ') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-12 left-6 bg-bg-0 border border-white/10 rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1 w-64"
                >
                   <div className="text-xs text-gray-400 px-2 pb-1 border-b border-white/5 mb-1">Commands</div>
                   <button 
                     onClick={() => { setSelectedCompetition('Custom'); setQuery(''); }}
                     className="text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-primary-cyan rounded-lg transition-colors flex flex-col"
                   >
                      <span className="font-semibold text-white">/custom</span>
                      <span className="text-xs text-gray-500">Create a custom tournament</span>
                   </button>
                   <button 
                     onClick={() => { setSelectedCompetition('World Cup'); setQuery(''); }}
                     className="text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-primary-cyan rounded-lg transition-colors flex flex-col"
                   >
                      <span className="font-semibold text-white">/world-cup</span>
                      <span className="text-xs text-gray-500">World Cup 2026 simulation</span>
                   </button>
                </motion.div>
             )}
          </AnimatePresence>
           
           <AnimatePresence>
             {imageBase64 && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 className="absolute bottom-4 left-4 border border-white/20 rounded-lg overflow-hidden bg-bg-0 shadow-lg"
               >
                 <img src={imageBase64} alt="Uploaded" className="h-16 w-16 object-cover" />
                 <button 
                   onClick={removeImage}
                   className="absolute top-1 right-1 bg-black/60 p-0.5 rounded-full hover:bg-black text-white"
                 >
                   <X size={12} />
                 </button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
        
        <div className="flex flex-wrap items-center justify-between p-2 relative gap-y-3" ref={dropdownRef}>
          {/* Left: Action & Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload Image"
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-all border ${imageBase64 ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan' : 'bg-bg-0 border-white/5 hover:border-white/20 text-gray-400 hover:text-white'}`}
            >
              <Image size={16} />
            </button>

            {/* Model Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'model' ? null : 'model')}
                className={`flex items-center gap-2 border transition-all rounded-full px-4 py-2 text-sm ${activeDropdown === 'model' ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan' : 'bg-bg-0 border-white/5 hover:border-white/20 text-gray-300'}`}
              >
                <Sparkles size={14} className={activeDropdown === 'model' ? 'text-primary-cyan' : 'text-gray-400'} />
                <span>{selectedModel}</span>
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

            {/* Competition Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'competition' ? null : 'competition')}
                className={`flex items-center gap-2 border transition-all rounded-full px-4 py-2 text-sm ${activeDropdown === 'competition' ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan' : 'bg-bg-0 border-white/5 hover:border-white/20 text-gray-300'}`}
              >
                <span>{selectedCompetition}</span>
                <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'competition' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'competition' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 w-48 bg-bg-0 border border-white/10 rounded-xl shadow-xl overflow-hidden z-20"
                  >
                    {[
                      { name: 'World Cup', soon: false },
                      { name: 'Custom', soon: false },
                      { name: 'AFC', soon: true },
                      { name: 'AFCON', soon: true },
                      { name: 'UEFA', soon: true }
                    ].map((opt) => (
                      <button 
                        key={opt.name}
                        disabled={opt.soon}
                        onClick={() => { setSelectedCompetition(opt.name); setActiveDropdown(null); }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between
                          ${opt.soon ? 'text-gray-600 cursor-not-allowed' : 
                            selectedCompetition === opt.name ? 'text-primary-cyan bg-primary-cyan/5 hover:bg-white/5' : 'text-gray-300 hover:bg-white/5'}`}
                      >
                        <span>{opt.name}</span>
                        {opt.soon && <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-gray-500">soon</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Style Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'style' ? null : 'style')}
                className={`flex items-center gap-2 border transition-all rounded-full px-4 py-2 text-sm ${activeDropdown === 'style' ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan' : 'bg-bg-0 border-white/5 hover:border-white/20 text-gray-300'}`}
              >
                <span>{selectedStyle}</span>
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
                    {['Commentator Style', 'Coach Style', 'Football Analyst Style'].map((opt) => (
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

            {/* Mode Dropdown */}
            {selectedCompetition !== 'Custom' && (
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'mode' ? null : 'mode')}
                className={`flex items-center gap-2 border transition-all rounded-full px-4 py-2 text-sm ${activeDropdown === 'mode' ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan' : 'bg-bg-0 border-white/5 hover:border-white/20 text-gray-300'}`}
              >
                <span>{t.components.hero.mode}: {selectedMode}</span>
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
                    {['Live Standings', 'From Scratch'].map((opt) => (
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
            )}

          </div>

          {/* Right: Mic & Submit Button */}
          <div className="flex items-center gap-2 shrink-0 ml-auto md:ml-0">
            <button 
              onClick={toggleRecording}
              aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${isRecording ? 'text-red-400 bg-red-400/10 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Mic size={20} />
            </button>
            <button 
              disabled={!isSubmitActive || isLoading}
              onClick={handleSimulate}
              aria-label="Run simulation"
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isSubmitActive && !isLoading ? 'bg-primary-cyan text-bg-0 hover:bg-cyan-300 shadow-[0_0_20px_rgba(76,215,246,0.3)] hover:shadow-[0_0_30px_rgba(76,215,246,0.5)] cursor-pointer' : 'bg-white/10 text-gray-500 cursor-not-allowed'}`}
            >
              {isLoading ? <Loader2 size={24} className="animate-spin text-primary-cyan" /> : <ArrowUp size={24} strokeWidth={2.5} />}
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
