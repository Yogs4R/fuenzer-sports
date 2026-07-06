
import { Globe, UserCircle2 } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-bg-0/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-2">
        {/* Logo Placeholder */}
        <div className="w-8 h-8 rounded bg-primary-cyan shadow-[0_0_15px_rgba(76,215,246,0.4)] flex items-center justify-center">
          <span className="font-bold text-bg-0 text-xl">F</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Fuenzer Sports</span>
      </div>
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <Globe size={18} />
          <span className="text-sm font-medium">EN</span>
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <UserCircle2 size={18} />
          <span className="text-sm font-medium">Sign In</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
