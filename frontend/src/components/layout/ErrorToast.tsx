import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const ErrorToast: React.FC = () => {
  const { error, clearError } = useAppStore();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Translate technical errors into friendly ones
  let friendlyError = error || '';
  if (friendlyError.includes('Failed to fetch')) {
    friendlyError = 'The stadium lights went out! Please check your connection and try again.';
  } else if (friendlyError.includes('Internal Server Error') || friendlyError.includes('500')) {
    friendlyError = 'The referee blew the whistle on our servers. The AI needs a quick breather, please retry!';
  } else if (friendlyError.includes('timeout')) {
    friendlyError = 'The match went to extra time and we timed out! Please try again.';
  }

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-[#1a0505] border border-red-500/30 rounded-2xl shadow-[0_10px_40px_rgba(239,68,68,0.2)] max-w-[90vw] md:max-w-md w-full"
        >
          <div className="shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle size={18} className="text-red-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-red-200">Oops, something went wrong</h4>
            <p className="text-xs text-red-400/80 mt-0.5">{friendlyError}</p>
          </div>
          <button 
            onClick={clearError}
            className="shrink-0 p-1.5 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorToast;
