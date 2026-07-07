import logo from '../../assets/logos/dark/fuenzer-sports-logo-dark.webp';
import { Mail } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const Footer = () => {
  const { setCurrentPage } = useAppStore();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: any) => {
    e.preventDefault();
    window.history.pushState(null, '', path);
    setCurrentPage(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState(null, '', '/');
      setCurrentPage('/');
    }
  };

  return (
    <footer className="w-full border-t border-white/5 bg-bg-0 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/5">
        
        {/* Left Col: Logo & Description */}
        <div className="flex flex-col gap-4">
          <a href="/" onClick={handleLogoClick} className="self-start">
            <img 
              src={logo} 
              alt="Fuenzer Sports Logo" 
              className="h-8 w-auto object-contain"
            />
          </a>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            The leading sports intelligence platform. Simulating match outcomes with modern AI computational power to provide limitless insights.
          </p>
        </div>

        {/* Column 2: Navigation */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold text-white tracking-wide uppercase">Navigation</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
            <li>
              <a href="/" onClick={(e) => handleNavigation(e, '/')} className="hover:text-primary-cyan transition-colors">Home</a>
            </li>
            <li>
              <a href="/standings" onClick={(e) => handleNavigation(e, '/standings')} className="hover:text-primary-cyan transition-colors">Standings</a>
            </li>
            <li>
              <a href="/history" onClick={(e) => handleNavigation(e, '/history')} className="hover:text-primary-cyan transition-colors">History</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold text-white tracking-wide uppercase">Legal</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
            <li>
              <a href="/terms" onClick={(e) => handleNavigation(e, '/terms')} className="hover:text-primary-cyan transition-colors">Terms & Conditions</a>
            </li>
            <li>
              <a href="/privacy" onClick={(e) => handleNavigation(e, '/privacy')} className="hover:text-primary-cyan transition-colors">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold text-white tracking-wide uppercase">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-gray-400">
            <a href="mailto:fuenzerofficial@gmail.com" className="flex items-center gap-2 hover:text-primary-cyan transition-colors">
              <Mail size={16} />
              <span>fuenzerofficial@gmail.com</span>
            </a>
            
            <a 
              href="https://github.com/Yogs4R/fuenzer-sports" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2 bg-bg-1 border border-white/10 hover:border-primary-cyan/50 hover:bg-bg-1/80 transition-all rounded-xl py-2.5 px-4 text-white font-medium self-start text-xs mt-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
              </svg>
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div>
          © 2026 Fuenzer Sports. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <span>Version 0.0.1</span>
          <span className="flex items-center gap-1.5">
            Server Status: 
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-500 font-semibold">Online</span>
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
