import React from 'react';
import { ShieldAlert, X } from 'lucide-react';
import './BlockConfirmDialog.css';

function BlockConfirmDialog({ isOpen, onClose, onConfirm, studentName = 'this student' }) {
  if (!isOpen) return null;

  return (
    <div className="block-dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="block-dialog-title">
      <div className="block-dialog-card">
        <div className="block-dialog-header">
          <div className="block-dialog-title-group">
            <ShieldAlert size={20} className="block-alert-icon" />
            <h3 id="block-dialog-title" className="block-dialog-title">
              Block {studentName}?
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-modal-close"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="block-dialog-body">
          <p className="block-dialog-text">
            Are you sure you want to block <strong>{studentName}</strong>? While blocked, you will not be able to send or receive direct messages from this student.
          </p>
          <p className="block-dialog-subtext">
            You can unblock them at any time from this conversation panel.
          </p>
        </div>

        <div className="block-dialog-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn-modal-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="btn-modal-danger"
          >
            Confirm Block
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlockConfirmDialog;
