import React from 'react';
import { INTEREST_CATEGORIES, NESTED_INTERESTS_TREE } from '../../data/onboardingData';
import { ChevronRight, ArrowLeft, RotateCcw, Check } from 'lucide-react';
import './CategoryHierarchyNav.css';

function CategoryHierarchyNav({
  selectedCategory,
  selectedHierarchyPath = [], // array of { id, label, children }
  selectedFilterValue = null, // specific node label or id being filtered by
  onSelectCategory,
  onDrillDownNode,
  onNavigateBreadcrumb,
  onResetHierarchy,
}) {
  // Current active tree node
  const activeTreeRoot = selectedCategory ? NESTED_INTERESTS_TREE[selectedCategory] : null;

  // Determine current node in path
  const currentNode = selectedHierarchyPath.length > 0
    ? selectedHierarchyPath[selectedHierarchyPath.length - 1]
    : activeTreeRoot;

  // Current children to display
  const currentChildren = currentNode?.children || [];

  return (
    <div className="category-hierarchy-container" aria-label="Explore Categories & Niches">
      {/* 1. Root Level: 6 Primary Category Cards */}
      {!selectedCategory ? (
        <div className="category-cards-grid">
          {INTEREST_CATEGORIES.map((cat) => {
            const IconComp = cat.icon;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`category-item-card ${cat.colorClass}`}
                aria-label={`Explore category ${cat.name}`}
              >
                <div className="category-card-header">
                  <div className="category-icon-frame">
                    {IconComp && <IconComp size={22} />}
                  </div>
                  <h3 className="category-card-name">{cat.name}</h3>
                </div>
                <p className="category-card-desc">{cat.description}</p>
                <div className="category-card-cta">
                  <span>Browse Subcategories</span>
                  <ChevronRight size={16} />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* 2. Hierarchical Drill-down View with Breadcrumbs */
        <div className="hierarchy-drilldown-panel">
          {/* Breadcrumb Navigation Bar */}
          <nav className="hierarchy-breadcrumbs-bar" aria-label="Hierarchy Breadcrumbs">
            <div className="breadcrumbs-list">
              <button
                type="button"
                onClick={() => onNavigateBreadcrumb(-1)}
                className="breadcrumb-btn breadcrumb-root"
              >
                All Categories
              </button>

              <ChevronRight size={14} className="breadcrumb-arrow" />

              <button
                type="button"
                onClick={() => onNavigateBreadcrumb(0)}
                className={`breadcrumb-btn ${selectedHierarchyPath.length === 0 ? 'is-active' : ''}`}
              >
                {activeTreeRoot?.label || selectedCategory}
              </button>

              {selectedHierarchyPath.map((item, index) => {
                const isLast = index === selectedHierarchyPath.length - 1;
                return (
                  <React.Fragment key={item.id || index}>
                    <ChevronRight size={14} className="breadcrumb-arrow" />
                    <button
                      type="button"
                      onClick={() => onNavigateBreadcrumb(index + 1)}
                      className={`breadcrumb-btn ${isLast ? 'is-active' : ''}`}
                    >
                      {item.label}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onResetHierarchy}
              className="hierarchy-reset-btn"
              title="Reset category view"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </nav>

          {/* Current Level Header & Sub-options */}
          <div className="hierarchy-level-content">
            <div className="hierarchy-level-header">
              <div className="level-title-wrap">
                <span className="level-indicator-badge">
                  {currentChildren.length > 0 ? 'Subcategories & Niches' : 'Specialized Niche'}
                </span>
                <h4 className="hierarchy-current-title">
                  {currentNode?.label || 'Select Topic'}
                </h4>
              </div>

              {selectedHierarchyPath.length > 0 && (
                <button
                  type="button"
                  onClick={() => onNavigateBreadcrumb(selectedHierarchyPath.length - 1)}
                  className="hierarchy-back-btn"
                >
                  <ArrowLeft size={15} />
                  <span>Back to parent</span>
                </button>
              )}
            </div>

            {/* Display Children Nodes or Leaf Selection */}
            {currentChildren.length > 0 ? (
              <div className="hierarchy-children-grid">
                {currentChildren.map((child) => {
                  const hasDeeper = child.children && child.children.length > 0;
                  const isSelected = selectedFilterValue === child.label || selectedFilterValue === child.id;

                  return (
                    <button
                      type="button"
                      key={child.id}
                      onClick={() => onDrillDownNode(child)}
                      className={`hierarchy-node-btn ${hasDeeper ? 'has-children' : 'is-leaf'} ${
                        isSelected ? 'is-selected' : ''
                      }`}
                    >
                      <span className="node-btn-label">{child.label}</span>
                      {hasDeeper ? (
                        <ChevronRight size={15} className="node-btn-arrow" />
                      ) : (
                        isSelected && <Check size={14} className="node-check-icon" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="hierarchy-leaf-notice">
                <p>
                  You are viewing students in niche: <strong>{currentNode?.label}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryHierarchyNav;
