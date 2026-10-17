import React from 'react';
import './InterestCard.css';
import { Check } from 'lucide-react';

function InterestCard({
  id,
  name,
  icon: IconComponent,
  colorClass,
  description,
  isSelected,
  onToggle,
}) {
  const handleClick = () => {
    onToggle(id);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle(id);
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`onboarding-interest-card ${isSelected ? 'is-selected' : ''}`}
      aria-label={`${name} interest: ${isSelected ? 'selected' : 'not selected'}`}
    >
      <div className="interest-card-header">
        <div className={`interest-icon-badge ${colorClass}`}>
          {IconComponent && <IconComponent size={22} />}
        </div>
        <div className={`selection-checkbox ${isSelected ? 'checked' : ''}`} aria-hidden="true">
          {isSelected && <Check size={14} strokeWidth={3} />}
        </div>
      </div>

      <h4 className="interest-card-title">{name}</h4>
      <p className="interest-card-desc">{description}</p>

      <div className="interest-card-footer">
        <span className="selection-status-hint">
          {isSelected ? 'Selected' : 'Click to select'}
        </span>
      </div>
    </div>
  );
}

export default InterestCard;
