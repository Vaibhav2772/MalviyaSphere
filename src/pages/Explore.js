import React, { useState, useMemo, useCallback } from 'react';
import ExploreSearchBar from '../components/explore/ExploreSearchBar';
import CategoryHierarchyNav from '../components/explore/CategoryHierarchyNav';
import FilterPanel, { GOAL_FILTER_OPTIONS } from '../components/explore/FilterPanel';
import StudentCard from '../components/explore/StudentCard';
import { useStudents } from '../context/StudentContext';
import { SearchX, Users, Sparkles, RotateCcw } from 'lucide-react';
import './Explore.css';

function Explore() {
  const {
    students,
    connectionStates,
    followStates,
    toggleConnect,
    toggleFollow,
  } = useStudents();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Hierarchical category navigation state
  const [selectedCategory, setSelectedCategory] = useState(null); // root category id (e.g. 'technology')
  const [selectedHierarchyPath, setSelectedHierarchyPath] = useState([]); // array of { id, label, children }
  const [selectedFilterValue, setSelectedFilterValue] = useState(null); // specific niche/subcategory label

  // Sidebar Filters state
  const [filters, setFilters] = useState({
    categories: [],
    skillLevels: [],
    experiences: [],
    goals: [],
    availabilities: [],
  });

  // Category selection handler
  const handleSelectCategory = useCallback((catId) => {
    setSelectedCategory(catId);
    setSelectedHierarchyPath([]);
    setSelectedFilterValue(null);
  }, []);

  // Drill down into a tree node
  const handleDrillDownNode = useCallback((node) => {
    if (node.children && node.children.length > 0) {
      setSelectedHierarchyPath((prev) => [...prev, node]);
      setSelectedFilterValue(node.label);
    } else {
      // Leaf node clicked
      setSelectedFilterValue((prev) => (prev === node.label ? null : node.label));
    }
  }, []);

  // Navigate back via breadcrumb index
  const handleNavigateBreadcrumb = useCallback((index) => {
    if (index === -1) {
      // Return to all categories
      setSelectedCategory(null);
      setSelectedHierarchyPath([]);
      setSelectedFilterValue(null);
    } else if (index === 0) {
      // Root category
      setSelectedHierarchyPath([]);
      setSelectedFilterValue(null);
    } else {
      // Slice up to that index
      setSelectedHierarchyPath((prev) => prev.slice(0, index));
      setSelectedFilterValue(null);
    }
  }, []);

  // Reset category hierarchy completely
  const handleResetHierarchy = useCallback(() => {
    setSelectedCategory(null);
    setSelectedHierarchyPath([]);
    setSelectedFilterValue(null);
  }, []);

  // Filter toggle handler
  const handleToggleFilter = useCallback((groupKey, itemValue) => {
    setFilters((prev) => {
      const currentList = prev[groupKey] || [];
      const exists = currentList.includes(itemValue);
      const updatedList = exists
        ? currentList.filter((v) => v !== itemValue)
        : [...currentList, itemValue];
      return { ...prev, [groupKey]: updatedList };
    });
  }, []);

  // Remove single chip
  const handleRemoveChip = useCallback((groupKey, itemValue) => {
    setFilters((prev) => ({
      ...prev,
      [groupKey]: (prev[groupKey] || []).filter((v) => v !== itemValue),
    }));
  }, []);

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    setFilters({
      categories: [],
      skillLevels: [],
      experiences: [],
      goals: [],
      availabilities: [],
    });
  }, []);

  // Full reset (search + category + filters)
  const handleResetAll = useCallback(() => {
    setSearchQuery('');
    handleResetHierarchy();
    handleClearAllFilters();
  }, [handleResetHierarchy, handleClearAllFilters]);

  // Filter and Search Matching Logic
  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return students.filter((student) => {
      // 1. Search Query Match
      if (query) {
        const nameMatch = student.fullName?.toLowerCase().includes(query);
        const bioMatch = student.bio?.toLowerCase().includes(query);
        const branchMatch = student.branch?.toLowerCase().includes(query);
        const interestsMatch = (student.interests || []).some((i) => i.toLowerCase().includes(query));
        const nichesMatch = (student.niches || []).some((n) => n.toLowerCase().includes(query));
        const projectsMatch = (student.projects || []).some(
          (p) => p.name?.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query)
        );
        const expMatch = student.experienceSummary?.toLowerCase().includes(query);

        if (!nameMatch && !bioMatch && !branchMatch && !interestsMatch && !nichesMatch && !projectsMatch && !expMatch) {
          return false;
        }
      }

      // 2. Hierarchical Category / Niche Selection Match
      if (selectedCategory) {
        // Must belong to this interest category
        const hasCategory = (student.interests || []).includes(selectedCategory);
        if (!hasCategory) return false;

        // If a specific subcategory or leaf niche is selected, check match
        if (selectedFilterValue) {
          const valLower = selectedFilterValue.toLowerCase();
          const matchesNiche = (student.niches || []).some((n) => n.toLowerCase().includes(valLower));
          const matchesPath = (student.selectedPaths || []).some((p) =>
            p.pathLabels.some((lbl) => lbl.toLowerCase().includes(valLower))
          );
          if (!matchesNiche && !matchesPath) return false;
        } else if (selectedHierarchyPath.length > 0) {
          // If drilled into a subcategory without a leaf selected, match intermediate labels
          const activeSubLabel = selectedHierarchyPath[selectedHierarchyPath.length - 1].label.toLowerCase();
          const matchesPath = (student.selectedPaths || []).some((p) =>
            p.pathLabels.some((lbl) => lbl.toLowerCase().includes(activeSubLabel))
          );
          const matchesNiche = (student.niches || []).some((n) => n.toLowerCase().includes(activeSubLabel));
          if (!matchesPath && !matchesNiche) return false;
        }
      }

      // 3. Filter: Interest Categories from FilterPanel
      if (filters.categories?.length > 0) {
        const matchesCat = (student.interests || []).some((c) => filters.categories.includes(c));
        if (!matchesCat) return false;
      }

      // 4. Filter: Skill Levels
      if (filters.skillLevels?.length > 0) {
        if (!filters.skillLevels.includes(student.skillLevel)) {
          return false;
        }
      }

      // 5. Filter: Experience Category
      if (filters.experiences?.length > 0) {
        if (!filters.experiences.includes(student.experienceCategory)) {
          return false;
        }
      }

      // 6. Filter: Goals
      if (filters.goals?.length > 0) {
        const studentGoals = student.goals || [];
        const matchesAnyGoalFilter = filters.goals.some((filterGoalId) => {
          const goalConfig = GOAL_FILTER_OPTIONS.find((g) => g.id === filterGoalId);
          if (!goalConfig) return false;

          // Match by keywords or id
          return studentGoals.some((sg) => {
            if (goalConfig.matchPrefix && sg.includes(goalConfig.matchPrefix)) return true;
            if (goalConfig.matchKeywords) {
              return goalConfig.matchKeywords.some((kw) => sg.toLowerCase().includes(kw));
            }
            return false;
          });
        });

        if (!matchesAnyGoalFilter) return false;
      }

      // 7. Filter: Availability
      if (filters.availabilities?.length > 0) {
        if (!filters.availabilities.includes(student.availability)) {
          return false;
        }
      }

      return true;
    });
  }, [students, searchQuery, selectedCategory, selectedHierarchyPath, selectedFilterValue, filters]);

  // Is any filter or search active?
  const isAnyFilterActive =
    searchQuery.trim().length > 0 ||
    selectedCategory !== null ||
    (filters.categories?.length || 0) > 0 ||
    (filters.skillLevels?.length || 0) > 0 ||
    (filters.experiences?.length || 0) > 0 ||
    (filters.goals?.length || 0) > 0 ||
    (filters.availabilities?.length || 0) > 0;

  return (
    <div className="explore-page-root">
      <div className="explore-container container">
        {/* Page Hero Header */}
        <header className="explore-hero-header">
          <div className="explore-hero-badge">
            <Sparkles size={14} />
            <span>Discover Campus Talent</span>
          </div>
          <h1 className="explore-main-title">Explore MalviyaSphere</h1>
          <p className="explore-main-description">
            Discover fellow MMMUT students across hobbies, specialized tech niches, instruments, esports, and projects. Connect and build together.
          </p>
        </header>

        {/* Prominent Search Bar */}
        <ExploreSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
        />

        {/* Hierarchical Category Navigator */}
        <CategoryHierarchyNav
          selectedCategory={selectedCategory}
          selectedHierarchyPath={selectedHierarchyPath}
          selectedFilterValue={selectedFilterValue}
          onSelectCategory={handleSelectCategory}
          onDrillDownNode={handleDrillDownNode}
          onNavigateBreadcrumb={handleNavigateBreadcrumb}
          onResetHierarchy={handleResetHierarchy}
        />

        {/* Main 2-Column Content: Filter Sidebar + Student Cards Grid */}
        <div className="explore-main-layout">
          {/* Left Sidebar: Filter Panel */}
          <aside className="explore-sidebar-col">
            <FilterPanel
              filters={filters}
              onToggleFilter={handleToggleFilter}
              onClearAllFilters={handleClearAllFilters}
              onRemoveChip={handleRemoveChip}
              totalResultsCount={filteredStudents.length}
            />
          </aside>

          {/* Right Area: Results Counter & Cards Grid / Empty State */}
          <main className="explore-results-col" aria-label="Student Results">
            <div className="explore-results-toolbar">
              <div className="results-count-wrap">
                <Users size={16} className="toolbar-icon" />
                <span className="results-count-text">
                  Showing <strong>{filteredStudents.length}</strong> {filteredStudents.length === 1 ? 'student' : 'students'}
                </span>
                {selectedCategory && (
                  <span className="toolbar-category-tag">
                    in {selectedFilterValue || selectedCategory}
                  </span>
                )}
              </div>

              {isAnyFilterActive && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="btn-toolbar-reset"
                  title="Reset search, categories, and filters"
                >
                  <RotateCcw size={13} />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Results Grid or Empty State */}
            {filteredStudents.length > 0 ? (
              <div className="students-grid" role="list">
                {filteredStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    connectionState={connectionStates[student.id] || 'connect'}
                    isFollowing={!!followStates[student.id]}
                    onToggleConnect={toggleConnect}
                    onToggleFollow={toggleFollow}
                  />
                ))}
              </div>
            ) : (
              <div className="explore-empty-state" role="status">
                <div className="empty-state-icon-box">
                  <SearchX size={44} />
                </div>
                <h3 className="empty-state-title">No matching students found</h3>
                <p className="empty-state-text">
                  We couldn't find any students matching your current search query or combination of filters. Try broadening your keywords, selecting a parent category, or clearing active filters.
                </p>
                <div className="empty-state-actions">
                  {activeChipsCount(filters) > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllFilters}
                      className="btn-empty-action btn-empty-filters"
                    >
                      Clear All Filters
                    </button>
                  )}
                  {selectedCategory && (
                    <button
                      type="button"
                      onClick={handleResetHierarchy}
                      className="btn-empty-action btn-empty-category"
                    >
                      Reset Category
                    </button>
                  )}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="btn-empty-action btn-empty-search"
                    >
                      Clear Search Query
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="btn-empty-action btn-empty-all"
                  >
                    Reset Everything
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Helper to count active chips in empty state
function activeChipsCount(filters) {
  return (
    (filters.skillLevels?.length || 0) +
    (filters.experiences?.length || 0) +
    (filters.goals?.length || 0) +
    (filters.availabilities?.length || 0) +
    (filters.categories?.length || 0)
  );
}

export default Explore;
