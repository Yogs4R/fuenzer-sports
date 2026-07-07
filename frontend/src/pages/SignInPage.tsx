import React from 'react';
import { useAppStore } from '../store/useAppStore';

const SignInPage = () => {
  const { setCurrentPage } = useAppStore();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: any) => {
    e.preventDefault();
    window.history.pushState(null, '', path);
    setCurrentPage(path);
  };

  return (
    <div className="min-h-screen relative w-full pt-32 pb-20 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-bg-1 border border-white/5 rounded-3xl p-8 relative z-10 shadow-2xl">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-white text-center">
          Sign In
        </h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input type="email" placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl bg-bg-0 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary-cyan/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-bg-0 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary-cyan/50 text-sm" />
          </div>
          <button type="submit" className="w-full bg-primary-cyan text-bg-0 py-3 rounded-xl font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-primary-cyan/10 text-sm mt-2">
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="/signup" onClick={(e) => handleNavigation(e, '/signup')} className="text-primary-cyan hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
