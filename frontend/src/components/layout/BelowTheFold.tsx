const BelowTheFold: React.FC = () => {
  const brands = [
    { name: 'Football-Data', logo: '/src/assets/images/football-data.webp' },
    { name: 'AMD', logo: '/src/assets/images/amd.webp' },
    { name: 'lablab.ai', logo: '/src/assets/images/lablab-ai.webp' },
    { name: 'Google Gemma', logo: '/src/assets/images/google-gemma.webp' },
    { name: 'Fireworks AI', logo: '/src/assets/images/fireworks-ai.webp' },
  ];

  return (
    <div className="w-full mt-32 relative z-10 flex flex-col items-center">
      
      {/* Brand Carousel */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee-container:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}} />
      <div className="w-full bg-bg-0 border-y border-white/5 py-8 mb-20 shadow-lg overflow-hidden relative animate-marquee-container">
        <div className="max-w-6xl mx-auto px-4 mb-8 text-center text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Supported & Powered by
        </div>
        <div className="flex overflow-hidden w-full select-none">
          {/* Set 1 */}
          <div className="animate-marquee flex items-center shrink-0 justify-around min-w-full py-2 gap-12 px-6">
            {brands.map((brand, i) => (
              <div key={i} className="flex items-center justify-center h-8 px-6 opacity-40 hover:opacity-80 transition-opacity">
                <img src={brand.logo} alt={brand.name} className="h-full w-auto object-contain max-w-[120px]" onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentNode;
                  if (parent && !parent.querySelector('.fallback-text')) {
                    const textNode = document.createElement('span');
                    textNode.className = 'fallback-text text-gray-400 font-bold tracking-wider text-sm';
                    textNode.innerText = brand.name;
                    parent.appendChild(textNode);
                  }
                }} />
              </div>
            ))}
          </div>
          {/* Set 2 (Duplicate for Seamless Loop) */}
          <div className="animate-marquee flex items-center shrink-0 justify-around min-w-full py-2 gap-12 px-6" aria-hidden="true">
            {brands.map((brand, i) => (
              <div key={`dup-${i}`} className="flex items-center justify-center h-8 px-6 opacity-40 hover:opacity-80 transition-opacity">
                <img src={brand.logo} alt={brand.name} className="h-full w-auto object-contain max-w-[120px]" onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentNode;
                  if (parent && !parent.querySelector('.fallback-text')) {
                    const textNode = document.createElement('span');
                    textNode.className = 'fallback-text text-gray-400 font-bold tracking-wider text-sm';
                    textNode.innerText = brand.name;
                    parent.appendChild(textNode);
                  }
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video/GIF Demo Placeholder */}
      <div className="w-full max-w-5xl mx-auto mb-20 px-4">
        <div className="aspect-video w-full rounded-2xl bg-bg-1 border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-tr from-bg-0/80 to-transparent z-10"></div>
          <div className="text-center z-20">
            <div className="w-16 h-16 rounded-full bg-primary-cyan/20 flex items-center justify-center mx-auto mb-4 border border-primary-cyan/30 backdrop-blur-sm cursor-pointer hover:bg-primary-cyan/30 transition-all">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary-cyan border-b-8 border-b-transparent ml-1"></div>
            </div>
            <span className="text-gray-300 font-medium tracking-wide">Watch Platform Demo</span>
          </div>
        </div>
      </div>

      {/* Statistics Bar (Full-Width Background) */}
      <div className="w-full bg-bg-0 border-y border-white/5 py-12 mb-32 shadow-lg">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
          <div>
            <h3 className="text-5xl font-bold font-mono text-white mb-2">10,000+</h3>
            <p className="text-gray-400">Monte Carlo Iterations</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold font-mono text-white mb-2">48</h3>
            <p className="text-gray-400">Teams Simulated</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold font-mono text-white mb-2">&lt;2s</h3>
            <p className="text-gray-400">Average Prediction Time</p>
          </div>
        </div>
      </div>

      {/* Features & Benefits */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 px-8">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-white">Why Fuenzer Sports?</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            Our platform leverages advanced statistical modeling and machine learning to provide you with the most accurate sports tournament predictions available on the market.
          </p>
          <ul className="space-y-4">
            {['Vectorized NumPy Engine', 'Real-time API Integration', 'Strict FIFA Rules Engine'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-cyan/20 flex items-center justify-center text-primary-cyan text-xs">✓</div>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-bg-1 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-cyan/20 rounded-full blur-[80px]"></div>
          <h3 className="text-xl font-semibold mb-4 text-white">AMD Hackathon Power</h3>
          <p className="text-gray-400 mb-6 relative z-10">
            Optimized for maximum computational throughput, our Monte Carlo engine performs thousands of complex match simulations in milliseconds, leaving competitors in the dust.
          </p>
        </div>
      </div>

    </div>
  );
};

export default BelowTheFold;
