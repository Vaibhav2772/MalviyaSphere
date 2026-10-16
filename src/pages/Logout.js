import React, { useState } from 'react';
import './Logout.css';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { useRouter, Link } from '../context/RouterContext';
import { LogOut, CheckCircle2, ArrowRight } from 'lucide-react';

function Logout() {
  const { isAuthenticated, logout } = useAuth();
  const { navigate } = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [loggedOutDone, setLoggedOutDone] = useState(false);

  const handleConfirmLogout = async () => {
    setIsProcessing(true);
    await logout();
    setIsProcessing(false);
    setLoggedOutDone(true);
  };

  return (
    <AuthLayout
      title={loggedOutDone ? 'Logged Out' : isAuthenticated ? 'Confirm Logout' : 'Session Ended'}
      subtitle={
        loggedOutDone
          ? 'You have safely ended your session'
          : isAuthenticated
          ? 'Manage your active campus session'
          : 'You are currently not logged in'
      }
      badge="Session Management"
    >
      <div className="logout-panel-root">
        {isProcessing ? (
          /* Processing State */
          <div className="logout-processing-state" role="status">
            <div className="logout-spinner" />
            <h3 className="logout-state-title">Signing out...</h3>
            <p className="logout-state-desc">
              Clearing mock session state and returning to public view.
            </p>
          </div>
        ) : loggedOutDone ? (
          /* Logout Success State */
          <div className="logout-success-state" role="status">
            <div className="logout-icon-box success-box">
              <CheckCircle2 size={36} className="success-icon" />
            </div>
            <h3 className="logout-state-title">You have been logged out successfully.</h3>
            <p className="logout-state-desc">
              Your mock session has ended. The navigation bar has been updated to show Login and Sign Up.
            </p>

            <div className="logout-action-buttons">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-primary auth-submit-btn"
              >
                <span>Return to Homepage</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="btn-secondary auth-secondary-btn"
              >
                <span>Log Back In</span>
              </button>
            </div>
          </div>
        ) : isAuthenticated ? (
          /* Confirmation Interface */
          <div className="logout-confirm-view">
            <h3 className="logout-confirm-question">Are you sure you want to log out?</h3>

            <div className="logout-action-buttons">
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isProcessing}
                className="btn-primary logout-confirm-btn"
              >
                <LogOut size={17} />
                <span>Yes. Log out</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary auth-secondary-btn"
              >
                <span>Stay here</span>
              </button>
            </div>
          </div>
        ) : (
          /* Already Logged Out */
          <div className="logout-empty-state">
            <div className="logout-icon-box neutral-box">
              <LogOut size={32} />
            </div>
            <h3 className="logout-state-title">You are not currently logged in</h3>
            <p className="logout-state-desc">
              Please log in or create an account to access student communities and campus teams.
            </p>

            <div className="logout-action-buttons">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="btn-primary auth-submit-btn"
              >
                <span>Go to Login</span>
                <ArrowRight size={16} />
              </button>

              <Link to="/" className="auth-return-link" style={{ marginTop: '0.75rem' }}>
                ← Return to homepage
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default Logout;
