import React, { useState } from 'react';
import { Flag, X, CheckCircle2 } from 'lucide-react';
import './ReportDialog.css';

const REPORT_REASONS = [
  'Spam or Commercial Solicitation',
  'Harassment or Bullying',
  'Inappropriate Content',
  'Impersonation of Student/Faculty',
  'Academic Dishonesty',
  'Other',
];

function ReportDialog({ isOpen, onClose, onSubmitReport, title = 'Conversation' }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedReason) {
      setError('Please select a reason for reporting.');
      return;
    }

    onSubmitReport({ reason: selectedReason, details });
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setSelectedReason('');
    setDetails('');
    setError('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="report-dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="report-dialog-title">
      <div className="report-dialog-card">
        {/* Header */}
        <div className="report-dialog-header">
          <div className="report-dialog-title-group">
            <Flag size={18} className="report-icon" />
            <h3 id="report-dialog-title" className="report-dialog-title">
              Report {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="btn-modal-close"
            aria-label="Close report dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="report-dialog-body">
          {isSubmitted ? (
            <div className="report-success-state">
              <CheckCircle2 size={40} className="report-success-icon" />
              <h4 className="report-success-title">Report Recorded (Frontend Simulation)</h4>
              <p className="report-success-desc">
                Your feedback has been logged in the local mock session state. This prototype does not transmit real reports to an active moderation server.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="btn-modal-primary"
              >
                Close Dialog
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="report-form">
              <div className="report-simulation-notice">
                <strong>Notice:</strong> MalviyaSphere reports are stored in local mock state for evaluation and UI preview.
              </div>

              {/* Reasons */}
              <div className="form-group">
                <label className="form-label">
                  Reason for reporting <span className="required-star">*</span>
                </label>
                <div className="report-reasons-group">
                  {REPORT_REASONS.map((reason) => (
                    <label key={reason} className="report-radio-label">
                      <input
                        type="radio"
                        name="report-reason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={(e) => {
                          setSelectedReason(e.target.value);
                          setError('');
                        }}
                        className="report-radio-input"
                      />
                      <span className="radio-custom"></span>
                      <span className="radio-text">{reason}</span>
                    </label>
                  ))}
                </div>
                {error && <p className="form-error-msg">{error}</p>}
              </div>

              {/* Details */}
              <div className="form-group">
                <label htmlFor="report-details" className="form-label">
                  Additional Details (Optional)
                </label>
                <textarea
                  id="report-details"
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide context on what occurred..."
                  className="form-textarea"
                />
              </div>

              {/* Footer */}
              <div className="report-dialog-footer">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-modal-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedReason}
                  className="btn-modal-danger"
                >
                  Submit Report
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportDialog;
