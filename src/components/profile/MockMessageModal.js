import React, { useState } from 'react';
import { X, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import './MockMessageModal.css';

function MockMessageModal({ student, onClose }) {
  const [messageText, setMessageText] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setIsSent(true);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="message-modal-title">
      <div className="modal-card">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <MessageSquare size={18} className="modal-title-icon" />
            <h3 id="message-modal-title" className="modal-title">
              Message {student.fullName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close message dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="mock-notice-box">
            <strong>Frontend Simulation Notice:</strong> In this phase, MalviyaSphere provides a simulated frontend preview. No backend messaging server is active.
          </div>

          {isSent ? (
            <div className="message-sent-state">
              <CheckCircle2 size={36} className="sent-success-icon" />
              <h4 className="sent-success-title">Message Sent!</h4>
              <p className="sent-success-desc">
                Your message has been simulated and saved to {student.fullName}'s preview inbox.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-modal-primary"
              >
                Close Dialog
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="message-form">
              <div className="form-group">
                <label htmlFor="message-textarea" className="form-label">
                  Your Message to {student.fullName}:
                </label>
                <textarea
                  id="message-textarea"
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Hi ${student.fullName}, I saw your profile on MalviyaSphere and would love to collaborate on...`}
                  className="modal-textarea"
                  required
                />
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-modal-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="btn-modal-primary"
                >
                  <span>Send Message</span>
                  <Send size={15} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default MockMessageModal;
