import React, { useMemo } from 'react';
import { 
  getPersonalizedGoals,
  COLLABORATION_PREFERENCES, 
  AVAILABILITY_OPTIONS 
} from '../../data/onboardingData';
import { Check, Target, Users, Clock, AlertCircle, Sparkles } from 'lucide-react';

function StepGoalsPreferences({
  selectedInterests = [],
  selectedPaths = [],
  selectedGoals = [],
  selectedCollabs = [],
  availability = '',
  goalsError,
  onToggleGoal,
  onToggleCollab,
  onSelectAvailability,
}) {
  const dynamicGoals = useMemo(() => {
    return getPersonalizedGoals(selectedInterests, selectedPaths);
  }, [selectedInterests, selectedPaths]);

  const personalizedGoals = dynamicGoals.filter((g) => g.isPersonalized);
  const campusGoals = dynamicGoals.filter((g) => !g.isPersonalized);

  return (
    <div className="onboarding-step-content" role="group" aria-labelledby="step-goals-heading">
      <div className="step-intro-header">
        <h3 id="step-goals-heading" className="step-main-title">Goals & Preferences</h3>
        <p className="step-main-desc">
          Tell us why you're joining MalviyaSphere and how you like to collaborate with fellow students.
        </p>
      </div>

      {goalsError && (
        <div className="step-inline-alert alert-error" role="alert">
          <AlertCircle size={16} />
          <span>{goalsError}</span>
        </div>
      )}

      {/* 1. Goals (Required - at least one) */}
      <div className="goals-section-group">
        <div className="section-label-header">
          <Target size={17} className="section-header-icon" />
          <h4 className="section-block-title">
            What are your main goals on MalviyaSphere? <span className="required-star">*</span>
          </h4>
        </div>
        <p className="field-hint-text">Select all that apply (at least one goal required).</p>

        {personalizedGoals.length > 0 && (
          <div className="goals-subgroup-block">
            <div className="goals-subgroup-title">
              <Sparkles size={14} className="sparkle-accent-icon" />
              <span>Recommended for your focus areas</span>
            </div>
            <div className="options-checkbox-grid">
              {personalizedGoals.map((goal) => {
                const isChecked = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isChecked}
                    onClick={() => onToggleGoal(goal.id)}
                    className={`choice-card-button personalized-choice-card ${isChecked ? 'is-selected' : ''}`}
                  >
                    <span className={`choice-checkbox-box ${isChecked ? 'checked' : ''}`} aria-hidden="true">
                      {isChecked && <Check size={13} strokeWidth={3} />}
                    </span>
                    <div className="choice-label-content">
                      <span className="choice-label-text">{goal.label}</span>
                      <span className="choice-domain-tag">{goal.category.toUpperCase()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="goals-subgroup-block">
          {personalizedGoals.length > 0 && (
            <div className="goals-subgroup-title">
              <span>Campus & Community Goals</span>
            </div>
          )}
          <div className="options-checkbox-grid">
            {campusGoals.map((goal) => {
              const isChecked = selectedGoals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  onClick={() => onToggleGoal(goal.id)}
                  className={`choice-card-button ${isChecked ? 'is-selected' : ''}`}
                >
                  <span className={`choice-checkbox-box ${isChecked ? 'checked' : ''}`} aria-hidden="true">
                    {isChecked && <Check size={13} strokeWidth={3} />}
                  </span>
                  <span className="choice-label-text">{goal.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Collaboration Preferences (Multiple choices) */}
      <div className="goals-section-group">
        <div className="section-label-header">
          <Users size={17} className="section-header-icon" />
          <h4 className="section-block-title">
            How do you prefer to collaborate? <span className="label-optional">(Optional)</span>
          </h4>
        </div>
        <p className="field-hint-text">Choose your ideal formats for building, studying, or jamming.</p>

        <div className="options-checkbox-grid">
          {COLLABORATION_PREFERENCES.map((collab) => {
            const isChecked = selectedCollabs.includes(collab.id);
            return (
              <button
                key={collab.id}
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => onToggleCollab(collab.id)}
                className={`choice-card-button ${isChecked ? 'is-selected' : ''}`}
              >
                <span className={`choice-checkbox-box ${isChecked ? 'checked' : ''}`} aria-hidden="true">
                  {isChecked && <Check size={13} strokeWidth={3} />}
                </span>
                <span className="choice-label-text">{collab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Availability (Single select - Optional) */}
      <div className="goals-section-group">
        <div className="section-label-header">
          <Clock size={17} className="section-header-icon" />
          <h4 className="section-block-title">
            Typical Availability <span className="label-optional">(Optional)</span>
          </h4>
        </div>
        <p className="field-hint-text">When are you most open for meetups, practice, or study sessions?</p>

        <div className="availability-options-row">
          {AVAILABILITY_OPTIONS.map((opt) => {
            const isChosen = availability === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isChosen}
                onClick={() => onSelectAvailability(isChosen ? '' : opt.id)}
                className={`availability-pill-btn ${isChosen ? 'is-selected' : ''}`}
              >
                <span className={`radio-dot ${isChosen ? 'selected' : ''}`} aria-hidden="true" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StepGoalsPreferences;
