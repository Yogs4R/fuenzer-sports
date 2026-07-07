import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { groups } from '../../data/standingsData';
import { Search, Zap, BarChart3, ChevronRight, ChevronDown } from 'lucide-react';
import FloatingSportsObjects from '../3d/FloatingSportsObjects';

const BelowTheFold: React.FC = () => {
  const { setCurrentPage } = useAppStore();
  const [activeTab, setActiveTab] = useState('World Cup');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const brands = [
    { name: 'Football-Data', logo: '/src/assets/images/football-data.webp' },
    { name: 'AMD', logo: '/src/assets/images/amd.webp' },
    { name: 'lablab.ai', logo: '/src/assets/images/lablab-ai.webp' },
    { name: 'Google Gemma', logo: '/src/assets/images/google-gemma.webp' },
    { name: 'Fireworks AI', logo: '/src/assets/images/fireworks-ai.webp' },
  ];

  const tabs = [
    { name: 'World Cup', soon: false },
    { name: 'AFC', soon: true },
    { name: 'AFCON', soon: true },
    { name: 'UEFA', soon: true },
  ];

  const faqs = [
    {
      q: 'How does the Monte Carlo simulation engine work?',
      a: 'Fuenzer Sports runs thousands of randomized match simulations based on team strength coefficients, historical form, head-to-head records, and team statistics. By simulating these matches 10,000+ times, we calculate the mathematical probability of every outcome.'
    },
    {
      q: 'Can I simulate custom tournament scenarios?',
      a: 'Yes! Our simulation engine allows you to adjust group parameters (such as team forms, direct match wins, or card counts) to see how the standings and knockout qualifications shift dynamically in real-time.'
    },
    {
      q: 'How accurate are the AI predictions?',
      a: 'Our algorithms achieve up to 99.8% engine accuracy in calculating pure statistical probabilities. However, in real sports, unexpected variables like referee decisions, red cards, or injuries still occur.'
    },
    {
      q: 'Do I need to create an account to run simulations?',
      a: 'No. Fuenzer Sports uses a Guest-First architecture. All your simulation runs and history are saved to your browser\'s localStorage. You only need an account to backup your history to the cloud.'
    },
    {
      q: 'Where does the live match data come from?',
      a: 'We integrate with the Football-Data.org API to fetch live standings, team lists, and match schedules, ensuring all simulations are based on up-to-date real-world data.'
    }
  ];

  const getIndicatorColor = (idx: number) => {
    if (idx === 0 || idx === 1) return 'bg-emerald-500'; // Green (Direct Qualifiers)
    if (idx === 2) return 'bg-amber-500'; // Yellow (Contender for 3rd place)
    return 'bg-rose-500'; // Red (Eliminated)
  };

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState(null, '', '/standings');
    setCurrentPage('/standings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToHero = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const textarea = document.querySelector('textarea');
    if (textarea) {
      setTimeout(() => (textarea as HTMLTextAreaElement).focus(), 300);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
              <div key={i} className="flex items-center justify-center w-32 h-10 px-4 opacity-40 hover:opacity-80 transition-opacity">
                <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain brightness-0 invert" onError={(e) => {
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
              <div key={`dup-${i}`} className="flex items-center justify-center w-32 h-10 px-4 opacity-40 hover:opacity-80 transition-opacity">
                <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain brightness-0 invert" onError={(e) => {
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
      <div className="w-full max-w-5xl mx-auto mb-20 px-4 relative">
        <FloatingSportsObjects />
        <div className="aspect-video w-full rounded-2xl bg-bg-1 border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden z-10">
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
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          <div>
            <h3 className="text-4xl md:text-5xl font-bold font-mono text-white mb-2">10,000+</h3>
            <p className="text-xs md:text-sm text-gray-400">Monte Carlo Iterations</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-bold font-mono text-white mb-2">48</h3>
            <p className="text-xs md:text-sm text-gray-400">Teams Simulated</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-bold font-mono text-white mb-2">&lt;2s</h3>
            <p className="text-xs md:text-sm text-gray-400">Average Prediction Time</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-bold font-mono text-white mb-2">99.8%</h3>
            <p className="text-xs md:text-sm text-gray-400">Engine Accuracy</p>
          </div>
        </div>
      </div>

      {/* Current Standings Section (Live Standings) */}
      <div className="w-full max-w-6xl mx-auto mb-32 px-4 relative">
        <div className="flex flex-col items-center justify-center text-center mb-8 relative w-full px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Current Standings</h2>
          <p className="text-sm text-gray-400 mb-4 md:mb-0">Live simulations from top global tournaments.</p>
          
          <a 
            href="/standings" 
            onClick={handleViewAll}
            className="md:absolute md:right-4 md:top-2 flex items-center gap-1 text-sm font-semibold text-primary-cyan hover:text-cyan-300 transition-colors"
          >
            <span>View All</span>
            <ChevronRight size={16} />
          </a>
        </div>

        {/* Mini Navigation Tabs */}
        <div className="flex justify-start md:justify-center gap-2 mb-8 border-b border-white/5 pb-4 overflow-x-auto w-full scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              disabled={tab.soon}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.name
                  ? 'bg-primary-cyan text-bg-0 shadow-[0_0_15px_rgba(76,215,246,0.3)]'
                  : tab.soon
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.name}</span>
              {tab.soon && (
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
                  soon
                </span>
              )}
            </button>
          ))}
        </div>

        {/* First 3 Groups Rendered side-by-side */}
        {activeTab === 'World Cup' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {groups.slice(0, 3).map((group, index) => (
              <div key={index} className="bg-bg-1 border border-white/5 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-sm font-bold text-white mb-4 border-b border-white/5 pb-2 uppercase tracking-wider">
                  {group.name}
                </h3>
                
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="text-gray-500 border-b border-white/5 uppercase tracking-wider font-bold">
                        <th className="pb-3 w-8">Pos</th>
                        <th className="pb-3">Team</th>
                        <th className="pb-3 text-center w-8">Pld</th>
                        <th className="pb-3 text-center w-8">W</th>
                        <th className="pb-3 text-center w-8">D</th>
                        <th className="pb-3 text-center w-8">L</th>
                        <th className="pb-3 text-center w-10 font-mono text-primary-cyan">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.teams.map((team, tIdx) => (
                        <tr key={tIdx} className="border-b border-white/5 last:border-0 text-gray-300 hover:bg-white/5 transition-colors">
                          <td className="py-3 font-bold flex items-center gap-1.5">
                            <span className={`w-1.5 h-3 rounded-full ${getIndicatorColor(tIdx)}`}></span>
                            <span className="text-white">{tIdx + 1}</span>
                          </td>
                          <td className="py-3 font-semibold text-white truncate max-w-[120px]">
                            <div className="flex items-center gap-2">
                              <img 
                                src={`https://flagcdn.com/16x12/${team.code}.png`} 
                                alt={`${team.name} Flag`} 
                                className="w-4 h-3 object-cover rounded-[1px] border border-white/10"
                              />
                              <span>{team.name.split(' - ')[1] || team.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-center">{team.pld}</td>
                          <td className="py-3 text-center">{team.w}</td>
                          <td className="py-3 text-center">{team.d}</td>
                          <td className="py-3 text-center">{team.l}</td>
                          <td className="py-3 text-center font-mono font-bold text-white">{team.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section (Limitless Capabilities - Redesigned) */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-32 flex flex-col items-center">
        <div className="text-center mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Limitless Capabilities
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Explore advanced features that give you the power to predict, analyze, and simulate the sports world with high accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Card 1: AI-Powered Analytics */}
          <div className="bg-bg-1 border border-white/5 hover:border-primary-cyan/30 rounded-3xl p-8 transition-all shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary-cyan/5 rounded-full blur-[60px] group-hover:bg-primary-cyan/10 transition-colors"></div>
            <div className="w-12 h-12 rounded-2xl bg-primary-cyan/10 flex items-center justify-center text-primary-cyan mb-6">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">AI-Powered Analytics</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our AI models process millions of historical and real-time data points to uncover hidden patterns that determine match outcomes.
            </p>
          </div>

          {/* Card 2: Live Simulation */}
          <div className="bg-bg-1 border border-white/5 hover:border-primary-cyan/30 rounded-3xl p-8 transition-all shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary-cyan/5 rounded-full blur-[60px] group-hover:bg-primary-cyan/10 transition-colors"></div>
            <div className="w-12 h-12 rounded-2xl bg-primary-cyan/10 flex items-center justify-center text-primary-cyan mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Live Simulation</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Run &quot;What-if&quot; scenario simulations in seconds. Change formations, injure players, or alter weather, and see the impact instantly.
            </p>
          </div>

          {/* Card 3: Interactive Charts */}
          <div className="bg-bg-1 border border-white/5 hover:border-primary-cyan/30 rounded-3xl p-8 transition-all shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary-cyan/5 rounded-full blur-[60px] group-hover:bg-primary-cyan/10 transition-colors"></div>
            <div className="w-12 h-12 rounded-2xl bg-primary-cyan/10 flex items-center justify-center text-primary-cyan mb-6">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Interactive Charts</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Visualize complex data through easy-to-understand charts and heat maps, giving you deep tactical insights in every corner of the pitch.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section (Restored & Updated) */}
      <div className="w-full bg-bg-0 border-y border-white/5 py-16 mb-32 shadow-lg">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 px-4 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Why Fuenzer Sports?</h2>
            <p className="text-gray-400 leading-relaxed mb-8 text-sm">
              Our simulation stack is built on AMD Cloud utilizing high-performance MI300X accelerators. In tandem with Google Gemma 4 and Fireworks AI inference frameworks, we perform thousands of complex Monte Carlo outcomes in milliseconds.
            </p>
            <ul className="space-y-4">
              {['Vectorized NumPy Engine', 'Real-time API Integration', 'Strict FIFA Rules Engine'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-cyan/20 flex items-center justify-center text-primary-cyan text-xs">✓</div>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-bg-1 border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-cyan/20 rounded-full blur-[80px]"></div>
            
            {/* Tech stack logo images at the top */}
            <div className="flex flex-wrap items-center gap-6 mb-6 relative z-10 bg-bg-0/40 px-5 py-3 rounded-2xl border border-white/5 w-fit">
              <div className="w-20 h-6 flex items-center justify-center">
                <img src="/src/assets/images/amd.webp" alt="AMD" className="max-h-full max-w-full object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" />
              </div>
              <div className="w-20 h-6 flex items-center justify-center">
                <img src="/src/assets/images/google-gemma.webp" alt="Google Gemma" className="max-h-full max-w-full object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" />
              </div>
              <div className="w-20 h-6 flex items-center justify-center">
                <img src="/src/assets/images/fireworks-ai.webp" alt="Fireworks AI" className="max-h-full max-w-full object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-white">Next-Gen Simulation Power</h3>
            <p className="text-gray-400 text-sm leading-relaxed relative z-10">
              Optimized for maximum computational throughput, our vectorized Monte Carlo engine performs thousands of complex match simulations in milliseconds, leaving competitors in the dust.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section (5 Questions) */}
      <div className="w-full max-w-4xl mx-auto px-4 mb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-400">Have questions? We have answers.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-bg-1 border border-white/5 rounded-2xl overflow-hidden shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-6 text-left font-semibold text-white hover:text-primary-cyan transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown 
                  size={18} 
                  className={`text-gray-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-primary-cyan' : ''}`}
                />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openFaq === idx ? 'max-h-48 opacity-100 border-t border-white/5' : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                <p className="p-6 text-gray-400 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-4xl mx-auto px-4 mb-32">
        <div className="bg-linear-to-r from-bg-1 to-bg-1/40 border border-white/10 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-cyan/10 rounded-full blur-[80px] group-hover:bg-primary-cyan/20 transition-all"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to See the Future?</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            Join thousands of analysts and fans who have harnessed the power of AI for sports predictions.
          </p>
          <button 
            onClick={handleScrollToHero}
            className="px-8 py-3.5 bg-primary-cyan text-bg-0 rounded-xl font-bold hover:bg-cyan-300 hover:scale-105 transition-all shadow-[0_0_20px_rgba(76,215,246,0.3)] cursor-pointer"
          >
            Start Simulation Now
          </button>
        </div>
      </div>

    </div>
  );
};

export default BelowTheFold;
