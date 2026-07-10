import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { id } from '../locales/id';
import { en } from '../locales/en';
import { Trash2, MessageSquare, Clock, Trophy, Target, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSEO } from '../hooks/useSEO';

const HistoryPage = () => {
  useSEO({ title: 'Fuenzer Sports | History' });
  const { language, savedSessions, deleteSession, loadSession, setCurrentPage } = useAppStore();
  const t = language === 'id' ? id : en;
  
  const [currentPage, setPage] = useState(1);
  const itemsPerPage = 10;
  
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const totalPages = Math.ceil(savedSessions.length / itemsPerPage);
  const currentSessions = savedSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenSession = (sessionId: string) => {
    loadSession(sessionId);
    setCurrentPage('/playground');
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete);
      setSessionToDelete(null);
      // Adjust pagination if needed
      if (currentSessions.length === 1 && currentPage > 1) {
        setPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="min-h-screen relative w-full pt-32 pb-20 flex flex-col items-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-cyan/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-4xl bg-bg-1 border border-white/5 rounded-3xl p-6 md:p-8 relative z-10 shadow-2xl flex flex-col min-h-[500px]">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-white text-center">
          {t.navbar.history}
        </h1>
        <p className="text-gray-400 mb-8 text-sm text-center max-w-2xl mx-auto">
          {t.pages.history.subtitle}
        </p>

        {savedSessions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-bg-0 text-gray-500 text-sm py-16">
            {t.pages.history.empty}
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <div className="space-y-3 flex-1">
              {currentSessions.map((session) => (
                <div 
                  key={session.id} 
                  onClick={() => handleOpenSession(session.id)}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-bg-0 border border-white/5 hover:border-primary-cyan/30 hover:bg-white/5 transition-all cursor-pointer"
                >
                  <div className="flex flex-col gap-2 overflow-hidden mr-4">
                    <h3 className="text-white font-bold truncate group-hover:text-primary-cyan transition-colors">
                      {session.title || "World Cup Simulation"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono">
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(session.date).toLocaleString(language === 'id' ? 'id-ID' : 'en-US')}</span>
                      <span className="flex items-center gap-1"><Trophy size={12} /> {session.competition}</span>
                      <span className="flex items-center gap-1"><Target size={12} /> {session.mode}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={12} /> {session.chatHistory.length} msgs</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 self-end md:self-auto shrink-0">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSessionToDelete(session.id);
                      }}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-white/5">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {sessionToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSessionToDelete(null)}
            ></motion.div>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 10 }} 
              className="bg-bg-1 border border-white/10 p-6 rounded-2xl shadow-2xl relative z-10 w-full max-w-sm"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Delete History</h3>
                <p className="text-sm text-gray-400 mb-6">Are you sure you want to delete this simulation session? This action cannot be undone.</p>
                
                <div className="flex w-full gap-3">
                  <button 
                    onClick={() => setSessionToDelete(null)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white transition-colors font-medium text-sm shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoryPage;
