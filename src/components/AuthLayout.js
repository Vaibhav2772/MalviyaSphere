import React from 'react';
import './AuthLayout.css';
import { Link } from '../context/RouterContext';
import { ArrowLeft, Users, Compass, Sparkles, ShieldCheck } from 'lucide-react';

function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  badge = 'Campus Community' 
}) {
  return (
    <div className="auth-page-wrapper">
      {/* Main Dual-Column Content */}
      <main className="auth-main-container">
        <div className="auth-card-container">
          {/* Left Column: Community Banner / Brand Philosophy */}
          <aside className="auth-side-panel">
            <div className="side-panel-content">
              <div className="side-panel-badge">
                <Sparkles size={14} />
                <span>{badge}</span>
              </div>

              <h1 className="side-panel-title">Find your people.</h1>
              <p className="side-panel-desc">
                MalviyaSphere brings students together through shared hobbies, niche interests,
                technical skills, and collaboration goals across campus.
              </p>

              <div className="side-feature-list">
                <div className="side-feature-item">
                  <div className="side-feature-icon icon-indigo">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="side-feature-heading">Connect with Peers</h3>
                    <p className="side-feature-text">
                      Discover classmates exploring the exact same interests and technical stacks.
                    </p>
                  </div>
                </div>

                <div className="side-feature-item">
                  <div className="side-feature-icon icon-purple">
                    <Compass size={18} />
                  </div>
                  <div>
                    <h3 className="side-feature-heading">Explore Campus Niches</h3>
                    <p className="side-feature-text">
                      From hackathons and competitive coding to acoustic jam sessions and photography walks.
                    </p>
                  </div>
                </div>

                <div className="side-feature-item">
                  <div className="side-feature-icon icon-emerald">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="side-feature-heading">College-Focused Network</h3>
                    <p className="side-feature-text">
                      Built specifically for students with verified campus community access.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="side-panel-footer">
              <span>© {new Date().getFullYear()} MalviyaSphere · Student Community Hub</span>
            </div>
          </aside>

          {/* Right Column: Actual Form Panel */}
          <section className="auth-form-panel" aria-labelledby="auth-form-heading">
            <div className="form-panel-top-bar">
              <Link to="/" className="auth-back-crumb-link">
                <ArrowLeft size={15} />
                <span>Back to Homepage</span>
              </Link>
            </div>

            <div className="form-panel-header">
              <h2 id="auth-form-heading" className="auth-form-title">{title}</h2>
              {subtitle && <p className="auth-form-subtitle">{subtitle}</p>}
            </div>

            <div className="form-panel-body">
              {children}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
