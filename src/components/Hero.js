import React from 'react';
import './Hero.css';
import { 
  Users, 
  ArrowRight, 
  Code, 
  Layers, 
  Terminal, 
  Music, 
  Camera, 
  Gamepad2, 
  CheckCircle2
} from 'lucide-react';

function Hero() {
  const handleScrollToInterests = (e) => {
    e.preventDefault();
    const section = document.getElementById('interests');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" id="top">
      {/* Decorative background glows */}
      <div className="hero-glow hero-glow-purple" aria-hidden="true" />
      <div className="hero-glow hero-glow-blue" aria-hidden="true" />

      <div className="hero-container container">
        {/* Left Column: Text Content & CTAs */}
        <div className="hero-content">
          {/* Main Heading */}
          <h1 className="hero-title">
            Your people. <br />
            Your passions. <br />
            <span className="hero-title-highlight">Your next big thing.</span>
          </h1>

          {/* Supporting Paragraph */}
          <p className="hero-description">
            Discover students who share your interests, explore your niche, and
            find the right people to learn, create, and build something meaningful
            together.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-group">
            <button
              type="button"
              className="btn-primary hero-btn-primary"
              onClick={handleScrollToInterests}
            >
              <Users size={18} />
              <span>Find Your People</span>
            </button>

            <button
              type="button"
              className="btn-secondary hero-btn-secondary"
              onClick={handleScrollToInterests}
            >
              <span>Explore Interests</span>
              <ArrowRight size={18} className="hero-arrow-icon" />
            </button>
          </div>

          {/* Supporting Micro-copy */}
          <p className="hero-subtext">
            From your first hobby to your next big project — find your community here.
          </p>

          {/* Quick Stats Banner */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Students Joined</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">25+</span>
              <span className="stat-label">Interest Niches</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Campus Focused</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Card Composition */}
        <div className="hero-visual" id="hero-visual" aria-label="Students and Interests Showcase">
          {/* Main Core Showcase Card */}
          <div className="visual-board">
            <div className="board-header">
              <div className="board-status">
                <span className="status-indicator-live" />
                <span className="status-text">Campus Collaboration Hub</span>
              </div>
              <span className="board-badge">Active Cohort</span>
            </div>

            {/* Overlapping Floating Interest Cards */}
            <div className="board-grid">
              {/* Card 1: Web Development */}
              <div className="interest-pill-card card-web">
                <div className="pill-icon-wrapper icon-blue">
                  <Code size={18} />
                </div>
                <div className="pill-content">
                  <div className="pill-title-row">
                    <h3 className="pill-title">Web Development</h3>
                    <span className="pill-tag tag-purple">Building projects</span>
                  </div>
                  <div className="pill-avatars">
                    <span className="avatar-circle av-1">AK</span>
                    <span className="avatar-circle av-2">PS</span>
                    <span className="avatar-circle av-3">RJ</span>
                    <span className="avatar-more">+14</span>
                  </div>
                </div>
              </div>

              {/* Card 2: UI/UX Design */}
              <div className="interest-pill-card card-design">
                <div className="pill-icon-wrapper icon-purple">
                  <Layers size={18} />
                </div>
                <div className="pill-content">
                  <div className="pill-title-row">
                    <h3 className="pill-title">UI/UX Design</h3>
                    <span className="pill-tag tag-blue">Learning together</span>
                  </div>
                  <div className="pill-avatars">
                    <span className="avatar-circle av-4">SR</span>
                    <span className="avatar-circle av-5">MN</span>
                    <span className="avatar-more">+9</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Competitive Programming */}
              <div className="interest-pill-card card-cp">
                <div className="pill-icon-wrapper icon-amber">
                  <Terminal size={18} />
                </div>
                <div className="pill-content">
                  <div className="pill-title-row">
                    <h3 className="pill-title">Competitive Programming</h3>
                    <span className="pill-tag tag-amber">Finding teammates</span>
                  </div>
                  <div className="pill-avatars">
                    <span className="avatar-circle av-6">VK</span>
                    <span className="avatar-circle av-7">TD</span>
                    <span className="avatar-more">+18</span>
                  </div>
                </div>
              </div>

              {/* Lower row: Smaller tags for Photography, Music, Gaming */}
              <div className="mini-cards-row">
                {/* Mini Card: Music */}
                <div className="mini-card mini-music">
                  <div className="mini-icon icon-rose">
                    <Music size={15} />
                  </div>
                  <div>
                    <span className="mini-name">Music</span>
                    <span className="mini-sub">Jam sessions</span>
                  </div>
                </div>

                {/* Mini Card: Photography */}
                <div className="mini-card mini-photo">
                  <div className="mini-icon icon-emerald">
                    <Camera size={15} />
                  </div>
                  <div>
                    <span className="mini-name">Photography</span>
                    <span className="mini-sub">Photowalks</span>
                  </div>
                </div>

                {/* Mini Card: Gaming */}
                <div className="mini-card mini-gaming">
                  <div className="mini-icon icon-indigo">
                    <Gamepad2 size={15} />
                  </div>
                  <div>
                    <span className="mini-name">Gaming</span>
                    <span className="mini-sub">LAN & squads</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom floating badge: Teammate Match Success */}
            <div className="board-highlight-badge">
              <CheckCircle2 size={16} className="highlight-icon" />
              <span>3 teammates connected for Annual Hackathon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
