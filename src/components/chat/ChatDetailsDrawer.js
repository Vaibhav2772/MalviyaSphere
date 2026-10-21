import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useTeams } from '../../context/TeamsContext';
import { X, Users, ExternalLink, Globe, ArrowRight } from 'lucide-react';
import './ChatDetailsDrawer.css';

function getInitials(name = '') {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function ChatDetailsDrawer({ isOpen, onClose, conversation }) {
  const { navigate } = useRouter();
  const { getTeamById, getPopulatedMembers } = useTeams();

  if (!isOpen || !conversation) return null;

  const isTeam = conversation.type === 'team';
  const team = isTeam ? getTeamById(conversation.teamId) : null;
  const populatedMembers = team ? getPopulatedMembers(team) : [];

  return (
    <aside className="chat-drawer-root" aria-label="Conversation Details Panel">
      <div className="drawer-header">
        <h4 className="drawer-title">
          {isTeam ? 'Team Information' : 'Group Details'}
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="btn-drawer-close"
          aria-label="Close details drawer"
        >
          <X size={16} />
        </button>
      </div>

      <div className="drawer-body">
        {/* Top Info */}
        <div className="drawer-top-info">
          <div className="drawer-avatar">
            {conversation.avatar || '🚀'}
          </div>
          <h3 className="drawer-name">{conversation.title}</h3>
          {team && (
            <p className="drawer-objective">{team.objective}</p>
          )}
        </div>

        {/* Link to Team Details Page */}
        {team && (
          <div className="drawer-action-row">
            <button
              type="button"
              onClick={() => navigate(`/teams/${team.id}`)}
              className="btn-drawer-view-team"
            >
              <span>View Full Team Details</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Project Link */}
        {team?.projectLink && (
          <div className="drawer-meta-box">
            <span className="drawer-meta-label">Project Repository</span>
            <a
              href={team.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-repo-link"
            >
              <Globe size={13} />
              <span>{team.projectLink}</span>
            </a>
          </div>
        )}

        {/* Team Members List */}
        {team && populatedMembers.length > 0 && (
          <div className="drawer-members-section">
            <div className="drawer-members-heading">
              <Users size={14} />
              <span>Team Members ({populatedMembers.length}/{team.maxMembers || 4})</span>
            </div>

            <div className="drawer-members-list">
              {populatedMembers.map((m, idx) => (
                <div key={idx} className="drawer-member-item">
                  <div className="drawer-member-avatar">
                    {getInitials(m.student?.fullName)}
                  </div>
                  <div className="drawer-member-info">
                    <span
                      className="drawer-member-name"
                      onClick={() => m.student?.id && navigate(`/profile/${m.student.id}`)}
                    >
                      {m.student?.fullName || 'Student'}
                    </span>
                    <span className="drawer-member-role">{m.role}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => m.student?.id && navigate(`/profile/${m.student.id}`)}
                    className="btn-drawer-member-profile"
                    title="View Profile"
                  >
                    <ExternalLink size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default ChatDetailsDrawer;
