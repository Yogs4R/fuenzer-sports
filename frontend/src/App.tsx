import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import Playground from './pages/Playground';
import HistoryPage from './pages/HistoryPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

function App() {
  const { currentPage, setCurrentPage } = useAppStore();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage((window.location.pathname as any) || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setCurrentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <LandingPage />;
      case '/playground':
        return <Playground />;
      case '/history':
        return <HistoryPage />;
      case '/signin':
        return <SignInPage />;
      case '/signup':
        return <SignUpPage />;
      case '/privacy':
        return <PrivacyPage />;
      case '/terms':
        return <TermsPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center min-h-screen bg-bg-0 text-white font-sans">
      <Navbar />
      <main className="w-full grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
