import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

const CookieConsent: React.FC = () => {
  const { cookieConsent, setCookieConsent, language, setCurrentPage } = useAppStore();

  useEffect(() => {
    // We update gtag consent dynamically here using the global gtag function
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const gtag = (window as any).gtag;
      if (cookieConsent === true) {
        gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted',
          'personalization_storage': 'granted'
        });
      } else if (cookieConsent === false) {
        gtag('consent', 'update', {
          'analytics_storage': 'denied',
          'ad_storage': 'denied',
          'personalization_storage': 'denied'
        });
      }
    }
  }, [cookieConsent]);

  const handleAccept = () => {
    setCookieConsent(true);
  };

  const handleReject = () => {
    setCookieConsent(false);
  };

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: any) => {
    e.preventDefault();
    window.history.pushState(null, '', path);
    setCurrentPage(path);
  };

  return (
    <AnimatePresence>
      {cookieConsent === null && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
          className="fixed bottom-0 left-0 right-0 w-full py-4 px-6 md:px-12 border-t border-white/5 bg-bg-0/85 backdrop-blur-md z-50 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-gray-300 text-xs md:text-sm font-inter text-center md:text-left">
            {language === 'id' ? (
              <>
                Situs web ini menggunakan cookie untuk memberikan pengalaman terbaik. Untuk informasi lebih lanjut, silakan baca{' '}
                <a 
                  href="/privacy" 
                  onClick={(e) => handleNavigation(e, '/privacy')} 
                  className="text-primary-cyan hover:underline font-semibold"
                >
                  Kebijakan Privasi
                </a>{' '}
                kami.
              </>
            ) : (
              <>
                This website uses cookies to provide the best experience. For more information, please read our{' '}
                <a 
                  href="/privacy" 
                  onClick={(e) => handleNavigation(e, '/privacy')} 
                  className="text-primary-cyan hover:underline font-semibold"
                >
                  Privacy Policy
                </a>
                .
              </>
            )}
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleReject}
              className="px-6 py-2 rounded-full border border-white/10 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-inter"
            >
              {language === 'id' ? 'Tolak' : 'Reject'}
            </button>
            <button
              onClick={handleAccept}
              className="bg-primary-cyan text-bg-0 px-6 py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-cyan-300 transition-all font-inter shadow-[0_0_15px_rgba(76,215,246,0.2)]"
            >
              {language === 'id' ? 'Setuju' : 'Accept'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
