import React from 'react';
import './EmailVerificationStatus.css';
import { useAuth } from '../context/AuthContext';
import { Mail, Clock, CheckCircle, AlertTriangle, RefreshCw, Info } from 'lucide-react';

function EmailVerificationStatus({ email, compact = false }) {
  const {
    verificationStatus,
    verificationFeedback,
    isVerifying,
    resendVerificationEmail,
    setSimulatedStatus,
  } = useAuth();

  const handleResend = (e) => {
    e.preventDefault();
    resendVerificationEmail(email);
  };

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case 'verified':
        return {
          icon: <CheckCircle size={15} />,
          label: 'Verified (Simulated)',
          className: 'badge-verified',
          description: 'College domain validated for mock session.',
        };
      case 'pending':
        return {
          icon: <Clock size={15} />,
          label: 'Verification Pending',
          className: 'badge-pending',
          description: 'Verification email would be sent to your college email.',
        };
      case 'failed':
        return {
          icon: <AlertTriangle size={15} />,
          label: 'Verification Failed',
          className: 'badge-failed',
          description: 'Could not deliver simulated verification email. Please try resending.',
        };
      case 'not_verified':
      default:
        return {
          icon: <Mail size={15} />,
          label: 'Not Verified',
          className: 'badge-unverified',
          description: 'A confirmation link would be sent upon account creation.',
        };
    }
  };

  const currentBadge = getStatusBadge();

  return (
    <div className={`verification-panel ${compact ? 'is-compact' : ''}`}>
      {/* Simulation Notice Disclaimer */}
      <div className="simulated-badge-row">
        <div className={`status-pill ${currentBadge.className}`}>
          {currentBadge.icon}
          <span>{currentBadge.label}</span>
        </div>
        <span className="simulation-notice-tag">
          <Info size={12} /> Frontend Simulation
        </span>
      </div>

      <p className="verification-desc-text">
        {verificationFeedback?.message || currentBadge.description}
      </p>

      {/* Action Row */}
      <div className="verification-action-row">
        <button
          type="button"
          onClick={handleResend}
          disabled={isVerifying}
          className="btn-resend-verification"
        >
          <RefreshCw size={13} className={isVerifying ? 'spin-icon' : ''} />
          <span>{isVerifying ? 'Sending simulated email...' : 'Resend verification email'}</span>
        </button>

        {/* State Toggle for Reviewer to test all 4 states */}
        <div className="status-tester-group">
          <span className="status-tester-label">Preview State:</span>
          <select
            value={verificationStatus}
            onChange={(e) => setSimulatedStatus(e.target.value)}
            className="status-tester-select"
            aria-label="Preview verification status"
          >
            <option value="not_verified">Not Verified</option>
            <option value="pending">Verification Pending</option>
            <option value="verified">Verified</option>
            <option value="failed">Verification Failed</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationStatus;
