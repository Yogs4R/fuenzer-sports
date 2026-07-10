import React from 'react';
import { useAppStore } from '../store/useAppStore';

const SignInPage = () => {
  const { setCurrentPage, signInWithGoogle, isAuthLoading } = useAppStore();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    setCurrentPage('/');
    window.history.pushState(null, '', '/');
  };

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, path: any) => {
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
        
        <button 
          onClick={handleGoogleSignIn}
          disabled={isAuthLoading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {isAuthLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <div className="mt-6 text-center">
          <button 
            onClick={(e) => handleNavigation(e, '/')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Continue as Guest
          </button>
        </div>
        
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
