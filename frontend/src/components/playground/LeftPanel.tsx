import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import TypewriterText from './TypewriterText';
import ProcessingState from './ProcessingState';
import { Mic, ArrowUp, MoreVertical, X } from 'lucide-react';

interface LeftPanelProps {
  onCloseMobile: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ onCloseMobile }) => {
  const { chatHistory, runSimulation, isLoading, setChatStreamingComplete } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      runSimulation(prompt.trim(), 'auto', 'standings');
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

  return (
    <div className="flex flex-col h-full bg-[#080d1e] border-r border-white/10 relative">
      {/* Header (Desktop & Mobile) */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#050814]/50">
        <div className="flex items-center gap-3">
          {/* Mobile Close Button */}
          <button 
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-gray-400 hover:text-white rounded-full bg-white/5"
          >
            <X size={18} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">World Cup Simulation</h2>
            <p className="text-[10px] text-gray-500 font-mono">ID: SIM-4829A • Group Stage</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white p-1 rounded-full transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
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
      <div className="p-4 bg-[#0a1128] border-t border-white/10">
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
        <div className="text-center mt-2 hidden md:block">
          <span className="text-[10px] text-gray-500">Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
