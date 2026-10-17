import React, { useState } from 'react';
import './Navbar.css';
import logo from '../assets/logo.png';
import { Menu, X, ArrowRight, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { currentPath, navigate } = useRouter();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    closeMobileMenu();

    if (currentPath === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Navigate to homepage first then scroll
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleBrandClick = (e) => {
    e.preventDefault();
    closeMobileMenu();
    if (currentPath === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <header className="navbar-header">
      <nav className="navbar-container container" aria-label="Main Navigation">
        {/* Brand Logo & Name */}
        <a 
          href="/" 
          className="navbar-brand"
          onClick={handleBrandClick}
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
              onClick={(e) => handleNavClick(e, 'interests')}
            >
              Explore
            </a>
          </li>
          <li>
            <a 
              href="#interests" 
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'interests')}
            >
              Communities
            </a>
          </li>
          <li>
            <a 
              href="#hero-visual" 
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'hero-visual')}
            >
              Teams
            </a>
          </li>
        </ul>

        {/* Desktop Auth CTA Buttons */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="navbar-auth-logged-in">
              <button
                type="button"
                className="navbar-user-chip"
                title={user?.hasCompletedOnboarding ? 'View Your Sphere Profile' : (user?.college || 'Logged In')}
                onClick={() => navigate('/onboarding')}
                style={{ cursor: 'pointer' }}
              >
                <User size={15} className="user-chip-icon" />
                <span className="user-chip-name">{user?.name || 'Student'}</span>
              </button>
              {!user?.hasCompletedOnboarding && (
                <button
                  type="button"
                  className="btn-navbar-onboarding"
                  onClick={() => navigate('/onboarding')}
                  aria-label="Complete Profile Onboarding"
                >
                  <span>Complete Onboarding</span>
                  <ArrowRight size={14} />
                </button>
              )}
              <button 
                type="button" 
                className="btn-navbar-logout"
                onClick={() => navigate('/logout')}
                aria-label="Log Out"
              >
                <LogOut size={15} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <>
              <button 
                type="button" 
                className="btn-login"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button 
                type="button" 
                className="btn-signup"
                onClick={() => navigate('/signup')}
              >
                <span>Sign Up</span>
                <ArrowRight size={16} className="btn-arrow-icon" />
              </button>
            </>
          )}
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
              onClick={(e) => handleNavClick(e, 'interests')}
            >
              Explore
            </a>
          </li>
          <li>
            <a 
              href="#interests" 
              className="mobile-nav-link"
              onClick={(e) => handleNavClick(e, 'interests')}
            >
              Communities
            </a>
          </li>
          <li>
            <a 
              href="#hero-visual" 
              className="mobile-nav-link"
              onClick={(e) => handleNavClick(e, 'hero-visual')}
            >
              Teams
            </a>
          </li>
        </ul>
        <div className="mobile-actions">
          {isAuthenticated ? (
            <>
              <div 
                className="mobile-user-profile"
                onClick={() => {
                  closeMobileMenu();
                  navigate('/onboarding');
                }}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              >
                <div className="mobile-user-avatar">
                  <User size={18} />
                </div>
                <div className="mobile-user-info">
                  <span className="mobile-user-name">{user?.name}</span>
                  <span className="mobile-user-email">{user?.email}</span>
                </div>
              </div>
              {!user?.hasCompletedOnboarding && (
                <button
                  type="button"
                  className="btn-navbar-onboarding mobile-btn-onboarding"
                  onClick={() => {
                    closeMobileMenu();
                    navigate('/onboarding');
                  }}
                >
                  <span>Complete Onboarding</span>
                  <ArrowRight size={15} />
                </button>
              )}
              <button 
                type="button" 
                className="btn-navbar-logout mobile-btn-logout"
                onClick={() => {
                  closeMobileMenu();
                  navigate('/logout');
                }}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <button 
                type="button" 
                className="btn-login mobile-btn-login"
                onClick={() => {
                  closeMobileMenu();
                  navigate('/login');
                }}
              >
                Login
              </button>
              <button 
                type="button" 
                className="btn-signup mobile-btn-signup"
                onClick={() => {
                  closeMobileMenu();
                  navigate('/signup');
                }}
              >
                <span>Sign Up</span>
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
