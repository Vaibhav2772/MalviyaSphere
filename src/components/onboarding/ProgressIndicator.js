import React from 'react';
import './ProgressIndicator.css';
import { Check } from 'lucide-react';

const STEPS = [
  { step: 1, title: 'Basic Information', shortLabel: 'Basic Info' },
  { step: 2, title: 'Select Interests', shortLabel: 'Interests' },
  { step: 3, title: 'Select Niches', shortLabel: 'Niches' },
  { step: 4, title: 'Skills & Experience', shortLabel: 'Skills' },
  { step: 5, title: 'Goals & Preferences', shortLabel: 'Goals' },
];

function ProgressIndicator({ currentStep, totalSteps = 5 }) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="onboarding-progress-wrapper" aria-label={`Onboarding progress: Step ${currentStep} of ${totalSteps}`}>
      {/* Top summary row */}
      <div className="progress-meta-row">
        <span className="step-count-badge">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="step-percent-text">{percentage}% completed</span>
      </div>

      {/* Visual progress bar */}
      <div className="progress-bar-track" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stepper nodes list */}
      <nav className="stepper-nodes-list" aria-label="Step progress stages">
        {STEPS.map((item) => {
          const isCompleted = item.step < currentStep;
          const isCurrent = item.step === currentStep;
          const isUpcoming = item.step > currentStep;

          let nodeClass = 'stepper-node';
          if (isCompleted) nodeClass += ' is-completed';
          if (isCurrent) nodeClass += ' is-current';
          if (isUpcoming) nodeClass += ' is-upcoming';

          return (
            <div key={item.step} className={nodeClass}>
              <div className="node-marker" aria-hidden="true">
                {isCompleted ? <Check size={14} strokeWidth={3} /> : item.step}
              </div>
              <span className="node-label">{item.shortLabel}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default ProgressIndicator;
