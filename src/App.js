import React, { useEffect } from 'react';
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
import Teams from './pages/Teams';
import TeamDetails from './pages/TeamDetails';
import Chat from './pages/Chat';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudentProvider } from './context/StudentContext';
import { TeamsProvider } from './context/TeamsContext';
import { ChatProvider } from './context/ChatContext';

function AppContent() {
  const { currentPath, navigate } = useRouter();
  const { isAuthenticated } = useAuth();

  // Route protection: messages, private profile, onboarding
  const isProtected =
    currentPath.startsWith('/messages') ||
    currentPath === '/profile/me' ||
    currentPath === '/onboarding';

  useEffect(() => {
    if (!isAuthenticated && isProtected) {
      navigate('/login');
    }
  }, [isAuthenticated, isProtected, navigate]);

  // Route selector
  const renderPage = () => {
    if (!isAuthenticated && isProtected) {
      return <Login />;
    }

    // Dynamic profile route
    if (currentPath.startsWith('/profile/')) {
      return <StudentProfile />;
    }

    // Dynamic team details route
    if (currentPath.startsWith('/teams/')) {
      return <TeamDetails />;
    }

    // Dynamic / query-based messages route
    if (currentPath.startsWith('/messages')) {
      return <Chat />;
    }

    switch (currentPath) {
      case '/messages':
        return <Chat />;
      case '/teams':
        return <Teams />;
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
        <TeamsProvider>
          <ChatProvider>
            <RouterProvider>
              <AppContent />
            </RouterProvider>
          </ChatProvider>
        </TeamsProvider>
      </StudentProvider>
    </AuthProvider>
  );
}

export default App;

