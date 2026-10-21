import React from 'react';
import { TEAM_CATEGORIES, POPULAR_TEAM_SKILLS } from '../../data/teamsData';
import { Filter, X, RotateCcw, CheckSquare, Square, ChevronDown } from 'lucide-react';
import './TeamFilters.css';

function TeamFilters({
  filters,
  onChangeFilter,
  onClearFilters,
  totalResultsCount = 0,
}) {
  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.teamSize !== 'all' ||
    filters.hasOpenRoles ||
    (filters.skills && filters.skills.length > 0);

  const handleToggleSkill = (skill) => {
    const current = filters.skills || [];
    const exists = current.includes(skill);
    const updated = exists ? current.filter((s) => s !== skill) : [...current, skill];
    onChangeFilter('skills', updated);
  };

  return (
    <aside className="team-filters-panel" aria-label="Team Filters">
      {/* Filters Header */}
      <div className="filters-header-row">
        <div className="filters-title-group">
          <Filter size={16} className="filters-header-icon" />
          <h2 className="filters-title">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="btn-clear-filters"
            title="Reset all filters"
          >
            <RotateCcw size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* 1. Category / Domain Filter */}
      <div className="filter-group">
        <label htmlFor="filter-domain-select" className="filter-group-label">
          Project Domain / Category
        </label>
        <div className="select-wrapper">
          <select
            id="filter-domain-select"
            value={filters.category}
            onChange={(e) => onChangeFilter('category', e.target.value)}
            className="filter-select"
          >
            {TEAM_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="select-arrow" />
        </div>
      </div>

      {/* 2. Recruitment Status Filter */}
      <div className="filter-group">
        <label className="filter-group-label">Recruitment Status</label>
        <div className="filter-status-radios">
          {[
            { value: 'all', label: 'All Statuses' },
            { value: 'open', label: 'Recruitment Open' },
            { value: 'almost_full', label: 'Almost Full' },
            { value: 'closed', label: 'Closed / Full' },
          ].map((item) => (
            <label key={item.value} className="radio-label">
              <input
                type="radio"
                name="recruitment-status"
                value={item.value}
                checked={filters.status === item.value}
                onChange={() => onChangeFilter('status', item.value)}
                className="filter-radio-input"
              />
              <span className="radio-custom"></span>
              <span className="radio-text">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Available Roles Checkbox */}
      <div className="filter-group">
        <label className="checkbox-filter-label">
          <input
            type="checkbox"
            checked={!!filters.hasOpenRoles}
            onChange={(e) => onChangeFilter('hasOpenRoles', e.target.checked)}
            className="filter-checkbox-input"
          />
          <span className="checkbox-custom">
            {filters.hasOpenRoles ? <CheckSquare size={16} /> : <Square size={16} />}
          </span>
          <span className="checkbox-text">Has Open Vacancies</span>
        </label>
      </div>

      {/* 4. Team Size Filter */}
      <div className="filter-group">
        <label htmlFor="filter-teamsize-select" className="filter-group-label">
          Team Size
        </label>
        <div className="select-wrapper">
          <select
            id="filter-teamsize-select"
            value={filters.teamSize}
            onChange={(e) => onChangeFilter('teamSize', e.target.value)}
            className="filter-select"
          >
            <option value="all">Any Team Size</option>
            <option value="small">Small (2 - 3 members)</option>
            <option value="medium">Medium (4 - 5 members)</option>
            <option value="large">Large (6+ members)</option>
          </select>
          <ChevronDown size={14} className="select-arrow" />
        </div>
      </div>

      {/* 5. Required Skills Multiselect Chips */}
      <div className="filter-group">
        <label className="filter-group-label">Required Skills & Tech</label>
        <div className="skills-filter-chips">
          {POPULAR_TEAM_SKILLS.map((skill) => {
            const isSelected = (filters.skills || []).includes(skill);
            return (
              <button
                type="button"
                key={skill}
                onClick={() => handleToggleSkill(skill)}
                className={`skill-filter-chip ${isSelected ? 'active' : ''}`}
                aria-pressed={isSelected}
              >
                <span>{skill}</span>
                {isSelected && <X size={11} className="chip-remove-icon" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default TeamFilters;
