import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { 
  ArrowLeft, 
  ExternalLink, 
  Flag, 
  MoreVertical, 
  Info, 
  Unlock,
  Lock
} from 'lucide-react';
import './ChatHeader.css';

function getInitials(name = '') {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function ChatHeader({
  conversation,
  onBackToList,
  onOpenReport,
  onOpenBlock,
  onToggleDetails,
  isBlocked = false,
  onUnblock,
}) {
  const { navigate } = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!conversation) return null;

  const isDirect = conversation.type === 'direct';
  const isTeam = conversation.type === 'team';

  const handleViewProfileOrTeam = () => {
    if (isDirect && conversation.otherStudentId) {
      navigate(`/profile/${conversation.otherStudentId}`);
    } else if (isTeam && conversation.teamId) {
      navigate(`/teams/${conversation.teamId}`);
    }
  };

  return (
    <div className="chat-header-root">
      <div className="chat-header-left">
        {/* Mobile Back to List Button */}
        <button
          type="button"
          onClick={onBackToList}
          className="btn-chat-back-mobile"
          aria-label="Back to conversations list"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Avatar */}
        <div className="chat-header-avatar">
          {isTeam ? (
            <div className="header-avatar-team">
              {conversation.avatar || '🚀'}
            </div>
          ) : conversation.type === 'group' ? (
            <div className="header-avatar-group">
              {conversation.avatar || '⚡'}
            </div>
          ) : (
            <div className="header-avatar-direct">
              {getInitials(conversation.title)}
            </div>
          )}

          {conversation.isOnline && (
            <span className="header-online-dot" title="Online"></span>
          )}
        </div>

        {/* Name and Subtitle */}
        <div className="chat-header-info">
          <div className="chat-header-title-row">
            <h3 className="chat-header-title">{conversation.title}</h3>
            {isBlocked && <span className="header-blocked-pill">Blocked</span>}
          </div>

          <p className="chat-header-subtitle">
            {isDirect ? (
              conversation.isOnline ? (
                <span className="status-online-text">Online</span>
              ) : (
                <span className="status-offline-text">Offline</span>
              )
            ) : isTeam ? (
              <span>Team Discussion Room</span>
            ) : (
              <span>Group Chat</span>
            )}
          </p>
        </div>
      </div>

      {/* Header Right Actions */}
      <div className="chat-header-right">
        {/* Quick Link: View Profile / Team */}
        <button
          type="button"
          onClick={handleViewProfileOrTeam}
          className="btn-header-link"
          title={isDirect ? 'View student profile' : 'View project team details'}
        >
          <span>{isDirect ? 'View Profile' : 'Team Details'}</span>
          <ExternalLink size={13} />
        </button>

        {/* Toggle Details Drawer (Team or Group) */}
        {(isTeam || conversation.type === 'group') && (
          <button
            type="button"
            onClick={onToggleDetails}
            className="btn-header-icon-action"
            title="Toggle team / group members panel"
            aria-label="Toggle team members info"
          >
            <Info size={17} />
          </button>
        )}

        {/* More Actions Dropdown Menu (Block & Report) */}
        <div className="header-dropdown-wrap">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="btn-header-more"
            aria-label="Conversation actions"
            aria-expanded={dropdownOpen}
          >
            <MoreVertical size={18} />
          </button>

          {dropdownOpen && (
            <div className="header-menu-dropdown">
              {isDirect && (
                isBlocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onUnblock();
                    }}
                    className="dropdown-item-action"
                  >
                    <Unlock size={14} />
                    <span>Unblock Student</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenBlock();
                    }}
                    className="dropdown-item-action danger"
                  >
                    <Lock size={14} />
                    <span>Block Student</span>
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenReport();
                }}
                className="dropdown-item-action danger"
              >
                <Flag size={14} />
                <span>Report Conversation</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
