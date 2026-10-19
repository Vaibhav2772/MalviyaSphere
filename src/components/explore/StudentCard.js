import React from 'react';
import { 
  UserPlus, 
  Clock, 
  Check, 
  UserCheck, 
  ExternalLink, 
  Briefcase, 
  Layers, 
  Award,
  BookOpen
} from 'lucide-react';
import { INTEREST_CATEGORIES, SKILL_LEVELS } from '../../data/onboardingData';
import { useRouter } from '../../context/RouterContext';
import './StudentCard.css';

function getInitials(name = '') {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function StudentCard({
  student,
  connectionState = 'connect', // 'connect' | 'pending' | 'connected'
  isFollowing = false,
  onToggleConnect,
  onToggleFollow,
}) {
  const { navigate } = useRouter();

  // Find skill level metadata
  const skillInfo = SKILL_LEVELS.find((l) => l.id === student.skillLevel) || {
    label: student.skillLevel || 'Learner',
  };

  // Find interest categories
  const studentCategories = (student.interests || []).map((catId) =>
    INTEREST_CATEGORIES.find((c) => c.id === catId)
  ).filter(Boolean);

  // Manageable display counts
  const maxInterests = 2;
  const displayedInterests = studentCategories.slice(0, maxInterests);
  const remainingInterestsCount = Math.max(0, studentCategories.length - maxInterests);

  const maxNiches = 3;
  const allNiches = student.niches || [];
  const displayedNiches = allNiches.slice(0, maxNiches);
  const remainingNichesCount = Math.max(0, allNiches.length - maxNiches);

  const numProjects = student.projects?.length || 0;

  // View Profile Action
  const handleViewProfile = () => {
    navigate(`/profile/${student.id}`);
  };

  return (
    <div className="student-profile-card" data-testid={`student-card-${student.id}`}>
      {/* Top Header: Avatar & Names */}
      <div className="student-card-top">
        <div className="student-avatar-frame" aria-hidden="true">
          {student.avatar ? (
            <img src={student.avatar} alt={student.fullName} className="student-avatar-img" />
          ) : (
            <div className="student-avatar-fallback">
              {getInitials(student.fullName)}
            </div>
          )}
        </div>

        <div className="student-header-meta">
          <div className="student-name-row">
            <h3 className="student-card-name" onClick={handleViewProfile} title="View Profile">
              {student.fullName}
            </h3>
            {student.isCurrentUser && (
              <span className="current-user-tag">You</span>
            )}
          </div>
          <p className="student-academic-text">
            <BookOpen size={13} className="academic-icon" />
            <span>{student.branch} · {student.academicYear}</span>
          </p>
        </div>
      </div>

      {/* Bio */}
      {student.bio && (
        <p className="student-card-bio">
          {student.bio}
        </p>
      )}

      {/* Meta Indicators: Skill Level & Projects count */}
      <div className="student-indicators-row">
        <span className={`skill-level-indicator skill-${student.skillLevel || 'learner'}`}>
          <Award size={13} />
          <span>{skillInfo.label}</span>
        </span>

        <span className="projects-count-indicator">
          <Briefcase size={13} />
          <span>{numProjects} {numProjects === 1 ? 'Project' : 'Projects'}</span>
        </span>

        {student.availability && (
          <span className="availability-indicator">
            {student.availability.charAt(0).toUpperCase() + student.availability.slice(1)}
          </span>
        )}
      </div>

      {/* Selected Interests */}
      {studentCategories.length > 0 && (
        <div className="student-interests-section">
          <span className="section-mini-label">Interests:</span>
          <div className="card-pills-wrap">
            {displayedInterests.map((cat) => {
              const IconComp = cat.icon;
              return (
                <span key={cat.id} className={`interest-badge ${cat.colorClass}`}>
                  {IconComp && <IconComp size={12} />}
                  <span>{cat.name}</span>
                </span>
              );
            })}
            {remainingInterestsCount > 0 && (
              <span className="more-badge" title="More interests">
                +{remainingInterestsCount} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Niches / Specializations */}
      {allNiches.length > 0 && (
        <div className="student-niches-section">
          <span className="section-mini-label">Niches & Skills:</span>
          <div className="card-pills-wrap">
            {displayedNiches.map((niche, idx) => (
              <span key={idx} className="niche-badge">
                <Layers size={11} />
                <span>{niche}</span>
              </span>
            ))}
            {remainingNichesCount > 0 && (
              <span className="more-badge" title="More niches">
                +{remainingNichesCount} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Goals Preview (1-2 main goals) */}
      {student.goals && student.goals.length > 0 && (
        <div className="student-goals-section">
          <span className="section-mini-label">Looking for:</span>
          <p className="student-goal-text">
            {student.goals.slice(0, 2).map((g) => {
              if (g.includes('hackathon')) return 'Hackathon teammates';
              if (g.includes('band') || g.includes('recording')) return 'Jamming & band partners';
              if (g.includes('squad') || g.includes('tournaments')) return 'Esports squad';
              if (g.includes('teammates') || g.includes('sports')) return 'Sports practice partners';
              if (g.includes('collab') || g.includes('dev-collab')) return 'Design & dev collaboration';
              if (g.includes('learn')) return 'Learning & peer sparring';
              if (g.includes('mentor')) return 'Mentorship & knowledge sharing';
              return 'Campus collaboration';
            }).join(' · ')}
          </p>
        </div>
      )}

      {/* Actions Footer */}
      <div className="student-card-actions">
        {/* Connect Action */}
        <button
          type="button"
          onClick={() => onToggleConnect(student.id)}
          className={`btn-card-action btn-connect state-${connectionState}`}
          aria-label={`${connectionState} with ${student.fullName}`}
          title={
            connectionState === 'pending'
              ? 'Request Pending (click to mark connected)'
              : connectionState === 'connected'
              ? 'Connected (click to disconnect)'
              : 'Send Connect Request'
          }
        >
          {connectionState === 'pending' ? (
            <>
              <Clock size={14} />
              <span>Pending</span>
            </>
          ) : connectionState === 'connected' ? (
            <>
              <Check size={14} />
              <span>Connected</span>
            </>
          ) : (
            <>
              <UserPlus size={14} />
              <span>Connect</span>
            </>
          )}
        </button>

        {/* Follow Action */}
        <button
          type="button"
          onClick={() => onToggleFollow(student.id)}
          className={`btn-card-action btn-follow ${isFollowing ? 'is-following' : ''}`}
          aria-label={isFollowing ? `Unfollow ${student.fullName}` : `Follow ${student.fullName}`}
        >
          {isFollowing ? (
            <>
              <UserCheck size={14} />
              <span>Following</span>
            </>
          ) : (
            <span>Follow</span>
          )}
        </button>

        {/* View Profile Action */}
        <button
          type="button"
          onClick={handleViewProfile}
          className="btn-card-action btn-view-profile"
          aria-label={`View profile of ${student.fullName}`}
        >
          <span>View Profile</span>
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}

export default StudentCard;
