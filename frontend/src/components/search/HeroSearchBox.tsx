import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, ChevronDown, Image as ImageIcon, Mic, X, Loader2 } from 'lucide-react';
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

type DropdownType = 'model' | 'mode' | 'style' | null;

const HeroSearchBox: React.FC = () => {
  const { language, runSimulation, isLoading } = useAppStore();
  const t = language === 'id' ? id : en;
  const [query, setQuery] = useState('');
  const [tempQuery, setTempQuery] = useState('');
  
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [selectedModel, setSelectedModel] = useState('Auto');
  const [selectedMode, setSelectedMode] = useState('Live Standings');
  const [selectedStyle, setSelectedStyle] = useState('Commentator Style');

  interface UploadedImage {
    file: File;
    url: string;
  }
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Max 5MB allowed.`);
          return false;
        }
        return true;
      });

      const newUploads = validFiles.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));

      setImages(prev => {
        const combined = [...prev, ...newUploads];
        if (combined.length > 5) {
          alert('You can only upload up to 5 images.');
          combined.slice(5).forEach(img => URL.revokeObjectURL(img.url));
          return combined.slice(0, 5);
        }
        return combined;
      });
      // Clear input value to allow uploading the same file again
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      if (prev[index]) {
        URL.revokeObjectURL(prev[index].url);
      }
      return prev.filter((_, i) => i !== index);
    });
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
  const isSubmitActive = displayQuery.trim().length >= 4;

  const handleSimulate = () => {
    if (isSubmitActive && !isLoading) {
      runSimulation(displayQuery, selectedModel, selectedMode);
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
        {/* Image Previews */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 p-4 pb-0">
            {images.map((imgItem, index) => {
              const safeUrl = imgItem.url.startsWith('blob:') ? imgItem.url : '';
              return (
                <div 
                  key={index} 
                  onClick={() => setPreviewImage(safeUrl)}
                  className="relative group rounded-xl overflow-hidden border border-white/10 w-16 h-16 cursor-zoom-in"
                >
                  <img src={safeUrl} alt="upload preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                    className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all z-10"
                    title="Remove image"
                  >
                    <X size={10} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="relative">
          <textarea
            value={displayQuery}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSimulate();
              }
            }}
            placeholder={t.components.hero.placeholder}
            className="w-full h-40 md:h-32 bg-transparent text-white placeholder-gray-500 p-6 pb-6 rounded-2xl resize-none focus:outline-none text-lg"
          />
        </div>
        
        {/* Bottom Bar inside the search box */}
        <div className="flex flex-wrap items-center justify-between p-2 relative gap-y-3" ref={dropdownRef}>
          {/* Left: Action & Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Add Images Button */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              multiple 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 mr-1 text-gray-400 hover:text-white bg-bg-0 hover:bg-white/10 border border-white/5 rounded-full transition-all"
              title="Add Images (Max 5)"
            >
              <ImageIcon size={18} />
            </button>

            {/* Model Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'model' ? null : 'model')}
                className={`flex items-center gap-2 border transition-all rounded-full px-4 py-2 text-sm ${activeDropdown === 'model' ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan' : 'bg-bg-0 border-white/5 hover:border-white/20 text-gray-300'}`}
              >
                <Sparkles size={14} className={activeDropdown === 'model' ? 'text-primary-cyan' : 'text-gray-400'} />
                <span className="hidden sm:inline">{t.components.hero.model}: {selectedModel}</span>
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
                <span className="hidden sm:inline">{t.components.hero.mode}: {selectedMode}</span>
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
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'style' ? null : 'style')}
                className={`flex items-center gap-2 border transition-all rounded-full px-4 py-2 text-sm ${activeDropdown === 'style' ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan' : 'bg-bg-0 border-white/5 hover:border-white/20 text-gray-300'}`}
              >
                <span className="hidden sm:inline">{t.components.hero.style}: {selectedStyle}</span>
                <span className="sm:hidden">{selectedStyle}</span>
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
                    {['Comentator Style', 'Coach Style', 'Football Analyst Style'].map((opt) => (
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
          <div className="flex items-center gap-2 shrink-0 ml-auto md:ml-0">
            <button 
              onClick={toggleRecording}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${isRecording ? 'text-red-400 bg-red-400/10 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Mic size={20} />
            </button>
            <button 
              disabled={!isSubmitActive || isLoading}
              onClick={handleSimulate}
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

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-bg-1 border border-white/10 p-1"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={previewImage && previewImage.startsWith('blob:') ? previewImage : ''} alt="Full preview" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
              <button 
                onClick={() => setPreviewImage(null)} 
                className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white rounded-full p-2 border border-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroSearchBox;
