import { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import logo from '../../assets/logos/dark/fuenzer-sports-logo-dark.webp';
import { useAppStore } from '../../store/useAppStore';
import { en } from '../../locales/en';
import { id } from '../../locales/id';
import UpdateLogs from './UpdateLogs';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    currentPage, 
    setCurrentPage, 
    language, 
    setLanguage, 
    showNotifications, 
    setShowNotifications 
  } = useAppStore();

  const t = language === 'id' ? id : en;

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: any) => {
    e.preventDefault();
    window.history.pushState(null, '', path);
    setCurrentPage(path);
    setIsOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState(null, '', '/');
      setCurrentPage('/');
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-bg-0/80 backdrop-blur-md border-b border-white/5 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          {/* Left side: Logo */}
          <div className="flex items-center gap-2">
            <a href="/" onClick={handleLogoClick} className="flex items-center gap-2">
              <img 
                src={logo} 
                alt="Fuenzer Sports Logo" 
                className="h-6 sm:h-8 w-auto object-contain"
              />
            </a>
          </div>

          {/* Center: Navigation Links (desktop) - absolute center */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <a 
              href="/" 
              onClick={(e) => handleNavigation(e, '/')}
              className={`font-medium transition-colors ${currentPage === '/' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {t.navbar.home}
            </a>
            <a 
              href="/standings" 
              onClick={(e) => handleNavigation(e, '/standings')}
              className={`font-medium transition-colors ${currentPage === '/standings' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {t.navbar.standings}
            </a>
            <a 
              href="/history" 
              onClick={(e) => handleNavigation(e, '/history')}
              className={`font-medium transition-colors ${currentPage === '/history' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {t.navbar.history}
            </a>
          </div>

          {/* Right side: Language, Notifications, Auth (desktop) & Hamburger Toggle (mobile) */}
          <div className="flex items-center gap-2 sm:gap-6">
            {/* Language Toggle Pill (desktop only) */}
            <div className="hidden lg:flex items-center bg-bg-1 border border-white/10 rounded-full p-1 text-xs font-semibold text-gray-400">
              <button 
                onClick={() => setLanguage('id')}
                className={`px-2.5 py-1 rounded-full transition-all ${language === 'id' ? 'bg-bg-0 text-white' : 'hover:text-white'}`}
              >
                ID
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition-all ${language === 'en' ? 'bg-bg-0 text-white' : 'hover:text-white'}`}
              >
                EN
              </button>
            </div>

            {/* Notification Bell (desktop only) */}
            <button 
              onClick={() => setShowNotifications(true)}
              className="hidden lg:block text-gray-400 hover:text-white transition-colors p-1 relative"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-cyan rounded-full shadow-[0_0_8px_rgba(76,215,246,0.8)]"></span>
            </button>

            {/* Auth Buttons - ALWAYS visible outside hamburger */}
            <div className="flex items-center gap-2 sm:gap-4">
              <a 
                href="/signin" 
                onClick={(e) => handleNavigation(e, '/signin')}
                className={`font-medium text-xs sm:text-sm transition-colors px-2 py-1 ${currentPage === '/signin' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {t.navbar.signIn}
              </a>
              <a 
                href="/signup" 
                onClick={(e) => handleNavigation(e, '/signup')}
                className="bg-primary-cyan text-bg-0 px-3 sm:px-5 py-1.5 rounded-full text-[10px] sm:text-sm font-semibold hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(76,215,246,0.2)]"
              >
                {t.navbar.signUp}
              </a>
            </div>

            {/* Mobile Menu Toggle Button (hamburger / cross) */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
            >
              {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel - open state */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-bg-0 border-b border-white/5 px-8 py-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-4">
              <a 
                href="/" 
                onClick={(e) => handleNavigation(e, '/')}
                className={`font-medium transition-colors ${currentPage === '/' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {t.navbar.home}
              </a>
              <a 
                href="/standings" 
                onClick={(e) => handleNavigation(e, '/standings')}
                className={`font-medium transition-colors ${currentPage === '/standings' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {t.navbar.standings}
              </a>
              <a 
                href="/history" 
                onClick={(e) => handleNavigation(e, '/history')}
                className={`font-medium transition-colors ${currentPage === '/history' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {t.navbar.history}
              </a>
            </div>

            {/* Language and Notification inside mobile menu */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center bg-bg-1 border border-white/10 rounded-full p-1 text-xs font-semibold text-gray-400">
                <button 
                  onClick={() => setLanguage('id')}
                  className={`px-3 py-1 rounded-full transition-all ${language === 'id' ? 'bg-bg-0 text-white' : 'hover:text-white'}`}
                >
                  ID
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-full transition-all ${language === 'en' ? 'bg-bg-0 text-white' : 'hover:text-white'}`}
                >
                  EN
                </button>
              </div>

              <button 
                onClick={() => setShowNotifications(true)}
                className="text-gray-400 hover:text-white transition-colors p-2 bg-bg-1 rounded-full relative"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary-cyan rounded-full shadow-[0_0_8px_rgba(76,215,246,0.8)]"></span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Centered Notifications Modal */}
      <UpdateLogs 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
};

export default Navbar;
