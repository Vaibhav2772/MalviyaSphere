import React, { useState, useMemo, useCallback } from 'react';
import { useTeams } from '../context/TeamsContext';
import TeamCard from '../components/teams/TeamCard';
import TeamFilters from '../components/teams/TeamFilters';
import CreateTeamModal from '../components/teams/CreateTeamModal';
import RequestJoinModal from '../components/teams/RequestJoinModal';
import { computeRecruitmentStatus } from '../data/teamsData';
import { 
  Users, 
  Search, 
  Plus, 
  RotateCcw, 
  SearchX, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import './Teams.css';

function Teams() {
  const { teams } = useTeams();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    hasOpenRoles: false,
    teamSize: 'all',
    skills: [],
  });

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joinModalTeam, setJoinModalTeam] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter change handler
  const handleChangeFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      category: 'all',
      status: 'all',
      hasOpenRoles: false,
      teamSize: 'all',
      skills: [],
    });
  }, []);

  // Reset all (search + filters)
  const handleResetAll = useCallback(() => {
    setSearchQuery('');
    handleClearFilters();
  }, [handleClearFilters]);

  // Filter and search matching logic
  const filteredTeams = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return teams.filter((team) => {
      const status = computeRecruitmentStatus(team);

      // 1. Text Search query matching
      if (query) {
        const nameMatch = team.name.toLowerCase().includes(query);
        const objMatch = team.objective && team.objective.toLowerCase().includes(query);
        const descMatch = team.description && team.description.toLowerCase().includes(query);
        const catMatch = (team.categoryLabel || team.category || '').toLowerCase().includes(query);
        const skillsMatch = (team.requiredSkills || []).some((s) => s.toLowerCase().includes(query));
        const rolesMatch = (team.openRoles || []).some(
          (r) => r.title.toLowerCase().includes(query) || (r.description && r.description.toLowerCase().includes(query))
        );

        if (!nameMatch && !objMatch && !descMatch && !catMatch && !skillsMatch && !rolesMatch) {
          return false;
        }
      }

      // 2. Category filter
      if (filters.category !== 'all') {
        if (team.category !== filters.category) return false;
      }

      // 3. Recruitment status filter
      if (filters.status !== 'all') {
        if (status !== filters.status) return false;
      }

      // 4. Has open roles
      if (filters.hasOpenRoles) {
        if (!team.openRoles || team.openRoles.length === 0 || status === 'closed') {
          return false;
        }
      }

      // 5. Team size
      if (filters.teamSize !== 'all') {
        const size = team.members ? team.members.length : 0;
        if (filters.teamSize === 'small' && (size < 2 || size > 3)) return false;
        if (filters.teamSize === 'medium' && (size < 4 || size > 5)) return false;
        if (filters.teamSize === 'large' && size < 6) return false;
      }

      // 6. Required skills filter
      if (filters.skills && filters.skills.length > 0) {
        const teamSkills = (team.requiredSkills || []).map((s) => s.toLowerCase());
        const hasAllSelectedSkills = filters.skills.every((reqSkill) =>
          teamSkills.some((ts) => ts.includes(reqSkill.toLowerCase()))
        );
        if (!hasAllSelectedSkills) return false;
      }

      return true;
    });
  }, [teams, searchQuery, filters]);

  return (
    <div className="teams-page-root">
      <div className="teams-container container">
        {/* Page Hero Header */}
        <header className="teams-hero-header">
          <div className="teams-hero-top-row">
            <div>
              <div className="teams-hero-badge">
                <Users size={14} />
                <span>MalviyaSphere Teams & Recruitment</span>
              </div>
              <h1 className="teams-main-title">Find Your Team</h1>
              <p className="teams-main-description">
                Discover campus project teams, open recruitment vacancies, and hackathon collaborators with complementary interests and skills across MMMUT.
              </p>
            </div>

            {/* Prominent Create Team Button */}
            <div className="teams-hero-action-box">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-create-team-primary"
                aria-label="Create Team"
              >
                <Plus size={18} />
                <span>Create Team</span>
              </button>
            </div>
          </div>

          {/* Search Bar Row */}
          <div className="teams-search-row">
            <div className="teams-search-bar-wrap">
              <Search size={18} className="search-bar-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by team name, objective, skills (e.g. ROS, React, OpenCV), domain, or open roles..."
                className="teams-search-input"
                aria-label="Search teams by name, description, or skills"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="btn-clear-search"
                  aria-label="Clear search query"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="btn-toggle-mobile-filters"
              aria-label="Toggle filters on mobile"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
          </div>
        </header>

        {/* 2-Column Main Layout: Filters Sidebar + Results Grid */}
        <div className="teams-main-layout">
          {/* Filters Sidebar */}
          <div className={`teams-sidebar-col ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
            <TeamFilters
              filters={filters}
              onChangeFilter={handleChangeFilter}
              onClearFilters={handleClearFilters}
              totalResultsCount={filteredTeams.length}
            />
          </div>

          {/* Results Grid Column */}
          <main className="teams-results-col" aria-label="Teams List">
            {/* Toolbar: Results Count and Active Tag */}
            <div className="teams-results-toolbar">
              <div className="teams-count-wrap">
                <Users size={16} className="toolbar-icon" />
                <span>
                  Showing <strong>{filteredTeams.length}</strong> {filteredTeams.length === 1 ? 'team' : 'teams'}
                  {filters.category !== 'all' && (
                    <span className="toolbar-category-tag">
                      · {filters.category}
                    </span>
                  )}
                </span>
              </div>

              {(searchQuery || filters.category !== 'all' || filters.status !== 'all' || filters.skills.length > 0) && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="btn-toolbar-reset"
                  title="Clear all search and active filters"
                >
                  <RotateCcw size={13} />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Empty State */}
            {filteredTeams.length === 0 ? (
              <div className="teams-empty-state">
                <div className="empty-state-icon-box">
                  <SearchX size={36} />
                </div>
                <h3 className="empty-state-title">No Teams Found</h3>
                <p className="empty-state-text">
                  We couldn't find any campus project teams matching your search query or active filter criteria. Try adjusting your filters or start your own team to recruit collaborators.
                </p>
                <div className="empty-state-actions">
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="btn-empty-action btn-empty-filters"
                  >
                    Clear All Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-empty-action btn-empty-all"
                  >
                    <Plus size={15} />
                    <span>Create a Team</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Teams Responsive Grid */
              <div className="teams-grid">
                {filteredTeams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onRequestJoin={(selectedTeam) => setJoinModalTeam(selectedTeam)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Create Team Modal */}
      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(newTeam) => {
          // Success handled in modal, can view new team
        }}
      />

      {/* Request to Join Modal */}
      <RequestJoinModal
        isOpen={!!joinModalTeam}
        onClose={() => setJoinModalTeam(null)}
        team={joinModalTeam}
      />
    </div>
  );
}

export default Teams;
