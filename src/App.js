import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InterestSection from './components/InterestSection';
import Footer from './components/Footer';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Onboarding from './pages/Onboarding';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const { currentPath } = useRouter();

  // Route selector
  const renderPage = () => {
    switch (currentPath) {
      case '/onboarding':
        return <Onboarding />;
      case '/signup':
        return <Signup />;
      case '/login':
        return <Login />;
      case '/logout':
        return <Logout />;
      case '/':
      default:
        return (
          <main id="main-content">
            <Hero />
            <InterestSection />
          </main>
        );
    }
  };

  return (
    <div className="malviyasphere-app">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Dynamic Route Content */}
      {renderPage()}

      {/* Page Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  );
}

export default App;
