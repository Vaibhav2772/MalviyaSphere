import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InterestSection from './components/InterestSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="malviyasphere-app">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Landing Page Content */}
      <main id="main-content">
        <Hero />
        <InterestSection />
      </main>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}

export default App;
