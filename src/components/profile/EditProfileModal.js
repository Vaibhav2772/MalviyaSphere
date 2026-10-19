import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Check } from 'lucide-react';
import { INTEREST_CATEGORIES, SKILL_LEVELS, AVAILABILITY_OPTIONS } from '../../data/onboardingData';
import './EditProfileModal.css';

function EditProfileModal({ student, onSave, onClose }) {
  const [formData, setFormData] = useState({
    fullName: student.fullName || '',
    branch: student.branch || '',
    academicYear: student.academicYear || '',
    bio: student.bio || '',
    interests: student.interests || [],
    skillLevel: student.skillLevel || 'learner',
    experienceSummary: student.experienceSummary || '',
    projects: student.projects ? JSON.parse(JSON.stringify(student.projects)) : [],
    achievements: student.achievements || '',
    portfolioUrl: student.portfolioUrl || '',
    githubUrl: student.githubUrl || '',
    linkedinUrl: student.linkedinUrl || '',
    availability: student.availability || 'flexible',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleInterest = (catId) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(catId);
      const updated = exists
        ? prev.interests.filter((id) => id !== catId)
        : [...prev.interests, catId];
      return { ...prev, interests: updated };
    });
  };

  // Projects handlers
  const handleAddProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: `proj-${Date.now()}`, name: '', link: '', description: '' },
      ],
    }));
  };

  const handleUpdateProject = (index, field, value) => {
    setFormData((prev) => {
      const updatedProjects = [...prev.projects];
      updatedProjects[index] = { ...updatedProjects[index], [field]: value };
      return { ...prev, projects: updatedProjects };
    });
  };

  const handleRemoveProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
      <div className="modal-card edit-profile-modal-card">
        {/* Header */}
        <div className="modal-header">
          <h3 id="edit-profile-title" className="modal-title">
            Edit Your Profile
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close edit profile"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="edit-modal-body">
            {/* 1. Basic Details */}
            <div className="form-section-title">Identity & Academic Details</div>

            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="edit-name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="edit-name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="modal-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-year" className="form-label">Academic Year</label>
                <select
                  id="edit-year"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  className="modal-select"
                >
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Fourth Year">Fourth Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-branch" className="form-label">Branch / Department</label>
              <input
                type="text"
                id="edit-branch"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="modal-input"
                placeholder="e.g. Computer Science and Engineering"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-bio" className="form-label">Short Bio</label>
              <textarea
                id="edit-bio"
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleInputChange}
                className="modal-textarea"
                placeholder="Brief intro about yourself and collaboration interests..."
              />
            </div>

            {/* 2. Interests Selection */}
            <div className="form-section-title">Primary Interests</div>
            <div className="interests-checkboxes-grid">
              {INTEREST_CATEGORIES.map((cat) => {
                const isSelected = formData.interests.includes(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleToggleInterest(cat.id)}
                    className={`edit-interest-btn ${isSelected ? 'is-selected' : ''}`}
                  >
                    <span>{cat.name}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>

            {/* 3. Skill Level & Experience */}
            <div className="form-section-title">Skills & Experience (Self-Reported)</div>
            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="edit-skill-level" className="form-label">Skill Level</label>
                <select
                  id="edit-skill-level"
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleInputChange}
                  className="modal-select"
                >
                  {SKILL_LEVELS.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.label} ({lvl.tagline})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-availability" className="form-label">Availability</label>
                <select
                  id="edit-availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="modal-select"
                >
                  {AVAILABILITY_OPTIONS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-exp-summary" className="form-label">Experience Summary</label>
              <textarea
                id="edit-exp-summary"
                name="experienceSummary"
                rows={3}
                value={formData.experienceSummary}
                onChange={handleInputChange}
                className="modal-textarea"
                placeholder="Describe your hands-on background, tools, languages, or creative journey..."
              />
            </div>

            {/* 4. Projects Showcase */}
            <div className="form-section-header-row">
              <span className="form-section-title">Projects Showcase</span>
              <button
                type="button"
                onClick={handleAddProject}
                className="btn-add-proj-inline"
              >
                <Plus size={14} />
                <span>Add Project</span>
              </button>
            </div>

            {formData.projects.length === 0 ? (
              <p className="no-items-text">No projects added. Click "+ Add Project" to showcase work.</p>
            ) : (
              <div className="edit-projects-list">
                {formData.projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="edit-project-item">
                    <div className="proj-item-header">
                      <span className="proj-badge">Project #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(idx)}
                        className="btn-remove-proj-inline"
                        title="Remove project"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="form-row-2col">
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => handleUpdateProject(idx, 'name', e.target.value)}
                        placeholder="Project Name (e.g. Campus Buddy)"
                        className="modal-input"
                        required
                      />
                      <input
                        type="url"
                        value={proj.link || ''}
                        onChange={(e) => handleUpdateProject(idx, 'link', e.target.value)}
                        placeholder="Project URL (e.g. https://github.com/...)"
                        className="modal-input"
                      />
                    </div>
                    <input
                      type="text"
                      value={proj.description || ''}
                      onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                      placeholder="Short description of what it does & technologies..."
                      className="modal-input"
                      style={{ marginTop: '0.4rem' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 5. Achievements & Profiles */}
            <div className="form-section-title">Achievements & Online Profiles</div>
            <div className="form-group">
              <label htmlFor="edit-achievements" className="form-label">Self-Reported Achievements</label>
              <input
                type="text"
                id="edit-achievements"
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                className="modal-input"
                placeholder="e.g. Winner at HackMMMUT 2024, Band Lead"
              />
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="edit-github" className="form-label">GitHub URL</label>
                <input
                  type="url"
                  id="edit-github"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className="modal-input"
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-linkedin" className="form-label">LinkedIn URL</label>
                <input
                  type="url"
                  id="edit-linkedin"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  className="modal-input"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-portfolio" className="form-label">Portfolio URL</label>
              <input
                type="url"
                id="edit-portfolio"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleInputChange}
                className="modal-input"
                placeholder="https://yourportfolio.dev"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer-sticky">
            <button
              type="button"
              onClick={onClose}
              className="btn-modal-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-primary"
            >
              <Save size={15} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
