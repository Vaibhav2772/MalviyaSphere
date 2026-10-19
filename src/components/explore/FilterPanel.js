import React, { useState } from 'react';
import { Filter, X, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { SKILL_LEVELS, INTEREST_CATEGORIES, AVAILABILITY_OPTIONS } from '../../data/onboardingData';
import './FilterPanel.css';

// Filter constants
const EXPERIENCE_OPTIONS = [
  { id: 'New to the field', label: 'New to the field' },
  { id: 'Some experience', label: 'Some experience' },
  { id: 'Experienced', label: 'Experienced' },
];

const GOAL_FILTER_OPTIONS = [
  { id: 'learn', label: 'Learn & Explore', matchPrefix: 'goal-general-learn' },
  { id: 'teammates', label: 'Find Teammates', matchKeywords: ['teammates', 'squad', 'band', 'pair'] },
  { id: 'projects', label: 'Build Projects / Hackathons', matchKeywords: ['hackathons', 'collab', 'recording', 'dev-collab'] },
  { id: 'socialize', label: 'Socialize & Make Friends', matchKeywords: ['friends', 'casual'] },
  { id: 'mentor', label: 'Mentor & Share Knowledge', matchKeywords: ['mentor', 'share'] },
];

function FilterPanel({
  filters,
  onToggleFilter,
  onClearAllFilters,
  onRemoveChip,
  totalResultsCount,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Helper to count total active filters
  const activeChipsCount =
    (filters.skillLevels?.length || 0) +
    (filters.experiences?.length || 0) +
    (filters.goals?.length || 0) +
    (filters.availabilities?.length || 0) +
    (filters.categories?.length || 0);

  return (
    <div className="filter-panel-root">
      {/* Mobile Toggle Button */}
      <div className="filter-mobile-bar">
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="filter-mobile-toggle-btn"
          aria-expanded={isMobileOpen}
        >
          <Filter size={16} />
          <span>Filters ({activeChipsCount})</span>
          {isMobileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {activeChipsCount > 0 && (
          <button
            type="button"
            onClick={onClearAllFilters}
            className="btn-clear-filters-compact"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Main Filter Content */}
      <div className={`filter-panel-content ${isMobileOpen ? 'is-open' : ''}`}>
        <div className="filter-panel-header">
          <div className="filter-header-left">
            <Filter size={17} className="filter-header-icon" />
            <h3 className="filter-panel-title">Filter Students</h3>
          </div>
          {activeChipsCount > 0 && (
            <button
              type="button"
              onClick={onClearAllFilters}
              className="filter-clear-all-btn"
              title="Clear all selected filters"
            >
              <RotateCcw size={13} />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {activeChipsCount > 0 && (
          <div className="active-filter-chips-section" aria-label="Active Filters">
            <span className="chips-section-label">Active:</span>
            <div className="chips-wrap">
              {/* Interest Categories Chips */}
              {filters.categories?.map((catId) => {
                const cat = INTEREST_CATEGORIES.find((c) => c.id === catId);
                return (
                  <button
                    type="button"
                    key={`cat-${catId}`}
                    onClick={() => onRemoveChip('categories', catId)}
                    className="filter-chip"
                    aria-label={`Remove category filter ${cat?.name || catId}`}
                  >
                    <span>{cat?.name || catId}</span>
                    <X size={12} />
                  </button>
                );
              })}

              {/* Skill Level Chips */}
              {filters.skillLevels?.map((levelId) => {
                const lvl = SKILL_LEVELS.find((l) => l.id === levelId);
                return (
                  <button
                    type="button"
                    key={`skill-${levelId}`}
                    onClick={() => onRemoveChip('skillLevels', levelId)}
                    className="filter-chip"
                    aria-label={`Remove skill level filter ${lvl?.label || levelId}`}
                  >
                    <span>Skill: {lvl?.label || levelId}</span>
                    <X size={12} />
                  </button>
                );
              })}

              {/* Experience Chips */}
              {filters.experiences?.map((exp) => (
                <button
                  type="button"
                  key={`exp-${exp}`}
                  onClick={() => onRemoveChip('experiences', exp)}
                  className="filter-chip"
                  aria-label={`Remove experience filter ${exp}`}
                >
                  <span>{exp}</span>
                  <X size={12} />
                </button>
              ))}

              {/* Goals Chips */}
              {filters.goals?.map((goalId) => {
                const g = GOAL_FILTER_OPTIONS.find((opt) => opt.id === goalId);
                return (
                  <button
                    type="button"
                    key={`goal-${goalId}`}
                    onClick={() => onRemoveChip('goals', goalId)}
                    className="filter-chip"
                    aria-label={`Remove goal filter ${g?.label || goalId}`}
                  >
                    <span>Goal: {g?.label || goalId}</span>
                    <X size={12} />
                  </button>
                );
              })}

              {/* Availability Chips */}
              {filters.availabilities?.map((availId) => {
                const av = AVAILABILITY_OPTIONS.find((a) => a.id === availId);
                return (
                  <button
                    type="button"
                    key={`avail-${availId}`}
                    onClick={() => onRemoveChip('availabilities', availId)}
                    className="filter-chip"
                    aria-label={`Remove availability filter ${av?.label || availId}`}
                  >
                    <span>{av?.label || availId}</span>
                    <X size={12} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Group 1: Interest Category */}
        <div className="filter-group">
          <h4 className="filter-group-heading">Interest Category</h4>
          <div className="filter-options-list">
            {INTEREST_CATEGORIES.map((cat) => {
              const checked = filters.categories?.includes(cat.id);
              return (
                <label key={cat.id} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleFilter('categories', cat.id)}
                    className="native-checkbox"
                  />
                  <span className="checkbox-custom" />
                  <span className="filter-option-name">{cat.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Group 2: Skill Level */}
        <div className="filter-group">
          <h4 className="filter-group-heading">Skill Level</h4>
          <div className="filter-options-list">
            {SKILL_LEVELS.map((level) => {
              const checked = filters.skillLevels?.includes(level.id);
              return (
                <label key={level.id} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleFilter('skillLevels', level.id)}
                    className="native-checkbox"
                  />
                  <span className="checkbox-custom" />
                  <span className="filter-option-name">{level.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Group 3: Experience */}
        <div className="filter-group">
          <h4 className="filter-group-heading">Experience</h4>
          <div className="filter-options-list">
            {EXPERIENCE_OPTIONS.map((exp) => {
              const checked = filters.experiences?.includes(exp.id);
              return (
                <label key={exp.id} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleFilter('experiences', exp.id)}
                    className="native-checkbox"
                  />
                  <span className="checkbox-custom" />
                  <span className="filter-option-name">{exp.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Group 4: Collaboration Goals */}
        <div className="filter-group">
          <h4 className="filter-group-heading">Goals</h4>
          <div className="filter-options-list">
            {GOAL_FILTER_OPTIONS.map((goal) => {
              const checked = filters.goals?.includes(goal.id);
              return (
                <label key={goal.id} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleFilter('goals', goal.id)}
                    className="native-checkbox"
                  />
                  <span className="checkbox-custom" />
                  <span className="filter-option-name">{goal.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Group 5: Availability */}
        <div className="filter-group">
          <h4 className="filter-group-heading">Availability</h4>
          <div className="filter-options-list">
            {AVAILABILITY_OPTIONS.map((avail) => {
              const checked = filters.availabilities?.includes(avail.id);
              return (
                <label key={avail.id} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleFilter('availabilities', avail.id)}
                    className="native-checkbox"
                  />
                  <span className="checkbox-custom" />
                  <span className="filter-option-name">{avail.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export { GOAL_FILTER_OPTIONS };
export default FilterPanel;
