const TermsPage = () => {
  return (
    <div className="min-h-screen relative w-full pt-32 pb-20 flex flex-col items-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-cyan/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-4xl bg-bg-1 border border-white/5 rounded-3xl p-8 relative z-10 shadow-2xl text-left">
        <h1 className="text-3xl font-bold tracking-tight mb-6 text-white">
          Terms & Conditions
        </h1>
        <p className="text-gray-400 mb-6 text-xs">Last updated: July 7, 2026</p>
        
        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <p>
            Welcome to Fuenzer Sports. By accessing and using sports.fuenzer.web.id, you accept and agree to be bound by the terms and provisions of this agreement.
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-2">1. Use License & Intellectual Property</h2>
          <p>
            Fuenzer Sports grants you a temporary, personal license to run Monte Carlo sports simulations for analysis and entertainment purposes. All analytical outputs, simulation logic models, and visual designs remain the property of Fuenzer Sports.
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-2">2. Simulation Disclaimer</h2>
          <p>
            All tournament predictions, standings probabilities, and simulated match outcomes are calculated using randomized statistical modeling (Monte Carlo method). Fuenzer Sports does not guarantee 100% predictive accuracy. Outputs should NOT be used as financial, betting, or investment advice.
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-2">3. API Usage Limits</h2>
          <p>
            You agree not to exploit, spam, scrape, or perform denial-of-service attacks on our backend FastAPI endpoints. Rate limiting policies are enforced on guest and member profiles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
