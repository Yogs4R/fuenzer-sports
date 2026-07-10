import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import TypewriterText from './TypewriterText';
import ProcessingState from './ProcessingState';
import { Mic, ArrowUp, MoreVertical, X, Edit2, Trash2, ChevronDown, Sparkles, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    selectedMode,
    selectedStyle, setSelectedStyle,
    simulationTitle
  } = useAppStore();
  
  const [prompt, setPrompt] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'model' | 'style' | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [simId, setSimId] = useState('SIM-....');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setSimId(`SIM-${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: isFirstRender.current ? 'instant' : 'smooth'
      });
      isFirstRender.current = false;
    }
  }, [chatHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      runSimulation(prompt.trim(), selectedModel, selectedMode);
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

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getProcessingTime = (idx: number) => {
    return ((Math.sin(idx + 1) * 1.5) + 2.5).toFixed(1) + 's';
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
              {isEditingTitle ? (
                <input 
                  type="text" 
                  value={simulationTitle} 
                  onChange={(e) => useAppStore.setState({ simulationTitle: e.target.value })} 
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  autoFocus
                  className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded outline-none border border-primary-cyan/50 w-full max-w-[160px]"
                />
              ) : (
                <>
                  <h2 className="text-sm font-bold text-white leading-tight truncate max-w-[160px]" title={simulationTitle}>{simulationTitle}</h2>
                  <button onClick={() => setIsEditingTitle(true)} className="text-gray-400 hover:text-white transition-colors">
                    <Edit2 size={12} />
                  </button>
                </>
              )}
            </div>
            <p className="text-[10px] text-gray-500 font-mono">ID: {simId} • {selectedCompetition}</p>
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
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto scrollbar-custom p-4 space-y-6">
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
              className={`max-w-[92%] rounded-2xl px-3 py-2 text-[10px] md:text-xs wrap-break-word ${
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
              ) : msg.role === 'ai' ? (
                <div className="prose prose-invert max-w-full overflow-x-auto prose-p:leading-relaxed prose-pre:bg-black/20 prose-pre:p-2 prose-pre:rounded-lg prose-a:text-primary-cyan prose-table:border-collapse prose-table:w-full prose-td:border prose-td:border-white/20 prose-td:px-2 prose-td:py-1 prose-th:border prose-th:border-white/20 prose-th:px-2 prose-th:py-1 prose-th:bg-white/10 text-[10px] md:text-xs">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
            
            <div className={`flex items-center gap-2 mt-1 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="text-[10px] text-gray-500">
                {msg.role === 'user' ? 'You' : 'Fuenzer AI'}
              </span>
              {msg.role === 'ai' && (
                <span className="text-[10px] text-gray-500 font-mono">
                  {getProcessingTime(idx)}
                </span>
              )}
              <button 
                onClick={() => handleCopy(msg.content, idx)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
                title="Copy to clipboard"
              >
                {copiedIndex === idx ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
              </button>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start w-full">
            <ProcessingState />
          </div>
        )}
      </div>

      <div className="p-4 bg-[#0a1128] border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex flex-col bg-[#050814] rounded-2xl border border-white/10 focus-within:border-primary-cyan/50 transition-colors p-2 px-3">
          
          <div className="flex items-start w-full">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a follow-up question..."
              className="flex-1 max-h-32 min-h-[40px] bg-transparent text-white py-2 outline-none resize-none overflow-y-auto scrollbar-custom text-sm w-full"
              rows={prompt.split('\n').length > 1 ? Math.min(prompt.split('\n').length, 4) : 1}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={toggleRecording}
                className={`p-1.5 rounded-full transition-colors shrink-0 ${isRecording ? 'text-red-400 animate-pulse bg-red-400/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                title="Voice Input"
              >
                <Mic size={16} />
              </button>
              
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'model' ? null : 'model')}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] md:text-xs font-medium border transition-colors ${activeDropdown === 'model' ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan' : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}
                >
                  <Sparkles size={10} className={activeDropdown === 'model' ? 'text-primary-cyan' : 'text-gray-500'} />
                  {selectedModel}
                  <ChevronDown size={10} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'model' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="absolute bottom-full left-0 mb-2 w-32 bg-[#0a1128] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20"
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
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] md:text-xs font-medium border transition-colors ${activeDropdown === 'style' ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan' : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}
                >
                  {selectedStyle}
                  <ChevronDown size={10} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'style' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="absolute bottom-full left-0 mb-2 w-48 bg-[#0a1128] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20"
                    >
                      {['Commentator Style', 'Coach Style', 'Football Analyst Style'].map((opt) => (
                        <button key={opt} type="button" onClick={() => { setSelectedStyle(opt); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 text-xs transition-colors ${selectedStyle === opt ? 'text-primary-cyan bg-primary-cyan/5' : 'text-gray-300 hover:bg-white/5'}`}>{opt}</button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="p-1.5 bg-primary-cyan text-[#050814] rounded-lg shrink-0 disabled:opacity-50 disabled:bg-white/10 disabled:text-gray-500 hover:bg-cyan-400 transition-colors"
            >
              <ArrowUp size={16} strokeWidth={2.5} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeftPanel;
