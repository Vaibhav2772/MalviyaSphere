import React from 'react';
import './ConversationItem.css';

function getInitials(name = '') {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function ConversationItem({ conversation, isActive, onClick }) {
  const isTeam = conversation.type === 'team';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`conv-item ${isActive ? 'is-active' : ''}`}
      aria-pressed={isActive}
    >
      {/* Avatar with Online/Offline indicator */}
      <div className="conv-avatar-wrap">
        {isTeam ? (
          <div className="conv-avatar-team">
            {conversation.avatar || '🚀'}
          </div>
        ) : conversation.type === 'group' ? (
          <div className="conv-avatar-group">
            {conversation.avatar || '⚡'}
          </div>
        ) : (
          <div className="conv-avatar-direct">
            {getInitials(conversation.title)}
          </div>
        )}

        {/* Online Status Dot */}
        {conversation.isOnline && (
          <span className="online-indicator-dot" title="Online" aria-hidden="true"></span>
        )}
      </div>

      {/* Info Block */}
      <div className="conv-info-block">
        <div className="conv-top-line">
          <h4 className="conv-title">{conversation.title}</h4>
          <span className="conv-time">
            {conversation.lastMessage?.timestamp || ''}
          </span>
        </div>

        <div className="conv-bottom-line">
          <p className="conv-preview-text">
            {conversation.lastMessage?.senderId === 'me' ? 'You: ' : ''}
            {conversation.lastMessage?.text || 'No messages yet'}
          </p>

          <div className="conv-badges-wrap">
            {isTeam && <span className="conv-type-pill team">Team</span>}
            {conversation.type === 'group' && <span className="conv-type-pill group">Group</span>}
            {conversation.unreadCount > 0 && (
              <span className="conv-unread-badge">{conversation.unreadCount}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConversationItem;
