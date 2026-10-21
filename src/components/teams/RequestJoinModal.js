import React, { useState } from 'react';
import { useTeams } from '../../context/TeamsContext';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import './RequestJoinModal.css';

function RequestJoinModal({ isOpen, onClose, team }) {
  const { requestToJoin } = useTeams();

  const [message, setMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState(
    team?.openRoles?.[0]?.title || ''
  );
  const [feedback, setFeedback] = useState(null);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen || !team) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      requestToJoin(team.id, message, selectedRole);
      setIsSent(true);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to submit join request.',
      });
    }
  };

  const handleClose = () => {
    setMessage('');
    setFeedback(null);
    setIsSent(false);
    onClose();
  };

  return (
    <div className="req-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="req-modal-title">
      <div className="req-modal-card">
        {/* Header */}
        <div className="req-modal-header">
          <div className="req-title-group">
            <span className="req-header-badge">{team.logo || '🚀'}</span>
            <div>
              <h3 id="req-modal-title" className="req-modal-title">
                Apply to Join {team.name}
              </h3>
              <p className="req-modal-subtitle">
                Category: <strong>{team.categoryLabel || team.category}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="btn-modal-close"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="req-modal-body">
          {isSent ? (
            <div className="req-success-state">
              <CheckCircle2 size={44} className="req-success-icon" />
              <h4 className="req-success-title">Application Submitted!</h4>
              <p className="req-success-desc">
                Your request has been forwarded to the team lead. You can check the status on the team page anytime.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="btn-modal-primary"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="req-form">
              {feedback && (
                <div className={`req-feedback-box ${feedback.type}`}>
                  <AlertCircle size={16} />
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Open Roles Selector if available */}
              {team.openRoles && team.openRoles.length > 0 && (
                <div className="form-group">
                  <label htmlFor="role-select" className="form-label">
                    Position / Role you are applying for
                  </label>
                  <select
                    id="role-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="form-select"
                  >
                    <option value="General Collaborator">General Collaborator</option>
                    {team.openRoles.map((role) => (
                      <option key={role.id} value={role.title}>
                        {role.title} {role.skills?.length > 0 ? `(${role.skills.join(', ')})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Message */}
              <div className="form-group">
                <label htmlFor="req-message" className="form-label">
                  Note to Team Lead & Relevant Experience
                </label>
                <textarea
                  id="req-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself, share what technologies you work with, and why you are enthusiastic about this project..."
                  className="form-textarea"
                  required
                />
              </div>

              {/* Footer Actions */}
              <div className="req-modal-footer">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-modal-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="btn-modal-submit"
                >
                  <span>Submit Application</span>
                  <Send size={14} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestJoinModal;
