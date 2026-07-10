import { useSEO } from '../hooks/useSEO';

const NotFoundPage = () => {
  useSEO({ title: 'Fuenzer Sports | 404 Not Found' });

  return (
    <div className="min-h-screen relative w-full pt-32 pb-20 flex flex-col items-center justify-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-lg bg-bg-1 border border-white/5 rounded-3xl p-12 relative z-10 shadow-2xl text-center">
        <h1 className="text-6xl font-bold tracking-tight mb-4 text-white">404</h1>
        <h2 className="text-xl font-semibold text-gray-300 mb-6">Page Not Found</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3 rounded-xl font-semibold bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
