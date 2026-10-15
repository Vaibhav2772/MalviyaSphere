import React, { useState } from 'react';
import './Navbar.css';
import logo from '../assets/logo.png';
import { Menu, X, ArrowRight } from 'lucide-react';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();
    closeMobileMenu();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar-header">
      <nav className="navbar-container container" aria-label="Main Navigation">
        {/* Brand Logo & Name */}
        <a 
          href="#top" 
          className="navbar-brand"
          onClick={(e) => handleScrollToSection(e, 'top')}
          aria-label="MalviyaSphere Home"
        >
          <img src={logo} alt="MalviyaSphere Logo" className="brand-logo-img" />
          <span className="brand-name">
            Malviya<span className="brand-name-accent">Sphere</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <ul className="navbar-links">
          <li>
            <a 
              href="#interests" 
              className="nav-link"
              onClick={(e) => handleScrollToSection(e, 'interests')}
            >
              Explore
            </a>
          </li>
          <li>
            <a 
              href="#interests" 
              className="nav-link"
              onClick={(e) => handleScrollToSection(e, 'interests')}
            >
              Communities
            </a>
          </li>
          <li>
            <a 
              href="#hero-visual" 
              className="nav-link"
              onClick={(e) => handleScrollToSection(e, 'hero-visual')}
            >
              Teams
            </a>
          </li>
        </ul>

        {/* Desktop Auth CTA Buttons */}
        <div className="navbar-actions">
          <button 
            type="button" 
            className="btn-login"
            onClick={() => alert('Login functionality will be available in the next release!')}
          >
            Login
          </button>
          <button 
            type="button" 
            className="btn-signup"
            onClick={() => alert('Sign Up functionality will be available in the next release!')}
          >
            <span>Sign Up</span>
            <ArrowRight size={16} className="btn-arrow-icon" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          type="button" 
          className="navbar-mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div className={`navbar-mobile-menu ${mobileMenuOpen ? 'is-open' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <a 
              href="#interests" 
              className="mobile-nav-link"
              onClick={(e) => handleScrollToSection(e, 'interests')}
            >
              Explore
            </a>
          </li>
          <li>
            <a 
              href="#interests" 
              className="mobile-nav-link"
              onClick={(e) => handleScrollToSection(e, 'interests')}
            >
              Communities
            </a>
          </li>
          <li>
            <a 
              href="#hero-visual" 
              className="mobile-nav-link"
              onClick={(e) => handleScrollToSection(e, 'hero-visual')}
            >
              Teams
            </a>
          </li>
        </ul>
        <div className="mobile-actions">
          <button 
            type="button" 
            className="btn-login mobile-btn-login"
            onClick={() => {
              closeMobileMenu();
              alert('Login functionality will be available in the next release!');
            }}
          >
            Login
          </button>
          <button 
            type="button" 
            className="btn-signup mobile-btn-signup"
            onClick={() => {
              closeMobileMenu();
              alert('Sign Up functionality will be available in the next release!');
            }}
          >
            <span>Sign Up</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
