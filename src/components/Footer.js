import React from 'react';
import './Footer.css';
import logo from '../assets/logo.png';
import { Heart } from 'lucide-react';

function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <div className="container footer-container">
        {/* Brand Column */}
        <div className="footer-brand">
          <a href="#top" onClick={scrollToTop} className="footer-logo">
            <img src={logo} alt="MalviyaSphere Logo" className="footer-logo-img" />
            <span className="footer-brand-name">
              Malviya<span>Sphere</span>
            </span>
          </a>
          <p className="footer-tagline">
            The student-driven platform for discovering people, hobbies, technical
            niches, and collaboration across the Malviya campus.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links-group">
          <span className="footer-group-title">Quick Links</span>
          <ul className="footer-nav-list">
            <li>
              <a href="#interests" onClick={(e) => {
                e.preventDefault();
                document.getElementById('interests')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Explore Interests
              </a>
            </li>
            <li>
              <a href="#hero-visual" onClick={(e) => {
                e.preventDefault();
                document.getElementById('hero-visual')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Campus Collaboration
              </a>
            </li>
            <li>
              <a href="#top" onClick={scrollToTop}>
                Back to Top
              </a>
            </li>
          </ul>
        </div>

        {/* College Community Note */}
        <div className="footer-links-group">
          <span className="footer-group-title">Community</span>
          <p className="footer-note">
            Built by students, for students. Connect, learn, build something memorable.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="footer-copyright">
            © {new Date().getFullYear()} MalviyaSphere. All rights reserved.
          </p>
          <p className="footer-made-with">
            Designed with <Heart size={14} className="heart-icon" /> for the Malviya student community.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
