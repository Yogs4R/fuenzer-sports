const PrivacyPage = () => {
  return (
    <div className="min-h-screen relative w-full pt-12 pb-10 flex flex-col items-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-cyan/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-4xl bg-bg-1 border border-white/5 rounded-3xl p-8 relative z-10 shadow-2xl text-left">
        <h1 className="text-3xl font-bold tracking-tight mb-6 text-white">
          Privacy Policy
        </h1>
        <p className="text-gray-400 mb-6 text-xs">Last updated: July 7, 2026</p>
        
        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <p>
            At Fuenzer Sports (accessible from sports.fuenzer.web.id), we prioritize the privacy of our users. This Privacy Policy documents the types of information we collect and record, and how we use it.
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-2">1. Local Storage & Guest First Architecture</h2>
          <p>
            Our application is designed with a <strong>Guest-First</strong> architecture. This means that all of your match simulation inputs, preferences, and workspace settings are saved locally on your device's <code>localStorage</code>. No personal identification data or search query logs are uploaded or stored on our servers unless you explicitly sign up for a user account.
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-2">2. Cookies</h2>
          <p>
            Like any other website, Fuenzer Sports uses session cookies if you choose to authenticate (Sign In). These cookies are only used to manage your login session and secure your custom workspace. We do not use third-party tracking or advertising cookies.
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-2">3. Policy Updates</h2>
          <p>
            We reserve the right to modify this Privacy Policy at any time. Any changes will be updated on this page with an updated modification date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
