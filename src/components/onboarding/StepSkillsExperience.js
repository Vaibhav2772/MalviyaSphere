import React from 'react';
import { SKILL_LEVELS } from '../../data/onboardingData';
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  Globe, 
  Briefcase, 
  Award,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

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

function StepSkillsExperience({
  data,
  urlErrors = {},
  error,
  onChange,
  onAddProject,
  onUpdateProject,
  onRemoveProject,
}) {
  const selectedSkillLevel = data.skillLevel || 'learner';

  const handleLevelSelect = (levelId) => {
    onChange({ skillLevel: levelId });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="onboarding-step-content" role="group" aria-labelledby="step-skills-heading">
      <div className="step-intro-header">
        <h3 id="step-skills-heading" className="step-main-title">Skills & Experience</h3>
        <p className="step-main-desc">
          Tell fellow students about your craft, current stage, and past projects. This step is entirely optional — feel free to skip if you're just starting out!
        </p>
      </div>

      {error && (
        <div className="step-inline-alert alert-error" role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Skill Level Segmented Selector */}
      <div className="form-field-group">
        <label className="input-label" id="skill-level-label">
          How would you describe your overall skill level?
        </label>
        <div className="skill-levels-grid" role="radiogroup" aria-labelledby="skill-level-label">
          {SKILL_LEVELS.map((level) => {
            const isSelected = selectedSkillLevel === level.id;
            return (
              <div
                key={level.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => handleLevelSelect(level.id)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    handleLevelSelect(level.id);
                  }
                }}
                className={`skill-level-card ${isSelected ? 'is-selected' : ''}`}
              >
                <div className="level-card-top">
                  <span className="level-label">{level.label}</span>
                  {isSelected && <CheckCircle2 size={16} className="level-check-icon" />}
                </div>
                <span className="level-tagline">{level.tagline}</span>
                <p className="level-description">{level.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Experience Description */}
      <div className="form-field-group">
        <label htmlFor="experience-summary" className="input-label">
          Experience & Technical Background <span className="label-optional">(Optional)</span>
        </label>
        <textarea
          id="experience-summary"
          name="experienceSummary"
          rows={3}
          value={data.experienceSummary || ''}
          onChange={handleInputChange}
          placeholder="Briefly describe what you've learned, tools or languages you use, or your creative journey..."
          className="native-textarea"
        />
        <p className="field-hint-text">
          No worries if you're a beginner! Mention what you are currently learning or enthusiastic about.
        </p>
      </div>

      {/* 3. Completed Projects Section */}
      <div className="projects-section-block">
        <div className="projects-header-row">
          <div>
            <h4 className="projects-section-title">
              <Briefcase size={17} />
              <span>Projects Showcase</span>
            </h4>
            <p className="projects-section-desc">
              Add any hackathon hacks, course assignments, or side projects you're proud of.
            </p>
          </div>
          <button
            type="button"
            onClick={onAddProject}
            className="btn-add-project"
          >
            <Plus size={15} />
            <span>Add Project</span>
          </button>
        </div>

        {(!data.projects || data.projects.length === 0) ? (
          <div className="empty-projects-state">
            <p>No projects added yet. Click "+ Add Project" if you'd like to feature any work.</p>
          </div>
        ) : (
          <div className="project-items-list">
            {data.projects.map((proj, index) => (
              <div key={proj.id || index} className="project-card-entry">
                <div className="project-card-header">
                  <span className="project-index-badge">Project #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveProject(index)}
                    className="btn-remove-project"
                    title="Remove this project"
                    aria-label={`Remove Project ${index + 1}`}
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="project-fields-grid">
                  <div className="form-field-group">
                    <label className="input-label" htmlFor={`proj-name-${index}`}>
                      Project Name
                    </label>
                    <input
                      type="text"
                      id={`proj-name-${index}`}
                      value={proj.name || ''}
                      onChange={(e) => onUpdateProject(index, 'name', e.target.value)}
                      placeholder="e.g. Campus Buddy Chatbot"
                      className="native-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="input-label" htmlFor={`proj-link-${index}`}>
                      Project URL <span className="label-optional">(Optional)</span>
                    </label>
                    <div className="input-field-wrapper">
                      <span className="input-prefix-icon" aria-hidden="true">
                        <ExternalLink size={16} />
                      </span>
                      <input
                        type="url"
                        id={`proj-link-${index}`}
                        value={proj.link || ''}
                        onChange={(e) => onUpdateProject(index, 'link', e.target.value)}
                        placeholder="https://github.com/user/project or live demo link"
                        className="native-input"
                      />
                    </div>
                    {urlErrors[`project_${index}`] && (
                      <p className="input-error-msg" role="alert">
                        {urlErrors[`project_${index}`]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-field-group">
                  <label className="input-label" htmlFor={`proj-desc-${index}`}>
                    Short Description
                  </label>
                  <input
                    type="text"
                    id={`proj-desc-${index}`}
                    value={proj.description || ''}
                    onChange={(e) => onUpdateProject(index, 'description', e.target.value)}
                    placeholder="Brief description of what it does and technologies used"
                    className="native-input"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Achievements or Certifications */}
      <div className="form-field-group">
        <label htmlFor="achievements-input" className="input-label">
          Achievements or Certifications <span className="label-optional">(Optional)</span>
        </label>
        <div className="input-field-wrapper">
          <span className="input-prefix-icon" aria-hidden="true">
            <Award size={17} />
          </span>
          <input
            type="text"
            id="achievements-input"
            name="achievements"
            value={data.achievements || ''}
            onChange={handleInputChange}
            placeholder="e.g. Winner at HackMMMUT 2024, AWS Certified Cloud Practitioner, College Band Lead"
            className="native-input"
          />
        </div>
      </div>

      {/* 5. Online Profiles & Portfolio */}
      <div className="social-links-block">
        <h4 className="sub-block-title">Profiles & Portfolios <span className="label-optional">(Optional)</span></h4>
        
        <div className="social-links-grid">
          {/* Portfolio URL */}
          <div className={`form-field-group ${urlErrors.portfolioUrl ? 'has-error' : ''}`}>
            <label htmlFor="portfolio-url" className="input-label">
              Portfolio URL
            </label>
            <div className="input-field-wrapper">
              <span className="input-prefix-icon" aria-hidden="true">
                <Globe size={16} />
              </span>
              <input
                type="url"
                id="portfolio-url"
                name="portfolioUrl"
                value={data.portfolioUrl || ''}
                onChange={handleInputChange}
                placeholder="https://yourportfolio.dev"
                className="native-input"
              />
            </div>
            {urlErrors.portfolioUrl && (
              <p className="input-error-msg" role="alert">
                {urlErrors.portfolioUrl}
              </p>
            )}
          </div>

          {/* GitHub Profile URL */}
          <div className={`form-field-group ${urlErrors.githubUrl ? 'has-error' : ''}`}>
            <label htmlFor="github-url" className="input-label">
              GitHub Profile URL
            </label>
            <div className="input-field-wrapper">
              <span className="input-prefix-icon" aria-hidden="true">
                <GithubIcon size={16} />
              </span>
              <input
                type="url"
                id="github-url"
                name="githubUrl"
                value={data.githubUrl || ''}
                onChange={handleInputChange}
                placeholder="https://github.com/yourusername"
                className="native-input"
              />
            </div>
            {urlErrors.githubUrl && (
              <p className="input-error-msg" role="alert">
                {urlErrors.githubUrl}
              </p>
            )}
          </div>

          {/* LinkedIn Profile URL */}
          <div className={`form-field-group ${urlErrors.linkedinUrl ? 'has-error' : ''}`}>
            <label htmlFor="linkedin-url" className="input-label">
              LinkedIn Profile URL
            </label>
            <div className="input-field-wrapper">
              <span className="input-prefix-icon" aria-hidden="true">
                <LinkedinIcon size={16} />
              </span>
              <input
                type="url"
                id="linkedin-url"
                name="linkedinUrl"
                value={data.linkedinUrl || ''}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourusername"
                className="native-input"
              />
            </div>
            {urlErrors.linkedinUrl && (
              <p className="input-error-msg" role="alert">
                {urlErrors.linkedinUrl}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepSkillsExperience;
