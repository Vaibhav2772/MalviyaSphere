import React from 'react';
import './MessageBubble.css';

function getInitials(name = '') {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function MessageBubble({ message, isGroupOrTeam = false }) {
  const isMe = message.isMe;
  const isSystem = message.senderId === 'system';

  if (isSystem) {
    return (
      <div className="message-system-row">
        <span className="message-system-bubble">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`message-row ${isMe ? 'row-outgoing' : 'row-incoming'}`}>
      {/* Incoming avatar (only for others) */}
      {!isMe && (
        <div className="msg-avatar" aria-hidden="true">
          {getInitials(message.senderName)}
        </div>
      )}

      <div className="message-bubble-wrapper">
        {/* Show sender name if incoming & in team/group conversation */}
        {!isMe && isGroupOrTeam && message.senderName && (
          <span className="message-sender-name">
            {message.senderName}
          </span>
        )}

        <div className={`message-bubble ${isMe ? 'bubble-outgoing' : 'bubble-incoming'}`}>
          <p className="message-text">{message.text}</p>
          <span className="message-time">{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
