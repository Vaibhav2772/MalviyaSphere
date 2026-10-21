import React, { useState } from 'react';
import { useTeams } from '../../context/TeamsContext';
import { TEAM_CATEGORIES, POPULAR_TEAM_SKILLS } from '../../data/teamsData';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import './CreateTeamModal.css';

function CreateTeamModal({ isOpen, onClose, onCreated }) {
  const { createTeam } = useTeams();

  const [formData, setFormData] = useState({
    name: '',
    logo: '🚀',
    objective: '',
    description: '',
    category: 'technology',
    requiredSkills: ['React.js', 'Node.js & Express'],
    maxMembers: 4,
    recruitmentStatus: 'open',
    projectLink: '',
    openRoles: [
      {
        id: 'r-init-1',
        title: 'Frontend Developer',
        skills: 'React.js, CSS',
        description: 'Implement responsive interfaces and interact with state.',
      },
    ],
  });

  const [customSkillInput, setCustomSkillInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTeam, setSuccessTeam] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleAddSkill = (skill) => {
    const trimmed = (skill || customSkillInput).trim();
    if (!trimmed) return;
    if (!formData.requiredSkills.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, trimmed],
      }));
    }
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((s) => s !== skillToRemove),
    }));
  };

  // Open roles management
  const handleAddRole = () => {
    setFormData((prev) => ({
      ...prev,
      openRoles: [
        ...prev.openRoles,
        {
          id: `r-${Date.now()}`,
          title: '',
          skills: '',
          description: '',
        },
      ],
    }));
  };

  const handleRoleChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.openRoles];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, openRoles: updated };
    });
  };

  const handleRemoveRole = (index) => {
    setFormData((prev) => ({
      ...prev,
      openRoles: prev.openRoles.filter((_, idx) => idx !== index),
    }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Team name must be at least 3 characters.';
    }

    if (!formData.objective.trim()) {
      newErrors.objective = 'Team objective is required.';
    } else if (formData.objective.trim().length < 10) {
      newErrors.objective = 'Objective must be at least 10 characters.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Team project description is required.';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a project category.';
    }

    const max = parseInt(formData.maxMembers, 10);
    if (!max || isNaN(max)) {
      newErrors.maxMembers = 'Maximum team size is required.';
    } else if (max < 2 || max > 12) {
      newErrors.maxMembers = 'Team size must be between 2 and 12 members.';
    }

    // Validate roles if present
    formData.openRoles.forEach((role, idx) => {
      if (role.title && !role.description) {
        newErrors[`role_${idx}_desc`] = 'Please provide a short description for this open role.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const categoryObj = TEAM_CATEGORIES.find((c) => c.id === formData.category) || {
      label: 'Technology',
    };

    // Format roles
    const formattedRoles = formData.openRoles
      .filter((r) => r.title.trim())
      .map((r, idx) => ({
        id: `role-${Date.now()}-${idx}`,
        title: r.title.trim(),
        skills: typeof r.skills === 'string' ? r.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        description: r.description.trim(),
      }));

    const created = createTeam({
      ...formData,
      categoryLabel: categoryObj.label,
      openRoles: formattedRoles,
    });

    setIsSubmitting(false);
    setSuccessTeam(created);

    if (onCreated) {
      onCreated(created);
    }
  };

  const handleResetAndClose = () => {
    setSuccessTeam(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="create-team-overlay" role="dialog" aria-modal="true" aria-labelledby="create-team-title">
      <div className="create-team-modal">
        {/* Modal Header */}
        <div className="create-team-header">
          <div className="create-team-title-group">
            <span className="create-team-icon-badge">🚀</span>
            <div>
              <h2 id="create-team-title" className="create-team-title">
                Create a Project Team
              </h2>
              <p className="create-team-subtitle">
                Assemble collaborators across MMMUT with complementary skills and shared goals.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="btn-modal-close"
            aria-label="Close Create Team Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="create-team-body">
          {successTeam ? (
            <div className="create-success-state">
              <CheckCircle2 size={44} className="create-success-icon" />
              <h3 className="create-success-title">Team "{successTeam.name}" Created!</h3>
              <p className="create-success-desc">
                Your team has been published to the MalviyaSphere teams directory. You have been assigned as the Team Lead and can now manage recruitment and invite collaborators.
              </p>
              <div className="create-success-actions">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="btn-modal-primary"
                >
                  View Team in Directory
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="create-team-form" noValidate>
              {/* Notice */}
              <div className="form-mock-notice">
                <strong>Campus Collaboration:</strong> As creator, you will automatically be assigned as <strong>Team Lead</strong> for this project.
              </div>

              {/* 1. Basic Info Row */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="team-name" className="form-label">
                    Team Name <span className="required-star">*</span>
                  </label>
                  <input
                    id="team-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Malviya Hyperloop Powertrain"
                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                    required
                  />
                  {errors.name && <p className="form-error-msg">{errors.name}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="team-category" className="form-label">
                    Project Category / Domain <span className="required-star">*</span>
                  </label>
                  <select
                    id="team-category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="form-select"
                    required
                  >
                    {TEAM_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. Objective */}
              <div className="form-group">
                <label htmlFor="team-objective" className="form-label">
                  Project Objective / Mission <span className="required-star">*</span>
                </label>
                <input
                  id="team-objective"
                  type="text"
                  value={formData.objective}
                  onChange={(e) => handleInputChange('objective', e.target.value)}
                  placeholder="One sentence describing what your team is building or training for"
                  className={`form-input ${errors.objective ? 'input-error' : ''}`}
                  required
                />
                {errors.objective && <p className="form-error-msg">{errors.objective}</p>}
              </div>

              {/* 3. Description */}
              <div className="form-group">
                <label htmlFor="team-desc" className="form-label">
                  Detailed Project Description <span className="required-star">*</span>
                </label>
                <textarea
                  id="team-desc"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your project goals, current progress, technologies used, and meeting cadence..."
                  className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                  required
                />
                {errors.description && <p className="form-error-msg">{errors.description}</p>}
              </div>

              {/* 4. Team Size & Recruitment Status */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="team-max-size" className="form-label">
                    Maximum Team Size <span className="required-star">*</span>
                  </label>
                  <input
                    id="team-max-size"
                    type="number"
                    min={2}
                    max={12}
                    value={formData.maxMembers}
                    onChange={(e) => handleInputChange('maxMembers', e.target.value)}
                    className={`form-input ${errors.maxMembers ? 'input-error' : ''}`}
                    required
                  />
                  {errors.maxMembers && <p className="form-error-msg">{errors.maxMembers}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="team-status-select" className="form-label">
                    Initial Recruitment Status
                  </label>
                  <select
                    id="team-status-select"
                    value={formData.recruitmentStatus}
                    onChange={(e) => handleInputChange('recruitmentStatus', e.target.value)}
                    className="form-select"
                  >
                    <option value="open">Open (Accepting Applications)</option>
                    <option value="closed">Closed (Invitations Only)</option>
                  </select>
                </div>
              </div>

              {/* 5. Required Skills */}
              <div className="form-group">
                <label className="form-label">
                  Required Skills & Technologies
                </label>
                <div className="chips-input-wrap">
                  {formData.requiredSkills.map((skill) => (
                    <span key={skill} className="form-skill-chip">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="btn-chip-remove"
                        aria-label={`Remove skill ${skill}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="custom-skill-row">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type a skill and press Enter or click Add"
                    className="form-input custom-skill-input"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    className="btn-add-skill"
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                <div className="quick-suggestions-wrap">
                  <span className="quick-label">Suggestions:</span>
                  {POPULAR_TEAM_SKILLS.slice(0, 6).map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => handleAddSkill(skill)}
                      className="quick-suggestion-chip"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Open Roles Section */}
              <div className="form-section-block">
                <div className="section-block-header">
                  <div>
                    <h3 className="section-block-title">Open Vacancies & Roles</h3>
                    <p className="section-block-subtitle">
                      Specify the dedicated roles your project needs to recruit.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="btn-add-role-action"
                  >
                    <Plus size={14} />
                    <span>Add Role</span>
                  </button>
                </div>

                {formData.openRoles.length === 0 ? (
                  <p className="no-roles-notice">No specific roles defined yet. Click "Add Role" above if recruiting specific vacancies.</p>
                ) : (
                  <div className="roles-list-group">
                    {formData.openRoles.map((role, idx) => (
                      <div key={role.id || idx} className="role-entry-card">
                        <div className="role-entry-top">
                          <input
                            type="text"
                            value={role.title}
                            onChange={(e) => handleRoleChange(idx, 'title', e.target.value)}
                            placeholder={`Role Title (e.g. Backend Engineer, CAD Specialist)`}
                            className="form-input role-title-input"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(idx)}
                            className="btn-remove-role"
                            title="Remove role"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={role.skills}
                          onChange={(e) => handleRoleChange(idx, 'skills', e.target.value)}
                          placeholder="Key skills (comma separated e.g. Node.js, Docker)"
                          className="form-input role-skills-input"
                        />
                        <textarea
                          rows={2}
                          value={role.description}
                          onChange={(e) => handleRoleChange(idx, 'description', e.target.value)}
                          placeholder="Brief description of what this role will be responsible for..."
                          className="form-textarea role-desc-textarea"
                        />
                        {errors[`role_${idx}_desc`] && (
                          <p className="form-error-msg">{errors[`role_${idx}_desc`]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 7. Optional Project Link */}
              <div className="form-group">
                <label htmlFor="team-link" className="form-label">
                  Project Repository or Portfolio Link (Optional)
                </label>
                <input
                  id="team-link"
                  type="url"
                  value={formData.projectLink}
                  onChange={(e) => handleInputChange('projectLink', e.target.value)}
                  placeholder="https://github.com/your-team/repo"
                  className="form-input"
                />
              </div>

              {/* Form Footer Actions */}
              <div className="create-team-footer">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="btn-modal-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-modal-submit"
                >
                  <span>{isSubmitting ? 'Creating Team...' : 'Create Team & Publish'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateTeamModal;
