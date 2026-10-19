import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';
import { INTEREST_CATEGORIES, SKILL_LEVELS, COLLABORATION_PREFERENCES, AVAILABILITY_OPTIONS } from '../data/onboardingData';
import EditProfileModal from '../components/profile/EditProfileModal';
import MockMessageModal from '../components/profile/MockMessageModal';
import {
  ArrowLeft,
  UserCheck,
  UserPlus,
  Clock,
  Check,
  MessageSquare,
  Edit3,
  BookOpen,
  Briefcase,
  ExternalLink,
  Layers,
  Award,
  ShieldCheck,
  Globe,
  Target,
  Calendar,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import './StudentProfile.css';

// SVG Icons for GitHub & LinkedIn
const GithubIcon = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

function getInitials(name = '') {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function StudentProfile() {
  const { currentPath, navigate } = useRouter();
  const { user } = useAuth();
  const {
    getStudentById,
    connectionStates,
    followStates,
    toggleConnect,
    toggleFollow,
    updateStudentProfile,
  } = useStudents();

  // Extract studentId from URL: e.g. /profile/student-1 -> "student-1"
  const match = currentPath.match(/^\/profile\/([^/?#]+)/);
  const studentId = match ? match[1] : null;

  // Retrieve student data
  const student = getStudentById(studentId);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Invalid student ID -> Proper "Profile not found" page
  if (!student) {
    return (
      <div className="profile-not-found-page">
        <div className="not-found-card">
          <AlertTriangle size={48} className="not-found-icon" />
          <h2 className="not-found-title">Student Profile Not Found</h2>
          <p className="not-found-desc">
            We couldn't locate any student profile associated with the identifier "<strong>{studentId}</strong>". The student may have updated their details or the profile link might be incorrect.
          </p>
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="btn-not-found-back"
          >
            <ArrowLeft size={16} />
            <span>Back to Explore Students</span>
          </button>
        </div>
      </div>
    );
  }

  // Determine if profile belongs to current user
  const isCurrentUser =
    student.id === 'me' ||
    student.isCurrentUser ||
    (user && (student.id === `user-${user.email}` || student.email === user.email));

  // Connection and follow states
  const connectionState = connectionStates[student.id] || 'connect';
  const isFollowing = !!followStates[student.id];

  // Skill metadata
  const skillInfo = SKILL_LEVELS.find((l) => l.id === student.skillLevel) || {
    label: student.skillLevel || 'Learner',
    tagline: 'Self-reported capability',
    description: 'Active learner in domain',
  };

  // Interest categories full metadata
  const studentCategories = (student.interests || []).map((catId) =>
    INTEREST_CATEGORIES.find((c) => c.id === catId)
  ).filter(Boolean);

  // Collab preferences metadata
  const collabPrefs = (student.collabs || []).map((collabId) =>
    COLLABORATION_PREFERENCES.find((cp) => cp.id === collabId)
  ).filter(Boolean);

  // Availability label
  const availOption = AVAILABILITY_OPTIONS.find((a) => a.id === student.availability);

  // Save handler for Edit Profile
  const handleSaveProfile = (updatedFields) => {
    updateStudentProfile(student.id, updatedFields);
  };

  return (
    <div className="student-profile-page-root">
      <div className="profile-container container">
        {/* Top Back Navigation Bar */}
        <div className="profile-top-nav">
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="btn-profile-back"
          >
            <ArrowLeft size={16} />
            <span>Back to Explore</span>
          </button>
        </div>

        {/* 1. Profile Header Section */}
        <header className="profile-hero-card">
          <div className="profile-hero-main-row">
            {/* Avatar */}
            <div className="profile-avatar-wrapper">
              {student.avatar ? (
                <img src={student.avatar} alt={student.fullName} className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar-fallback">
                  {getInitials(student.fullName)}
                </div>
              )}
            </div>

            {/* Profile Info & Metadata */}
            <div className="profile-info-block">
              <div className="profile-name-row">
                <h1 className="profile-student-name">{student.fullName}</h1>
                {isCurrentUser && (
                  <span className="profile-you-badge">Your Profile</span>
                )}
              </div>

              <p className="profile-academic-line">
                <BookOpen size={15} className="inline-icon" />
                <span>
                  {student.branch} · {student.academicYear} · {student.programme || 'Undergraduate'}
                </span>
              </p>

              <p className="profile-college-line">
                Madan Mohan Malaviya University of Technology, Gorakhpur
              </p>

              {student.bio && (
                <p className="profile-bio-text">{student.bio}</p>
              )}

              {/* Interests Quick Pills */}
              {studentCategories.length > 0 && (
                <div className="profile-header-interests-wrap">
                  {studentCategories.map((cat) => {
                    const IconComp = cat.icon;
                    return (
                      <span key={cat.id} className={`profile-interest-pill ${cat.colorClass}`}>
                        {IconComp && <IconComp size={13} />}
                        <span>{cat.name}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Area */}
            <div className="profile-actions-area">
              {isCurrentUser ? (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn-profile-action btn-edit-profile"
                >
                  <Edit3 size={15} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="profile-external-actions">
                  {/* Connect */}
                  <button
                    type="button"
                    onClick={() => toggleConnect(student.id)}
                    className={`btn-profile-action btn-connect state-${connectionState}`}
                  >
                    {connectionState === 'pending' ? (
                      <>
                        <Clock size={15} />
                        <span>Pending</span>
                      </>
                    ) : connectionState === 'connected' ? (
                      <>
                        <Check size={15} />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={15} />
                        <span>Connect</span>
                      </>
                    )}
                  </button>

                  {/* Follow */}
                  <button
                    type="button"
                    onClick={() => toggleFollow(student.id)}
                    className={`btn-profile-action btn-follow ${isFollowing ? 'is-following' : ''}`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={15} />
                        <span>Following</span>
                      </>
                    ) : (
                      <span>Follow</span>
                    )}
                  </button>

                  {/* Message */}
                  <button
                    type="button"
                    onClick={() => setIsMessageModalOpen(true)}
                    className="btn-profile-action btn-message"
                  >
                    <MessageSquare size={15} />
                    <span>Message</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 2-Column Profile Body */}
        <div className="profile-content-grid">
          {/* Left Column: Niches, Skills, Goals */}
          <div className="profile-col-left">
            {/* 2. Interests & Niches Hierarchy */}
            <section className="profile-card-section" aria-labelledby="section-niches-heading">
              <h2 id="section-niches-heading" className="profile-section-heading">
                <Layers size={18} className="section-heading-icon" />
                <span>Interests & Niches Hierarchy</span>
              </h2>

              {student.selectedPaths && student.selectedPaths.length > 0 ? (
                <div className="profile-paths-list">
                  {student.selectedPaths.map((pathItem, idx) => (
                    <div key={pathItem.pathId || idx} className="profile-path-card">
                      <div className="path-breadcrumbs-line">
                        {pathItem.pathLabels.map((lbl, pIdx) => (
                          <React.Fragment key={pIdx}>
                            {pIdx > 0 && <ChevronRight size={13} className="path-chevron" />}
                            <span
                              className={`path-segment ${
                                pIdx === pathItem.pathLabels.length - 1 ? 'is-leaf' : 'is-parent'
                              }`}
                            >
                              {lbl}
                            </span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : student.niches && student.niches.length > 0 ? (
                <div className="profile-niches-tags-wrap">
                  {student.niches.map((niche, idx) => (
                    <span key={idx} className="niche-tag-badge">
                      {niche}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="empty-field-text">Nothing added yet.</p>
              )}
            </section>

            {/* 3. Collaboration Goals & Preferred Roles */}
            <section className="profile-card-section" aria-labelledby="section-goals-heading">
              <h2 id="section-goals-heading" className="profile-section-heading">
                <Target size={18} className="section-heading-icon" />
                <span>Goals & Preferred Roles</span>
              </h2>

              {student.goals && student.goals.length > 0 ? (
                <div className="profile-goals-list">
                  {student.goals.map((goal, idx) => (
                    <div key={idx} className="profile-goal-entry">
                      <Check size={14} className="goal-check" />
                      <span>
                        {goal.includes('hackathon') ? 'Looking for hackathon teammates & full-stack project partners'
                          : goal.includes('band') ? 'Seeking band members & acoustic jam sessions'
                          : goal.includes('recording') ? 'Audio track collaborations & music recording'
                          : goal.includes('squad') ? 'Competitive campus esports squad & LAN practice'
                          : goal.includes('sports') ? 'Sports practice partners & campus tournament team'
                          : goal.includes('photowalks') ? 'Weekend campus photowalks & shoot partners'
                          : goal.includes('dev-collab') ? 'Partnering with student developers on UI/UX'
                          : goal.includes('mentor') ? 'Open to mentoring juniors and sharing knowledge'
                          : goal.includes('learn') ? 'Learning new skills & finding study buddies'
                          : goal}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-field-text">Nothing added yet.</p>
              )}

              {collabPrefs.length > 0 && (
                <div className="collab-preferences-block">
                  <h3 className="sub-heading-text">Preferred Collaboration Formats</h3>
                  <div className="collab-pills-wrap">
                    {collabPrefs.map((cp) => (
                      <span key={cp.id} className="collab-pill">
                        {cp.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div className="availability-block">
                <h3 className="sub-heading-text">Availability</h3>
                <div className="availability-badge-display">
                  <Calendar size={14} />
                  <span>
                    {availOption?.label || student.availability || 'Flexible availability'}
                  </span>
                </div>
              </div>
            </section>

            {/* Social & External Profiles */}
            <section className="profile-card-section" aria-labelledby="section-social-heading">
              <h2 id="section-social-heading" className="profile-section-heading">
                <Globe size={18} className="section-heading-icon" />
                <span>Online Profiles & Links</span>
              </h2>

              {student.portfolioUrl || student.githubUrl || student.linkedinUrl ? (
                <div className="profile-links-list">
                  {student.portfolioUrl && (
                    <a
                      href={student.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="profile-link-btn"
                    >
                      <Globe size={15} />
                      <span className="link-title">Portfolio Website</span>
                      <ExternalLink size={13} className="external-link-arrow" />
                    </a>
                  )}

                  {student.githubUrl && (
                    <a
                      href={student.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="profile-link-btn"
                    >
                      <GithubIcon size={15} />
                      <span className="link-title">GitHub Profile</span>
                      <ExternalLink size={13} className="external-link-arrow" />
                    </a>
                  )}

                  {student.linkedinUrl && (
                    <a
                      href={student.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="profile-link-btn"
                    >
                      <LinkedinIcon size={15} />
                      <span className="link-title">LinkedIn Profile</span>
                      <ExternalLink size={13} className="external-link-arrow" />
                    </a>
                  )}
                </div>
              ) : (
                <p className="empty-field-text">Nothing added yet.</p>
              )}
            </section>
          </div>

          {/* Right Column: Self-Reported vs Verified Sections */}
          <div className="profile-col-right">
            {/* 4. Self-Reported Skills and Experience */}
            <section className="profile-card-section" aria-labelledby="section-self-reported-heading">
              <div className="section-header-banner self-reported-banner">
                <Award size={18} />
                <h2 id="section-self-reported-heading" className="section-banner-title">
                  Self-Reported Skills & Experience
                </h2>
              </div>
              <p className="section-disclaimer-note">
                The skills, background descriptions, and project showcases in this section are reported directly by the student.
              </p>

              {/* Skill Level Indicator */}
              <div className="self-skill-level-card">
                <div className="skill-level-header">
                  <span className="skill-level-title-label">Overall Skill Level:</span>
                  <span className={`skill-badge-lg skill-${student.skillLevel || 'learner'}`}>
                    {skillInfo.label}
                  </span>
                </div>
                <p className="skill-tagline-text">{skillInfo.tagline}</p>
                <p className="skill-desc-text">{skillInfo.description}</p>
              </div>

              {/* Experience Summary */}
              <div className="profile-subsection">
                <h3 className="subsection-title">Experience & Technical Background</h3>
                {student.experienceSummary ? (
                  <p className="experience-body-text">{student.experienceSummary}</p>
                ) : (
                  <p className="empty-field-text">Nothing added yet.</p>
                )}
              </div>

              {/* Projects Showcase */}
              <div className="profile-subsection">
                <div className="projects-heading-row">
                  <h3 className="subsection-title">
                    <Briefcase size={16} />
                    <span>Projects Showcase ({student.projects?.length || 0})</span>
                  </h3>
                </div>

                {student.projects && student.projects.length > 0 ? (
                  <div className="profile-projects-list">
                    {student.projects.map((proj, idx) => (
                      <div key={proj.id || idx} className="profile-project-card">
                        <div className="project-card-header">
                          <h4 className="project-title">{proj.name}</h4>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-link"
                              title="Open Project Link"
                            >
                              <span>View Project</span>
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                        {proj.description && (
                          <p className="project-description">{proj.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-field-text">Nothing added yet.</p>
                )}
              </div>

              {/* Self-Reported Achievements */}
              <div className="profile-subsection">
                <h3 className="subsection-title">Self-Reported Achievements</h3>
                {student.achievements ? (
                  <p className="achievements-body-text">{student.achievements}</p>
                ) : (
                  <p className="empty-field-text">Nothing added yet.</p>
                )}
              </div>
            </section>

            {/* 5. Verified Achievements Section */}
            <section className="profile-card-section" aria-labelledby="section-verified-heading">
              <div className="section-header-banner verified-banner">
                <ShieldCheck size={18} />
                <h2 id="section-verified-heading" className="section-banner-title">
                  Verified Achievements
                </h2>
              </div>
              <p className="section-disclaimer-note">
                Displaying achievements officially verified by university bodies, fest committees, or accredited competitions.
              </p>

              {student.verifiedAchievements && student.verifiedAchievements.length > 0 ? (
                <div className="verified-items-list">
                  {student.verifiedAchievements.map((item) => (
                    <div key={item.id} className="verified-item-card">
                      <div className="verified-icon-badge">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="verified-item-content">
                        <h4 className="verified-title">{item.title}</h4>
                        <div className="verified-meta-row">
                          <span className="verified-issuer">Verified by: {item.issuer}</span>
                          {item.date && (
                            <span className="verified-date">· {item.date}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-verified-box">
                  <ShieldCheck size={28} className="empty-verified-icon" />
                  <p className="empty-verified-title">No verified achievements yet</p>
                  <p className="empty-verified-desc">
                    Verified badges are awarded upon submitting official college certificates or competition endorsements.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          student={student}
          onSave={handleSaveProfile}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Mock Message Modal */}
      {isMessageModalOpen && (
        <MockMessageModal
          student={student}
          onClose={() => setIsMessageModalOpen(false)}
        />
      )}
    </div>
  );
}

export default StudentProfile;
