import React, { useState } from 'react';
import { useStudents } from '../../context/StudentContext';
import { useTeams } from '../../context/TeamsContext';
import { X, Search, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import './TeamInviteModal.css';

function getInitials(name = '') {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function TeamInviteModal({ isOpen, onClose, team }) {
  const { students } = useStudents();
  const { inviteStudent, isTeamMember, invitations } = useTeams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !team) return null;

  const currentMembersCount = team.members ? team.members.length : 0;
  const isFull = currentMembersCount >= (team.maxMembers || 4);

  // Eligible students for invitation:
  // Not already in team
  const availableStudents = students.filter((s) => {
    if (s.id === 'me' || s.isCurrentUser) return false;
    const inTeam = isTeamMember(team, s.id);
    return !inTeam;
  });

  // Filter by search query
  const filteredStudents = availableStudents.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesName = s.fullName.toLowerCase().includes(q);
    const matchesBranch = s.branch && s.branch.toLowerCase().includes(q);
    const matchesSkills = (s.niches || []).some((n) => n.toLowerCase().includes(q));
    return matchesName || matchesBranch || matchesSkills;
  });

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      setFeedback({ type: 'error', message: 'Please select a student to invite.' });
      return;
    }

    try {
      setIsSubmitting(true);
      const studentObj = students.find((s) => s.id === selectedStudentId);
      inviteStudent(
        team.id,
        selectedStudentId,
        roleTitle.trim() || 'Team Collaborator',
        message.trim() || `Hi ${studentObj?.fullName || 'there'}, you've been invited to collaborate with ${team.name}!`
      );

      setFeedback({
        type: 'success',
        message: `Invitation successfully sent to ${studentObj?.fullName || 'student'}!`,
      });
      setSelectedStudentId('');
      setRoleTitle('');
      setMessage('');
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to send invitation.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="invite-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="invite-modal-title">
      <div className="invite-modal-card">
        {/* Header */}
        <div className="invite-modal-header">
          <div className="invite-header-title-group">
            <UserPlus size={20} className="invite-header-icon" />
            <div>
              <h3 id="invite-modal-title" className="invite-modal-title">
                Invite Collaborators to {team.name}
              </h3>
              <p className="invite-modal-subtitle">
                Search campus students by branch, year, or specialized niches.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-modal-close"
            aria-label="Close invite modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="invite-modal-body">
          {isFull ? (
            <div className="invite-notice-full">
              <AlertCircle size={20} />
              <span>
                This team has reached its capacity limit of <strong>{team.maxMembers} members</strong>. You must expand the maximum team size or remove an inactive slot before inviting new members.
              </span>
            </div>
          ) : (
            <>
              {feedback && (
                <div className={`invite-feedback-box ${feedback.type}`}>
                  {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{feedback.message}</span>
                </div>
              )}

              <form onSubmit={handleSendInvite} className="invite-form">
                {/* Search / Filter Student */}
                <div className="form-group">
                  <label htmlFor="student-search-input" className="form-label">
                    1. Search Students to Invite
                  </label>
                  <div className="invite-search-input-wrap">
                    <Search size={15} className="search-icon" />
                    <input
                      id="student-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, branch, or skill (e.g. React, OpenCV)..."
                      className="form-input search-input"
                    />
                  </div>
                </div>

                {/* Candidate List */}
                <div className="candidates-list-wrap">
                  {filteredStudents.length === 0 ? (
                    <div className="no-candidates">
                      No eligible students found matching "{searchQuery}".
                    </div>
                  ) : (
                    filteredStudents.map((s) => {
                      const isSelected = selectedStudentId === s.id;
                      const hasPendingInvite = invitations.some(
                        (i) => i.teamId === team.id && i.studentId === s.id && i.status === 'pending'
                      );

                      return (
                        <div
                          key={s.id}
                          onClick={() => !hasPendingInvite && setSelectedStudentId(s.id)}
                          className={`candidate-item ${isSelected ? 'selected' : ''} ${hasPendingInvite ? 'pending-disabled' : ''}`}
                        >
                          <div className="candidate-avatar">
                            {getInitials(s.fullName)}
                          </div>
                          <div className="candidate-info">
                            <div className="candidate-name-row">
                              <span className="candidate-name">{s.fullName}</span>
                              <span className="candidate-branch">{s.branch} · {s.academicYear}</span>
                            </div>
                            {s.niches && s.niches.length > 0 && (
                              <div className="candidate-niches">
                                {s.niches.slice(0, 3).map((n, i) => (
                                  <span key={i} className="candidate-niche-pill">{n}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          {hasPendingInvite ? (
                            <span className="already-invited-badge">Invited</span>
                          ) : isSelected ? (
                            <span className="selected-check-badge">Selected</span>
                          ) : null}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Role and Message */}
                <div className="form-group">
                  <label htmlFor="invite-role" className="form-label">
                    2. Role / Position Title
                  </label>
                  <input
                    id="invite-role"
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Computer Vision Engineer, Frontend Lead"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="invite-msg" className="form-label">
                    3. Personal Invitation Note
                  </label>
                  <textarea
                    id="invite-msg"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hey! We saw your work and would love you to join our project team..."
                    className="form-textarea"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="invite-modal-footer">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-modal-cancel"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedStudentId || isSubmitting}
                    className="btn-modal-submit"
                  >
                    <UserPlus size={15} />
                    <span>Send Team Invitation</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamInviteModal;
