import React from 'react';
import ProfilePictureUpload from './ProfilePictureUpload';
import { 
  ACADEMIC_PROGRAMMES, 
  BRANCHES_BY_PROGRAMME, 
  ACADEMIC_YEARS 
} from '../../data/onboardingData';
import { User, GraduationCap, Calendar, BookOpen } from 'lucide-react';

function StepBasicInfo({
  data,
  errors = {},
  onChange,
  onBlur,
}) {
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    
    // When programme changes, reset branch if current branch is not in the new programme list
    if (name === 'programme') {
      const allowedBranches = BRANCHES_BY_PROGRAMME[value] || [];
      onChange({
        programme: value,
        branch: allowedBranches.includes(data.branch) ? data.branch : '',
      });
      return;
    }

    onChange({ [name]: value });
  };

  const handleAvatarChange = (avatarUrl) => {
    onChange({ avatar: avatarUrl });
  };

  const availableBranches = data.programme 
    ? (BRANCHES_BY_PROGRAMME[data.programme] || []) 
    : [];

  return (
    <div className="onboarding-step-content" role="group" aria-labelledby="step-basic-info-heading">
      <div className="step-intro-header">
        <h3 id="step-basic-info-heading" className="step-main-title">Basic Information</h3>
        <p className="step-main-desc">
          Tell us a little bit about yourself and your academic journey at MMMUT.
        </p>
      </div>

      {/* Full Name Field */}
      <div className={`form-field-group ${errors.fullName ? 'has-error' : ''}`}>
        <label htmlFor="onboarding-fullname" className="input-label">
          Full Name <span className="required-star" aria-hidden="true">*</span>
        </label>
        <div className="input-field-wrapper">
          <span className="input-prefix-icon" aria-hidden="true">
            <User size={17} />
          </span>
          <input
            type="text"
            id="onboarding-fullname"
            name="fullName"
            value={data.fullName || ''}
            onChange={handleFieldChange}
            onBlur={onBlur}
            placeholder="e.g. Aditi Sharma"
            required
            className="native-input"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'fullname-error' : undefined}
          />
        </div>
        {errors.fullName && (
          <p id="fullname-error" className="input-error-msg" role="alert">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Academic Programme Level Selector */}
      <div className="programme-branch-grid">
        <div className={`form-field-group ${errors.programme ? 'has-error' : ''}`}>
          <label htmlFor="onboarding-programme" className="input-label">
            Academic Programme <span className="required-star" aria-hidden="true">*</span>
          </label>
          <div className="input-field-wrapper">
            <span className="input-prefix-icon" aria-hidden="true">
              <GraduationCap size={17} />
            </span>
            <select
              id="onboarding-programme"
              name="programme"
              value={data.programme || ''}
              onChange={handleFieldChange}
              onBlur={onBlur}
              required
              className="native-input native-select"
              aria-invalid={!!errors.programme}
              aria-describedby={errors.programme ? 'programme-error' : undefined}
            >
              <option value="">Select Programme Level</option>
              {ACADEMIC_PROGRAMMES.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.label}
                </option>
              ))}
            </select>
          </div>
          {errors.programme && (
            <p id="programme-error" className="input-error-msg" role="alert">
              {errors.programme}
            </p>
          )}
        </div>

        {/* Branch / Department Dropdown (conditioned on programme) */}
        <div className={`form-field-group ${errors.branch ? 'has-error' : ''}`}>
          <label htmlFor="onboarding-branch" className="input-label">
            Department / Branch <span className="required-star" aria-hidden="true">*</span>
          </label>
          <div className="input-field-wrapper">
            <span className="input-prefix-icon" aria-hidden="true">
              <BookOpen size={17} />
            </span>
            <select
              id="onboarding-branch"
              name="branch"
              value={data.branch || ''}
              onChange={handleFieldChange}
              onBlur={onBlur}
              required
              disabled={!data.programme}
              className="native-input native-select"
              aria-invalid={!!errors.branch}
              aria-describedby={errors.branch ? 'branch-error' : undefined}
            >
              <option value="">
                {data.programme ? 'Select Branch / Specialization' : 'Select Programme first'}
              </option>
              {availableBranches.map((branchName) => (
                <option key={branchName} value={branchName}>
                  {branchName}
                </option>
              ))}
            </select>
          </div>
          {errors.branch && (
            <p id="branch-error" className="input-error-msg" role="alert">
              {errors.branch}
            </p>
          )}
        </div>
      </div>

      {/* Academic Year Field */}
      <div className={`form-field-group ${errors.academicYear ? 'has-error' : ''}`}>
        <label htmlFor="onboarding-academic-year" className="input-label">
          Academic Year <span className="required-star" aria-hidden="true">*</span>
        </label>
        <div className="input-field-wrapper">
          <span className="input-prefix-icon" aria-hidden="true">
            <Calendar size={17} />
          </span>
          <select
            id="onboarding-academic-year"
            name="academicYear"
            value={data.academicYear || ''}
            onChange={handleFieldChange}
            onBlur={onBlur}
            required
            className="native-input native-select"
            aria-invalid={!!errors.academicYear}
            aria-describedby={errors.academicYear ? 'year-error' : undefined}
          >
            <option value="">Select Academic Year</option>
            {ACADEMIC_YEARS.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
        {errors.academicYear && (
          <p id="year-error" className="input-error-msg" role="alert">
            {errors.academicYear}
          </p>
        )}
      </div>

      {/* Profile Picture Upload Component */}
      <ProfilePictureUpload
        value={data.avatar || null}
        onChange={handleAvatarChange}
      />
    </div>
  );
}

export default StepBasicInfo;
