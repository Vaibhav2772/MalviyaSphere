import React from 'react';
import { 
  INTEREST_CATEGORIES, 
  getPersonalizedGoals, 
  SKILL_LEVELS 
} from '../../data/onboardingData';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Target, 
  Award,
  User,
  ChevronRight
} from 'lucide-react';

function OnboardingCompletion({ profileData, onFinish }) {
  // Map interest IDs to full details
  const activeInterests = INTEREST_CATEGORIES.filter((cat) =>
    (profileData.interests || []).includes(cat.id)
  );

  // Dynamic goals lookup
  const allGoals = getPersonalizedGoals(profileData.interests || [], profileData.selectedPaths || []);
  const activeGoals = allGoals.filter((g) =>
    (profileData.goals || []).includes(g.id)
  );

  // Find skill level details
  const skillInfo = SKILL_LEVELS.find((lvl) => lvl.id === profileData.skillLevel) || {
    label: profileData.skillLevel || 'Learner',
    tagline: 'Active participant',
  };

  return (
    <div className="onboarding-completion-root" role="status" aria-labelledby="completion-title">
      {/* Success Badge & Header */}
      <div className="completion-hero-header">
        <div className="completion-icon-wrapper">
          <CheckCircle2 size={42} className="completion-check-icon" />
        </div>
        <h2 id="completion-title" className="completion-main-heading">
          Your sphere is taking shape!
        </h2>
        <p className="completion-main-description">
          Your interests and goals are ready. You're one step closer to finding your people.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="completion-summary-card">
        {/* Top User Identity Row */}
        <div className="summary-user-header">
          <div className="summary-avatar-frame">
            {profileData.avatar ? (
              <img src={profileData.avatar} alt={profileData.fullName} className="summary-avatar-img" />
            ) : (
              <div className="summary-avatar-fallback">
                <User size={30} />
              </div>
            )}
          </div>
          <div className="summary-user-text">
            <h3 className="summary-user-name">{profileData.fullName || 'Campus Scholar'}</h3>
            <p className="summary-academic-line">
              <BookOpen size={14} className="inline-icon" />
              <span>{profileData.branch || 'Undergraduate'} · {profileData.academicYear || 'Student'}</span>
            </p>
            <span className="summary-college-pill">
              Madan Mohan Malaviya University of Technology
            </span>
          </div>
        </div>

        <div className="summary-divider" />

        {/* Selected Interests & Niches */}
        <div className="summary-details-section">
          <div className="summary-row-label">
            <Sparkles size={16} className="summary-section-icon icon-indigo" />
            <span>Selected Interests ({activeInterests.length})</span>
          </div>
          <div className="summary-interests-badges-list">
            {activeInterests.map((interest) => {
              const IconComp = interest.icon;
              return (
                <span key={interest.id} className={`summary-interest-pill ${interest.colorClass}`}>
                  {IconComp && <IconComp size={14} />}
                  <span>{interest.name}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Selected Specialization Paths / Niches */}
        {((profileData.selectedPaths && profileData.selectedPaths.length > 0) || (profileData.niches && profileData.niches.length > 0)) && (
          <div className="summary-details-section">
            <div className="summary-row-label">
              <Layers size={16} className="summary-section-icon icon-purple" />
              <span>Specializations & Niches ({profileData.selectedPaths?.length || profileData.niches?.length || 0})</span>
            </div>
            {profileData.selectedPaths && profileData.selectedPaths.length > 0 ? (
              <div className="summary-paths-list">
                {profileData.selectedPaths.map((path) => (
                  <div key={path.pathId} className="summary-path-item">
                    <span className="summary-path-text">
                      {path.pathLabels.map((lbl, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && <ChevronRight size={12} className="summary-path-separator" />}
                          <span className={idx === path.pathLabels.length - 1 ? 'summary-path-leaf' : 'summary-path-branch'}>
                            {lbl}
                          </span>
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="summary-niches-tags-wrap">
                {profileData.niches.map((niche) => (
                  <span key={niche} className="summary-niche-chip">
                    {niche}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skill Level & Experience */}
        <div className="summary-details-section">
          <div className="summary-row-label">
            <Award size={16} className="summary-section-icon icon-emerald" />
            <span>Skill Level</span>
          </div>
          <div className="summary-skill-chip-box">
            <span className="skill-chip-name">{skillInfo.label}</span>
            <span className="skill-chip-tagline">({skillInfo.tagline})</span>
          </div>
        </div>

        {/* Goals */}
        {activeGoals.length > 0 && (
          <div className="summary-details-section">
            <div className="summary-row-label">
              <Target size={16} className="summary-section-icon icon-amber" />
              <span>Main Collaboration Goals</span>
            </div>
            <div className="summary-goals-list">
              {activeGoals.map((goal) => (
                <span key={goal.id} className="summary-goal-item">
                  ✓ {goal.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Completion Simulated Notice */}
      <div className="completion-simulated-note">
        <p>
          <strong>Notice:</strong> Your onboarding profile is saved to this browser's session and mock authentication state. No backend API is connected in this frontend preview.
        </p>
      </div>

      {/* Action Button: Continue to MalviyaSphere */}
      <div className="completion-actions-wrapper">
        <button
          type="button"
          onClick={onFinish}
          className="btn-primary completion-finish-btn"
        >
          <span>Continue to MalviyaSphere</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

export default OnboardingCompletion;
