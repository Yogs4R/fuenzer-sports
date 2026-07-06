
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <div className="w-full flex flex-col items-center">
      <Navbar />
      <main className="w-full">
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
}

export default App;
