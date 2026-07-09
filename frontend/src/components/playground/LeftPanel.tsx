import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import TypewriterText from './TypewriterText';

interface LeftPanelProps {
  onCloseMobile: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ onCloseMobile }) => {
  const { chatHistory, runSimulation, isLoading, setChatStreamingComplete } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex flex-col h-full bg-[#080d1e] border-r border-white/10 relative">
      {/* Mobile Header / Close Button */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-bold text-white">AI Chat</h2>
        <button 
          onClick={onCloseMobile}
          className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
            <span className="text-xs text-gray-500 mt-1 px-1">
              {msg.role === 'user' ? 'You' : 'Fuenzer AI'}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="bg-white/5 border border-white/10 text-gray-400 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-2">
              <span className="animate-pulse w-2 h-2 bg-primary-cyan rounded-full"></span>
              <span className="animate-pulse delay-75 w-2 h-2 bg-primary-cyan rounded-full"></span>
              <span className="animate-pulse delay-150 w-2 h-2 bg-primary-cyan rounded-full"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0a1128] border-t border-white/10">
        <form onSubmit={handleSubmit} className="relative flex items-end bg-[#050814] rounded-xl border border-white/10 focus-within:border-primary-cyan/50 transition-colors p-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            className="flex-1 max-h-32 min-h-[44px] bg-transparent text-white p-2 outline-none resize-none overflow-y-auto text-sm"
            rows={prompt.split('\\n').length > 1 ? Math.min(prompt.split('\\n').length, 4) : 1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="ml-2 mb-1 p-2 bg-primary-cyan text-[#050814] rounded-lg disabled:opacity-50 hover:bg-cyan-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="text-[10px] text-gray-500">Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
