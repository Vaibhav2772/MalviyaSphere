import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useTeams } from '../context/TeamsContext';
import { computeRecruitmentStatus } from '../data/teamsData';
import JoinRequestList from '../components/teams/JoinRequestList';
import TeamInviteModal from '../components/teams/TeamInviteModal';
import RequestJoinModal from '../components/teams/RequestJoinModal';
import {
  ArrowLeft,
  Users,
  Briefcase,
  ExternalLink,
  MessageSquare,
  UserPlus,
  Clock,
  AlertTriangle,
  Layers,
  Settings,
  Calendar,
  Globe,
  Share2,
  Lock,
  Unlock
} from 'lucide-react';
import './TeamDetails.css';

function getInitials(name = '') {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function TeamDetails() {
  const { currentPath, navigate } = useRouter();
  const {
    getTeamById,
    isTeamLead,
    isTeamMember,
    getUserJoinRequest,
    cancelJoinRequest,
    toggleRecruitmentStatus,
    getPopulatedMembers,
    getTeamLead,
  } = useTeams();

  // Extract teamId from URL (e.g., /teams/team-1)
  const match = currentPath.match(/^\/teams\/([^/?#]+)/);
  const teamId = match ? match[1] : null;

  const team = getTeamById(teamId);

  // Modals state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isRecruitmentManagerOpen, setIsRecruitmentManagerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 1. Invalid team fallback
  if (!team) {
    return (
      <div className="team-not-found-page">
        <div className="not-found-card">
          <AlertTriangle size={48} className="not-found-icon" />
          <h2 className="not-found-title">Team Not Found</h2>
          <p className="not-found-desc">
            We couldn't locate any project team matching identifier "<strong>{teamId}</strong>". The team might have been removed or the URL link is invalid.
          </p>
          <button
            type="button"
            onClick={() => navigate('/teams')}
            className="btn-not-found-back"
          >
            <ArrowLeft size={16} />
            <span>Back to Teams Directory</span>
          </button>
        </div>
      </div>
    );
  }

  const isLead = isTeamLead(team);
  const isMember = isTeamMember(team);
  const recruitmentStatus = computeRecruitmentStatus(team);
  const pendingRequest = getUserJoinRequest(team.id);
  const populatedMembers = getPopulatedMembers(team);
  const lead = getTeamLead(team);
  const currentCount = team.members ? team.members.length : 0;
  const max = team.maxMembers || 4;

  const statusInfo = {
    open: { label: 'Recruitment Open', class: 'status-open' },
    almost_full: { label: 'Almost Full (1 Spot Left)', class: 'status-almost-full' },
    closed: { label: 'Recruitment Closed', class: 'status-closed' },
  }[recruitmentStatus] || { label: 'Closed', class: 'status-closed' };

  // Share link handler
  const handleShareLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleOpenTeamChat = () => {
    navigate(`/messages?teamId=${team.id}`);
  };

  return (
    <div className="team-details-page-root">
      <div className="team-details-container container">
        {/* Top Back Navigation Bar */}
        <div className="team-details-top-nav">
          <button
            type="button"
            onClick={() => navigate('/teams')}
            className="btn-details-back"
          >
            <ArrowLeft size={16} />
            <span>Back to Find Your Team</span>
          </button>

          <button
            type="button"
            onClick={handleShareLink}
            className="btn-share-team"
            title="Copy link to team"
          >
            <Share2 size={14} />
            <span>{copiedLink ? 'Link Copied!' : 'Share Team'}</span>
          </button>
        </div>

        {/* 1. Hero Card */}
        <header className="team-details-hero">
          <div className="hero-main-flex">
            <div className="team-hero-logo" aria-hidden="true">
              {team.logo || '🚀'}
            </div>

            <div className="team-hero-info">
              <div className="team-title-status-line">
                <h1 className="team-hero-title">{team.name}</h1>
                <div className={`team-recruitment-pill ${statusInfo.class}`}>
                  <span className="status-dot"></span>
                  <span>{statusInfo.label}</span>
                </div>
              </div>

              <p className="team-hero-objective">
                {team.objective}
              </p>

              <div className="team-hero-badges-row">
                <span className="hero-category-badge">
                  {team.categoryLabel || team.category}
                </span>

                <span className="hero-capacity-badge">
                  <Users size={14} />
                  <span>{currentCount}/{max} Members</span>
                </span>

                {team.createdAt && (
                  <span className="hero-created-badge">
                    <Calendar size={13} />
                    <span>Created {team.createdAt}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Top Primary Actions */}
            <div className="team-hero-actions">
              {/* Member or Lead */}
              {isMember ? (
                <>
                  <button
                    type="button"
                    onClick={handleOpenTeamChat}
                    className="btn-hero-action btn-team-chat"
                    title="Open team discussion room"
                  >
                    <MessageSquare size={16} />
                    <span>Open Team Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(true)}
                    className="btn-hero-action btn-team-invite"
                  >
                    <UserPlus size={16} />
                    <span>Invite Peer</span>
                  </button>

                  {isLead && (
                    <button
                      type="button"
                      onClick={() => setIsRecruitmentManagerOpen(!isRecruitmentManagerOpen)}
                      className={`btn-hero-action btn-manage-recruitment ${isRecruitmentManagerOpen ? 'active' : ''}`}
                    >
                      <Settings size={16} />
                      <span>{isRecruitmentManagerOpen ? 'Close Management' : 'Manage Recruitment'}</span>
                    </button>
                  )}
                </>
              ) : pendingRequest ? (
                /* Pending Request state */
                <div className="pending-request-actions-box">
                  <div className="pending-status-chip">
                    <Clock size={15} />
                    <span>Application Pending Review</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => cancelJoinRequest(pendingRequest.id)}
                    className="btn-cancel-request"
                  >
                    Cancel Application
                  </button>
                </div>
              ) : recruitmentStatus !== 'closed' ? (
                /* Request to Join */
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(true)}
                  className="btn-hero-action btn-hero-join"
                >
                  <UserPlus size={16} />
                  <span>Request to Join Team</span>
                </button>
              ) : (
                /* Closed */
                <div className="closed-status-chip">
                  <Lock size={15} />
                  <span>Recruitment Closed</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 2. Management Drawer / Panel for Team Lead */}
        {isLead && isRecruitmentManagerOpen && (
          <section className="team-lead-management-panel" aria-label="Recruitment Management Controls">
            <div className="management-panel-top">
              <div className="management-title-group">
                <Settings size={18} className="manage-icon" />
                <h3 className="management-panel-title">Team Lead Recruitment Controls</h3>
              </div>
              <div className="recruitment-toggle-wrap">
                <span className="toggle-label">Recruitment Status:</span>
                <button
                  type="button"
                  onClick={() => toggleRecruitmentStatus(team.id)}
                  className={`btn-toggle-recruitment ${team.isExplicitlyClosed ? 'closed' : 'open'}`}
                >
                  {team.isExplicitlyClosed ? (
                    <>
                      <Lock size={15} />
                      <span>Currently Closed (Click to Open)</span>
                    </>
                  ) : (
                    <>
                      <Unlock size={15} />
                      <span>Currently Open (Click to Close)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Join Requests management component */}
            <JoinRequestList team={team} />
          </section>
        )}

        {/* 3. 2-Column Details Body */}
        <div className="team-details-content-grid">
          {/* Main Left Column: Description, Required Skills, Vacancies, Project Links */}
          <div className="details-col-main">
            {/* Description */}
            <section className="details-card-section">
              <h2 className="details-section-heading">About This Project</h2>
              <div className="details-body-text">
                <p>{team.description}</p>
              </div>

              {team.projectLink && (
                <div className="project-link-box">
                  <Globe size={16} className="project-link-icon" />
                  <div className="project-link-meta">
                    <span className="project-link-label">Project Repository & Resources:</span>
                    <a
                      href={team.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link-anchor"
                    >
                      <span>{team.projectLink}</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              )}
            </section>

            {/* Required Skills & Technologies */}
            {team.requiredSkills && team.requiredSkills.length > 0 && (
              <section className="details-card-section">
                <h2 className="details-section-heading">
                  <Layers size={18} className="heading-icon" />
                  <span>Required Skills & Tech Stack</span>
                </h2>
                <div className="details-skills-pills-wrap">
                  {team.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="details-skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Open Positions and Vacancies */}
            <section className="details-card-section">
              <div className="open-positions-header">
                <h2 className="details-section-heading">
                  <Briefcase size={18} className="heading-icon" />
                  <span>Open Positions & Roles ({team.openRoles?.length || 0})</span>
                </h2>
                {recruitmentStatus === 'closed' && (
                  <span className="positions-closed-tag">
                    Team is not recruiting right now
                  </span>
                )}
              </div>

              {!team.openRoles || team.openRoles.length === 0 ? (
                <p className="no-roles-p">No specific vacancies currently posted for this team.</p>
              ) : (
                <div className="open-positions-grid">
                  {team.openRoles.map((role) => (
                    <div key={role.id} className="role-card">
                      <div className="role-card-top">
                        <h3 className="role-title">{role.title}</h3>
                        {!isMember && recruitmentStatus !== 'closed' && !pendingRequest && (
                          <button
                            type="button"
                            onClick={() => setIsJoinModalOpen(true)}
                            className="btn-apply-role"
                          >
                            Apply for Role
                          </button>
                        )}
                      </div>

                      {role.skills && role.skills.length > 0 && (
                        <div className="role-skills-line">
                          {role.skills.map((s, i) => (
                            <span key={i} className="role-skill-badge">{s}</span>
                          ))}
                        </div>
                      )}

                      <p className="role-desc-text">{role.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Team Discussion Entry Box */}
            <section className="details-card-section discussion-callout-card">
              <div className="discussion-callout-content">
                <div className="discussion-icon-wrap">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <h3 className="discussion-callout-title">
                    Dedicated Team Discussion Room
                  </h3>
                  <p className="discussion-callout-desc">
                    Each team on MalviyaSphere has a linked private group discussion room in Messages for sprint synchronization, file sharing, and task planning.
                  </p>
                </div>
              </div>

              <div className="discussion-callout-action">
                <button
                  type="button"
                  onClick={handleOpenTeamChat}
                  className="btn-open-discussion-cta"
                >
                  <MessageSquare size={16} />
                  <span>{isMember ? 'Open Dedicated Discussion' : 'Preview Team Chat in Messages'}</span>
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar Right Column: Team Roster & Members */}
          <div className="details-col-side">
            {/* Team Lead Card */}
            <div className="side-card team-lead-card">
              <h3 className="side-card-title">Team Lead & Founder</h3>
              <div className="lead-display-block">
                <div className="lead-avatar-big">
                  {getInitials(lead?.fullName)}
                </div>
                <div className="lead-meta">
                  <h4 
                    className="lead-name"
                    onClick={() => lead?.id && navigate(`/profile/${lead.id}`)}
                    title="View Profile"
                  >
                    {lead?.fullName || 'Campus Scholar'}
                  </h4>
                  <p className="lead-sub">{lead?.branch || 'MMMUT'} · {lead?.academicYear || 'Student'}</p>
                  <button
                    type="button"
                    onClick={() => lead?.id && navigate(`/profile/${lead.id}`)}
                    className="btn-view-lead-profile"
                  >
                    <span>View Student Profile</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Team Roster / Members List */}
            <div className="side-card team-roster-card">
              <div className="roster-header">
                <h3 className="side-card-title">
                  Team Members ({currentCount}/{max})
                </h3>
                {isMember && (
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(true)}
                    className="btn-roster-invite"
                    title="Invite a classmate"
                  >
                    <UserPlus size={13} />
                    <span>Invite</span>
                  </button>
                )}
              </div>

              <div className="roster-members-list">
                {populatedMembers.map((m, idx) => (
                  <div key={idx} className="roster-member-item">
                    <div className="roster-avatar">
                      {getInitials(m.student?.fullName)}
                    </div>
                    <div className="roster-info">
                      <div className="roster-name-row">
                        <span 
                          className="roster-name"
                          onClick={() => m.student?.id && navigate(`/profile/${m.student.id}`)}
                          title="View Profile"
                        >
                          {m.student?.fullName || 'Student'}
                        </span>
                        {m.studentId === team.leadId && (
                          <span className="roster-lead-tag">Lead</span>
                        )}
                      </div>
                      <span className="roster-role-text">{m.role}</span>
                      <span className="roster-branch-text">{m.student?.branch}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => m.student?.id && navigate(`/profile/${m.student.id}`)}
                      className="btn-roster-view-profile"
                      title="View Member Profile"
                    >
                      <ExternalLink size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Vacant Slots Visual */}
              {max > currentCount && (
                <div className="vacant-slots-box">
                  <Users size={14} />
                  <span>{max - currentCount} open vacancy slot{max - currentCount === 1 ? '' : 's'} remaining</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <TeamInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        team={team}
      />

      {/* Join Request Modal */}
      <RequestJoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        team={team}
      />
    </div>
  );
}

export default TeamDetails;
