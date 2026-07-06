import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { en } from '../../locales/en';
import { id } from '../../locales/id';

interface UpdateLogsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateLogs: React.FC<UpdateLogsProps> = ({ isOpen, onClose }) => {
  const { language } = useAppStore();
  const t = language === 'id' ? id : en;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bg-0/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-bg-1 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative z-10 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
          <h3 className="text-lg font-bold text-white">
            {t.notifications.title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable logs list */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-5">
          {t.notifications.updates.map((update, idx) => (
            <div key={idx} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between text-sm text-primary-cyan font-semibold mb-1">
                <span>{update.title}</span>
                <span className="text-[11px] text-gray-500 font-normal">{update.date}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {update.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default UpdateLogs;
