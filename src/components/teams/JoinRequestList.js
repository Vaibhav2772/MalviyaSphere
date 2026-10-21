import React, { useState } from 'react';
import { useTeams } from '../../context/TeamsContext';
import { useStudents } from '../../context/StudentContext';
import { useRouter } from '../../context/RouterContext';
import { 
  Check, 
  X, 
  Clock, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Inbox
} from 'lucide-react';
import './JoinRequestList.css';

function getInitials(name = '') {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function JoinRequestList({ team }) {
  const { joinRequests, respondToJoinRequest } = useTeams();
  const { students } = useStudents();
  const { navigate } = useRouter();

  const [feedback, setFeedback] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  if (!team) return null;

  const currentCount = team.members ? team.members.length : 0;
  const isFull = currentCount >= (team.maxMembers || 4);

  // Filter requests for this specific team
  const teamRequests = joinRequests.filter((r) => r.teamId === team.id);
  const pendingRequests = teamRequests.filter((r) => r.status === 'pending');
  const pastRequests = teamRequests.filter((r) => r.status !== 'pending');

  const handleAction = async (requestId, action) => {
    try {
      setProcessingId(requestId);
      setFeedback(null);
      respondToJoinRequest(requestId, action);
      setFeedback({
        type: 'success',
        message: action === 'accept' ? 'Application accepted! Student added to team roster.' : 'Application declined.',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Action failed.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="join-requests-section">
      <div className="requests-header-row">
        <div>
          <h3 className="requests-section-title">
            Incoming Join Requests ({pendingRequests.length})
          </h3>
          <p className="requests-section-subtitle">
            Review and evaluate student applications to collaborate with your team.
          </p>
        </div>
      </div>

      {feedback && (
        <div className={`requests-feedback-bar ${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {isFull && pendingRequests.length > 0 && (
        <div className="requests-capacity-warning">
          <AlertCircle size={16} />
          <span>
            <strong>Team is at full capacity ({team.maxMembers}/{team.maxMembers}).</strong> You cannot accept additional requests unless you increase team size or remove an existing member.
          </span>
        </div>
      )}

      {pendingRequests.length === 0 ? (
        <div className="no-requests-box">
          <Inbox size={32} className="no-requests-icon" />
          <h4 className="no-requests-title">No Pending Requests</h4>
          <p className="no-requests-text">
            All applications have been reviewed. Share your team with fellow students or invite peers directly.
          </p>
        </div>
      ) : (
        <div className="requests-list">
          {pendingRequests.map((req) => {
            const student = students.find((s) => s.id === req.studentId) || {
              fullName: 'Campus Scholar',
              branch: 'MMMUT Student',
              academicYear: 'Undergraduate',
            };

            return (
              <div key={req.id} className="request-card">
                <div className="request-card-left">
                  <div className="request-avatar">
                    {getInitials(student.fullName)}
                  </div>
                  <div className="request-student-meta">
                    <div className="request-name-row">
                      <h4 
                        className="request-student-name"
                        onClick={() => navigate(`/profile/${student.id}`)}
                        title="View Profile"
                      >
                        {student.fullName}
                      </h4>
                      <button
                        type="button"
                        onClick={() => navigate(`/profile/${student.id}`)}
                        className="btn-req-view-profile"
                        title="View Full Student Profile"
                      >
                        <ExternalLink size={12} />
                        <span>Profile</span>
                      </button>
                    </div>

                    <p className="request-academic-line">
                      {student.branch} · {student.academicYear}
                    </p>

                    {req.message && (
                      <p className="request-message-quote">
                        "{req.message}"
                      </p>
                    )}

                    <div className="request-meta-chips">
                      <span className="req-date-chip">
                        <Clock size={11} />
                        <span>Applied: {req.createdAt || 'Recent'}</span>
                      </span>
                      {req.roleTitle && (
                        <span className="req-role-chip">
                          Role: {req.roleTitle}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="request-card-actions">
                  <button
                    type="button"
                    onClick={() => handleAction(req.id, 'accept')}
                    disabled={isFull || processingId === req.id}
                    className="btn-req-accept"
                    title={isFull ? 'Cannot accept: team is full' : 'Accept application into team'}
                  >
                    <Check size={14} />
                    <span>Accept</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(req.id, 'reject')}
                    disabled={processingId === req.id}
                    className="btn-req-reject"
                    title="Decline application"
                  >
                    <X size={14} />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past / Resolved Requests history preview */}
      {pastRequests.length > 0 && (
        <div className="past-requests-group">
          <h4 className="past-requests-title">Resolved Applications</h4>
          <div className="past-requests-list">
            {pastRequests.map((req) => {
              const student = students.find((s) => s.id === req.studentId);
              return (
                <div key={req.id} className="past-request-item">
                  <span className="past-name">{student?.fullName || req.studentId}</span>
                  <span className={`past-status-pill ${req.status}`}>
                    {req.status === 'accepted' ? 'Accepted' : 'Declined'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinRequestList;
