

const BelowTheFold: React.FC = () => {
  return (
    <div className="w-full mt-32 relative z-10 flex flex-col items-center">
      
      {/* Statistics Bar */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-y border-white/5 py-12 mb-32 px-4">
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

      {/* Video/GIF Demo Placeholder */}
      <div className="w-full max-w-5xl mx-auto mb-32 px-4">
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
