import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import TypewriterText from './TypewriterText';
import ProcessingState from './ProcessingState';
import { Mic, ArrowUp, MoreVertical, X, Edit2, Trash2, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeftPanelProps {
  onCloseMobile: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ onCloseMobile }) => {
  const { 
    chatHistory, 
    runSimulation, 
    isLoading, 
    setChatStreamingComplete,
    selectedCompetition,
    selectedModel, setSelectedModel,
    selectedStyle, setSelectedStyle
  } = useAppStore();
  
  const [prompt, setPrompt] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'model' | 'style' | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      runSimulation(prompt.trim(), selectedModel, 'standings');
      setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleRecording = () => {
    if (isRecording) return;
    
    // @ts-ignore
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
      setPrompt(prev => prev ? `${prev} ${transcript}` : transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };
    
    recognition.onend = () => setIsRecording(false);
    
    recognition.start();
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleClearChat = () => {
    // clearSimulationData will be added to store
    // For now, let's just use window.location.reload() or we can add it later
    useAppStore.setState({ chatHistory: [], simulationData: null, mockStep: 0 });
    setIsMenuOpen(false);
  };

  const handleEditTitle = () => {
    // Add logic to edit title, for now just close
    alert("Edit title feature coming soon!");
  };

  return (
    <div className="flex flex-col h-full bg-[#080d1e] border-r border-white/10 relative">
      {/* Header (Desktop & Mobile) */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#050814]/50">
        <div className="flex items-center gap-3 flex-1">
          {/* Mobile Close Button */}
          <button 
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-gray-400 hover:text-white rounded-full bg-white/5"
          >
            <X size={18} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white leading-tight">World Cup Simulation</h2>
              <button onClick={handleEditTitle} className="text-gray-400 hover:text-white transition-colors">
                <Edit2 size={12} />
              </button>
            </div>
            <p className="text-[10px] text-gray-500 font-mono">ID: SIM-4829A • {selectedCompetition}</p>
          </div>
        </div>
        
        {/* Header Actions Menu */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-white p-1 rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-white/20"
          >
            <MoreVertical size={18} />
          </button>
          
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-[#0a1128] border border-white/10 rounded-xl shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
                <button 
                  onClick={handleClearChat}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors flex items-center"
                >
                  <Trash2 size={16} className="mr-2 opacity-70" /> Clear Chat
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6">
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 opacity-60">
            <Sparkles size={32} className="text-primary-cyan mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Ready to explore?</h3>
            <p className="text-sm text-gray-400">Ask a follow-up question or tweak the scenario to see how the simulation responds.</p>
          </div>
        )}
        
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-full mb-1">
                <ProcessingState isCompleted={true} />
              </div>
            )}
            
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm md:text-base wrap-break-word ${
                msg.role === 'user' 
                  ? 'bg-primary-cyan/20 border border-primary-cyan/30 text-white rounded-br-none' 
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'
              }`}
            >
              {msg.role === 'ai' && msg.isStreaming ? (
                <TypewriterText 
                  text={msg.content} 
                  isStreaming={true} 
                  onComplete={() => setChatStreamingComplete(idx)}
                />
              ) : (
                msg.content
              )}
            </div>
            <span className="text-[10px] text-gray-500 mt-1 px-1">
              {msg.role === 'user' ? 'You' : 'Fuenzer AI'}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start w-full">
            <ProcessingState />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0a1128] border-t border-white/10 flex flex-col gap-2">
        {/* Dropdowns */}
        <div className="flex items-center gap-2 px-1">
          <div className="relative">
            <button 
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'model' ? null : 'model')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${activeDropdown === 'model' ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan' : 'bg-[#050814] border-white/10 text-gray-400 hover:text-white'}`}
            >
              <Sparkles size={12} className={activeDropdown === 'model' ? 'text-primary-cyan' : 'text-gray-500'} />
              {selectedModel}
              <ChevronDown size={12} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'model' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  className="absolute bottom-full left-0 mb-2 w-32 bg-[#050814] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20"
                >
                  {['Auto', 'Fast', 'Pro'].map((opt) => (
                    <button key={opt} type="button" onClick={() => { setSelectedModel(opt); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 text-xs transition-colors ${selectedModel === opt ? 'text-primary-cyan bg-primary-cyan/5' : 'text-gray-300 hover:bg-white/5'}`}>{opt}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative">
            <button 
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'style' ? null : 'style')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${activeDropdown === 'style' ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan' : 'bg-[#050814] border-white/10 text-gray-400 hover:text-white'}`}
            >
              {selectedStyle}
              <ChevronDown size={12} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'style' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  className="absolute bottom-full left-0 mb-2 w-48 bg-[#050814] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20"
                >
                  {['Commentator Style', 'Coach Style', 'Football Analyst Style'].map((opt) => (
                    <button key={opt} type="button" onClick={() => { setSelectedStyle(opt); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 text-xs transition-colors ${selectedStyle === opt ? 'text-primary-cyan bg-primary-cyan/5' : 'text-gray-300 hover:bg-white/5'}`}>{opt}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative flex items-center bg-[#050814] rounded-2xl border border-white/10 focus-within:border-primary-cyan/50 transition-colors p-1.5 px-3">
          <button 
            type="button"
            onClick={toggleRecording}
            className={`mr-2 p-1.5 rounded-full transition-colors shrink-0 ${isRecording ? 'text-red-400 animate-pulse bg-red-400/10' : 'text-gray-400 hover:text-white'}`}
          >
            <Mic size={18} />
          </button>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            className="flex-1 max-h-32 min-h-[40px] bg-transparent text-white py-2.5 outline-none resize-none overflow-y-auto scrollbar-hide text-sm flex items-center"
            rows={prompt.split('\n').length > 1 ? Math.min(prompt.split('\n').length, 4) : 1}
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="ml-2 p-2 bg-primary-cyan text-[#050814] rounded-xl shrink-0 disabled:opacity-50 disabled:bg-white/10 disabled:text-gray-500 hover:bg-cyan-400 transition-colors"
          >
            <ArrowUp size={20} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeftPanel;
