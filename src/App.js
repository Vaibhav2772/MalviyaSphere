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
import Explore from './pages/Explore';
import StudentProfile from './pages/StudentProfile';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider } from './context/AuthContext';
import { StudentProvider } from './context/StudentContext';

function AppContent() {
  const { currentPath } = useRouter();

  // Route selector
  const renderPage = () => {
    // Dynamic profile route
    if (currentPath.startsWith('/profile/')) {
      return <StudentProfile />;
    }

    switch (currentPath) {
      case '/explore':
        return <Explore />;
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
      <StudentProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </StudentProvider>
    </AuthProvider>
  );
}

export default App;

