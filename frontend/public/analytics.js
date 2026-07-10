if (window.trustedTypes && window.trustedTypes.createPolicy) {
  try {
    window.trustedTypes.createPolicy('default', {
      createHTML: (string) => string,
      createScript: (string) => string,
      createScriptURL: (string) => string,
    });
  } catch (e) {}
}

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

try {
  const storeStr = localStorage.getItem('fuenzer-storage');
  let isAccepted = false;
  if (storeStr) {
    const store = JSON.parse(storeStr);
    isAccepted = store.state?.cookieConsent === true;
  }
  
  gtag('consent', 'default', {
    'analytics_storage': isAccepted ? 'granted' : 'denied',
    'ad_storage': isAccepted ? 'granted' : 'denied',
    'personalization_storage': isAccepted ? 'granted' : 'denied',
    'functionality_storage': 'granted',
    'security_storage': 'granted'
  });
} catch (e) {
  gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'personalization_storage': 'denied',
    'functionality_storage': 'granted',
    'security_storage': 'granted'
  });
}

gtag('js', new Date());
gtag('config', 'G-W9KS5F0H1N');
