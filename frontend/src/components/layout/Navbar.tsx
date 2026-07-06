import { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import logo from '../../assets/logos/dark/fuenzer-sports-logo-dark.webp';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-bg-0/80 backdrop-blur-md border-b border-white/5 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Left side: Logo */}
        <div className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="Fuenzer Sports Logo" 
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Center: Navigation Links (desktop) - absolute center */}
        <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
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

        {/* Right side: Language, Notifications, Auth (desktop) & Hamburger Toggle (mobile) */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Language Toggle Pill (desktop only) */}
          <div className="hidden lg:flex items-center bg-bg-1 border border-white/10 rounded-full p-1 text-xs font-semibold text-gray-400">
            <button className="px-2.5 py-1 rounded-full bg-bg-0 text-white">ID</button>
            <button className="px-2.5 py-1 rounded-full hover:text-white transition-colors">EN</button>
          </div>

          {/* Notification Bell (desktop only) */}
          <button className="hidden lg:block text-gray-400 hover:text-white transition-colors p-1 relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-cyan rounded-full shadow-[0_0_8px_rgba(76,215,246,0.8)]"></span>
          </button>

          {/* Auth Buttons - ALWAYS visible outside hamburger */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="text-gray-400 hover:text-white font-medium text-sm transition-colors">
              Sign In
            </button>
            <button className="bg-primary-cyan text-bg-0 px-3.5 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(76,215,246,0.2)]">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Toggle Button (hamburger / cross) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel - open state */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-bg-0 border-b border-white/5 px-8 py-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-4">
            <a 
              href="#home" 
              onClick={() => setIsOpen(false)}
              className="text-white font-medium hover:text-primary-cyan transition-colors"
            >
              Home
            </a>
            <a 
              href="#standings" 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 font-medium hover:text-white transition-colors"
            >
              Standings
            </a>
            <a 
              href="#history" 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 font-medium hover:text-white transition-colors"
            >
              History
            </a>
          </div>

          {/* Language and Notification inside mobile menu */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center bg-bg-1 border border-white/10 rounded-full p-1 text-xs font-semibold text-gray-400">
              <button className="px-3 py-1 rounded-full bg-bg-0 text-white">ID</button>
              <button className="px-3 py-1 rounded-full hover:text-white transition-colors">EN</button>
            </div>

            <button className="text-gray-400 hover:text-white transition-colors p-2 bg-bg-1 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-cyan rounded-full shadow-[0_0_8px_rgba(76,215,246,0.8)]"></span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
