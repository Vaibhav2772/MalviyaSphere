import React from 'react';
import InterestCard from './InterestCard';
import { INTEREST_CATEGORIES } from '../../data/onboardingData';
import { Sparkles, AlertCircle } from 'lucide-react';

function StepInterests({
  selectedInterests = [],
  error,
  onToggleInterest,
}) {
  return (
    <div className="onboarding-step-content" role="group" aria-labelledby="step-interests-heading">
      <div className="step-intro-header">
        <div className="step-header-row">
          <div>
            <h3 id="step-interests-heading" className="step-main-title">Select Interests</h3>
            <p className="step-main-desc">
              Choose the broader areas you are excited about. Select at least one to uncover campus niches.
            </p>
          </div>
          <div className="interests-selection-counter" aria-live="polite">
            <Sparkles size={15} />
            <span>{selectedInterests.length} of {INTEREST_CATEGORIES.length} selected</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="step-inline-alert alert-error" role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of 6 Interest Cards */}
      <div className="interests-selection-grid">
        {INTEREST_CATEGORIES.map((category) => {
          const isSelected = selectedInterests.includes(category.id);
          return (
            <InterestCard
              key={category.id}
              id={category.id}
              name={category.name}
              icon={category.icon}
              colorClass={category.colorClass}
              description={category.description}
              isSelected={isSelected}
              onToggle={onToggleInterest}
            />
          );
        })}
      </div>
    </div>
  );
}

export default StepInterests;
