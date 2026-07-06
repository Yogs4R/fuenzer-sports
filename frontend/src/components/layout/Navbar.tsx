import { Bell } from 'lucide-react';
import logo from '../../assets/logos/dark/fuenzer-sports-logo-dark.webp';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-bg-0/80 backdrop-blur-md border-b border-white/5">
      {/* Left side: Logo */}
      <div className="flex items-center gap-2">
        <img 
          src={logo} 
          alt="Fuenzer Sports Logo" 
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#home" className="text-white font-medium hover:text-primary-cyan transition-colors">
          Home
        </a>
        <a href="#standings" className="text-gray-400 font-medium hover:text-white transition-colors">
          Standings
        </a>
        <a href="#history" className="text-gray-400 font-medium hover:text-white transition-colors">
          History
        </a>
      </div>

      {/* Right side: Language, Notifications, Auth */}
      <div className="flex items-center gap-6">
        {/* Language Toggle Pill */}
        <div className="flex items-center bg-bg-1 border border-white/10 rounded-full p-1 text-xs font-semibold text-gray-400">
          <button className="px-2.5 py-1 rounded-full bg-bg-0 text-white">ID</button>
          <button className="px-2.5 py-1 rounded-full hover:text-white transition-colors">EN</button>
        </div>

        {/* Notification Bell */}
        <button className="text-gray-400 hover:text-white transition-colors p-1 relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-cyan rounded-full shadow-[0_0_8px_rgba(76,215,246,0.8)]"></span>
        </button>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white font-medium text-sm transition-colors">
            Sign In
          </button>
          <button className="bg-primary-cyan text-bg-0 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(76,215,246,0.2)]">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
