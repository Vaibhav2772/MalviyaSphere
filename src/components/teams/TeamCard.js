import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useTeams } from '../../context/TeamsContext';
import { computeRecruitmentStatus } from '../../data/teamsData';
import { 
  Users, 
  ArrowRight, 
  Check, 
  Clock, 
  ExternalLink, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import './TeamCard.css';

function getInitials(name = '') {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function TeamCard({ team, onRequestJoin }) {
  const { navigate } = useRouter();
  const { 
    isTeamMember, 
    isTeamLead, 
    getUserJoinRequest, 
    getTeamLead, 
    getPopulatedMembers 
  } = useTeams();

  const recruitmentStatus = computeRecruitmentStatus(team);
  const currentMembersCount = team.members ? team.members.length : 0;
  const max = team.maxMembers || 4;
  const isMember = isTeamMember(team);
  const isLead = isTeamLead(team);
  const pendingRequest = getUserJoinRequest(team.id);
  const lead = getTeamLead(team);
  const populatedMembers = getPopulatedMembers(team);

  // Status Badge Class & Label
  const statusInfo = {
    open: { label: 'Recruitment Open', class: 'status-open' },
    almost_full: { label: 'Almost Full (1 Spot Left)', class: 'status-almost-full' },
    closed: { label: 'Recruitment Closed', class: 'status-closed' },
  }[recruitmentStatus] || { label: 'Closed', class: 'status-closed' };

  const handleCardClick = () => {
    navigate(`/teams/${team.id}`);
  };

  return (
    <article className="team-card" data-testid={`team-card-${team.id}`}>
      {/* Top Header: Logo, Name, Category & Recruitment Status */}
      <div className="team-card-header">
        <div className="team-logo-title-row">
          <div className="team-avatar-icon" aria-hidden="true">
            {team.logo || '🚀'}
          </div>
          <div className="team-title-meta">
            <h3 className="team-card-name" onClick={handleCardClick} title="View Team Details">
              {team.name}
            </h3>
            <span className="team-category-badge">
              {team.categoryLabel || team.category}
            </span>
          </div>
        </div>

        <div className={`team-recruitment-pill ${statusInfo.class}`}>
          <span className="status-dot" aria-hidden="true"></span>
          <span>{statusInfo.label}</span>
        </div>
      </div>

      {/* Short Objective */}
      <p className="team-card-objective">
        {team.objective}
      </p>

      {/* Skills Required */}
      {team.requiredSkills && team.requiredSkills.length > 0 && (
        <div className="team-skills-wrap">
          <span className="team-section-subhead">Required Skills:</span>
          <div className="team-skills-pills">
            {team.requiredSkills.slice(0, 4).map((skill, idx) => (
              <span key={idx} className="team-skill-tag">
                {skill}
              </span>
            ))}
            {team.requiredSkills.length > 4 && (
              <span className="team-skill-tag more">
                +{team.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Open Roles Vacancies */}
      {team.openRoles && team.openRoles.length > 0 && recruitmentStatus !== 'closed' && (
        <div className="team-open-roles-preview">
          <span className="team-section-subhead">
            <Briefcase size={12} />
            <span>Open Vacancies ({team.openRoles.length}):</span>
          </span>
          <div className="team-role-chips">
            {team.openRoles.slice(0, 2).map((role) => (
              <span key={role.id} className="team-role-chip" title={role.description}>
                {role.title}
              </span>
            ))}
            {team.openRoles.length > 2 && (
              <span className="team-role-chip more">
                +{team.openRoles.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Team Meta: Lead & Members count */}
      <div className="team-meta-row">
        {/* Creator / Lead */}
        <div className="team-lead-info">
          <span className="meta-label">Lead:</span>
          <div className="lead-avatar-name" onClick={() => lead?.id && navigate(`/profile/${lead.id}`)}>
            <div className="lead-avatar-sm">
              {getInitials(lead?.fullName)}
            </div>
            <span className="lead-name-text">{lead?.fullName || 'Campus Scholar'}</span>
          </div>
        </div>

        {/* Member Avatars & Capacity */}
        <div className="team-capacity-info">
          <div className="member-avatars-stack">
            {populatedMembers.slice(0, 3).map((m, idx) => (
              <div 
                key={idx} 
                className="member-avatar-stacked" 
                title={`${m.student?.fullName || 'Member'} (${m.role})`}
              >
                {getInitials(m.student?.fullName)}
              </div>
            ))}
            {populatedMembers.length > 3 && (
              <div className="member-avatar-stacked count">
                +{populatedMembers.length - 3}
              </div>
            )}
          </div>
          <span className="team-size-counter">
            <Users size={13} />
            <strong>{currentMembersCount}</strong>/{max} Members
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="team-card-actions">
        {/* Join Action */}
        {isMember ? (
          <div className="btn-team-action member-badge">
            <Check size={14} />
            <span>{isLead ? 'You Lead This Team' : 'Member'}</span>
          </div>
        ) : pendingRequest ? (
          <button
            type="button"
            onClick={handleCardClick}
            className="btn-team-action pending-badge"
            title="Join request pending review"
          >
            <Clock size={14} />
            <span>Request Pending</span>
          </button>
        ) : recruitmentStatus !== 'closed' ? (
          <button
            type="button"
            onClick={() => onRequestJoin(team)}
            className="btn-team-action btn-request-join"
          >
            <span>Request to Join</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <div className="btn-team-action closed-badge">
            <AlertCircle size={14} />
            <span>Full / Closed</span>
          </div>
        )}

        {/* View Details Action */}
        <button
          type="button"
          onClick={handleCardClick}
          className="btn-team-action btn-view-details"
        >
          <span>View Details</span>
          <ExternalLink size={14} />
        </button>
      </div>
    </article>
  );
}

export default TeamCard;
