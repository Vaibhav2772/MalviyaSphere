import React, { useState, useRef } from 'react';
import { Send, Lock, WifiOff } from 'lucide-react';
import './MessageInput.css';

function MessageInput({ onSendMessage, isBlocked = false, isOffline = false }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isBlocked || isOffline) return;

    onSendMessage(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    // Auto-grow height slightly up to 120px
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  if (isBlocked) {
    return (
      <div className="message-input-blocked-notice">
        <Lock size={15} />
        <span>This conversation is blocked. Unblock to send messages.</span>
      </div>
    );
  }

  if (isOffline) {
    return (
      <div className="message-input-offline-notice">
        <WifiOff size={15} />
        <span>Simulated Offline Mode: Reconnect to send messages.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <div className="message-textarea-wrapper">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message (Enter to send, Shift+Enter for new line)..."
          className="message-textarea"
          aria-label="Type message"
        />
      </div>

      <button
        type="submit"
        disabled={!text.trim()}
        className="btn-send-message"
        aria-label="Send message"
      >
        <Send size={16} />
      </button>
    </form>
  );
}

export default MessageInput;
