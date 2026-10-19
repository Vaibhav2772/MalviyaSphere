import React from 'react';
import { Search, X } from 'lucide-react';
import './ExploreSearchBar.css';

function ExploreSearchBar({ searchQuery, onSearchChange, onClearSearch }) {
  return (
    <div className="explore-search-wrapper" role="search">
      <div className="explore-search-input-container">
        <span className="explore-search-icon" aria-hidden="true">
          <Search size={20} />
        </span>
        <input
          type="text"
          id="explore-student-search"
          aria-label="Find people, interests, skills, or niches"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Find people, interests, skills, or niches..."
          className="explore-search-input"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            className="explore-search-clear-btn"
            aria-label="Clear search input"
            title="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ExploreSearchBar;
