import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

const CookieConsent: React.FC = () => {
  const { cookieConsent, setCookieConsent, language } = useAppStore();

  useEffect(() => {
    if (cookieConsent === true) {
      injectGoogleAnalytics();
    }
  }, [cookieConsent]);

  const injectGoogleAnalytics = () => {
    // Prevent multiple injections
    if (document.getElementById('ga-script')) return;

    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=G-W9KS5F0H1N`;
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.id = 'ga-inline-script';
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-W9KS5F0H1N');
    `;
    document.head.appendChild(inlineScript);
  };

  const handleAccept = () => {
    setCookieConsent(true);
  };

  const handleReject = () => {
    setCookieConsent(false);
  };

  return (
    <AnimatePresence>
      {cookieConsent === null && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 p-5 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl z-50 shadow-2xl"
        >
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-white font-semibold font-inter mb-1">
                {language === 'id' ? 'Pengaturan Cookie' : 'Cookie Settings'}
              </h3>
              <p className="text-gray-400 text-sm font-inter leading-relaxed">
                {language === 'id' 
                  ? 'Kami menggunakan cookie Google Analytics untuk memahami bagaimana Anda berinteraksi dengan aplikasi kami guna meningkatkan pengalaman Anda. Apakah Anda mengizinkan?'
                  : 'We use Google Analytics cookies to understand how you interact with our app and improve your experience. Do you accept?'}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleReject}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors font-inter"
              >
                {language === 'id' ? 'Tolak' : 'Reject'}
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all font-inter"
              >
                {language === 'id' ? 'Terima' : 'Accept'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
