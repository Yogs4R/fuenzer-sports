import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, X, LogOut, Trash2, User, AlertTriangle } from 'lucide-react';
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
    setShowNotifications,
    user,
    signOutUser,
    deleteUserAccount,
    isAuthLoading
  } = useAppStore();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

            {/* Auth Buttons / User Profile */}
            <div className="flex items-center gap-2 sm:gap-4 relative" ref={dropdownRef}>
              {user ? (
                <>
                  <button 
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-bg-1 border border-primary-cyan/30 overflow-hidden hover:border-primary-cyan transition-colors focus:outline-none"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} className="text-gray-400" />
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute top-full mt-2 right-0 w-64 bg-bg-1 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="p-4 border-b border-white/5 bg-white/5">
                        <p className="text-sm font-bold text-white truncate">{user.displayName || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="p-2 flex flex-col">
                        <button 
                          onClick={() => {
                            signOutUser();
                            setShowProfileDropdown(false);
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                        >
                          <LogOut size={16} />
                          Log Out
                        </button>
                        <button 
                          onClick={() => {
                            setShowDeleteConfirm(true);
                            setShowProfileDropdown(false);
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-left mt-1"
                        >
                          <Trash2 size={16} />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : isAuthLoading ? (
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Mobile Menu Toggle Button (hamburger / cross) */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
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
      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-bg-0 border border-red-500/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Account?</h3>
              <p className="text-sm text-gray-400 mb-6">
                This action is permanent and cannot be undone. All your saved sessions and data will be lost forever.
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={async () => {
                    await deleteUserAccount();
                    setShowDeleteConfirm(false);
                    setCurrentPage('/');
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                >
                  Yes, Delete My Account
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full py-2.5 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
