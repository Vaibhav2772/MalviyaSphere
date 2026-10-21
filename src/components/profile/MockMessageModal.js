import React, { useState } from 'react';
import { X, Send, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useChat } from '../../context/ChatContext';
import './MockMessageModal.css';

function MockMessageModal({ student, onClose }) {
  const { navigate } = useRouter();
  const chatContext = useChat();
  const [messageText, setMessageText] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    try {
      if (chatContext?.getOrCreateDirectConversation && chatContext?.sendMessage) {
        const convId = chatContext.getOrCreateDirectConversation(student.id);
        if (convId) {
          chatContext.sendMessage(convId, messageText);
        }
      }
    } catch (err) {}
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

              <div style={{ marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/messages?studentId=${student.id}`);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4f46e5',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Open direct conversation in Messages</span>
                  <ArrowRight size={14} />
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
