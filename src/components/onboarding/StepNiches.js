import React, { useState } from 'react';
import { 
  INTEREST_CATEGORIES, 
  NESTED_INTERESTS_TREE 
} from '../../data/onboardingData';
import { 
  Check, 
  ChevronRight, 
  ArrowLeft, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Compass
} from 'lucide-react';

function StepNiches({
  selectedInterests = [],
  selectedPaths = [],
  error,
  onTogglePath,
  onRemovePath,
}) {
  // Navigation drilldown state per root category: { [rootId]: currentNavPathIds[] }
  const [navState, setNavState] = useState({});

  // Active root categories from Step 2
  const activeCategories = INTEREST_CATEGORIES.filter((cat) =>
    selectedInterests.includes(cat.id)
  );

  // Helper to get current node from nav path
  const getNodeAtPath = (rootTree, pathIds = []) => {
    let current = rootTree;
    for (const id of pathIds) {
      if (current && current.children) {
        current = current.children.find((c) => c.id === id);
      }
    }
    return current;
  };

  // Check if a leaf is selected
  const isLeafSelected = (fullPathId) => {
    return selectedPaths.some((p) => p.pathId === fullPathId);
  };

  // Count how many complete leaf selections exist under a given node
  const countLeafSelectionsUnder = (node, currentPathPrefix = []) => {
    if (!node) return 0;
    const fullPath = [...currentPathPrefix, node.id];
    if (!node.children || node.children.length === 0) {
      const pathId = fullPath.join('/');
      return isLeafSelected(pathId) ? 1 : 0;
    }
    return node.children.reduce((sum, child) => {
      return sum + countLeafSelectionsUnder(child, fullPath);
    }, 0);
  };

  // Navigate forward in hierarchy
  const handleDrilldown = (rootId, childId) => {
    setNavState((prev) => {
      const current = prev[rootId] || [];
      return { ...prev, [rootId]: [...current, childId] };
    });
  };

  // Navigate backward in hierarchy
  const handleNavigateUp = (rootId) => {
    setNavState((prev) => {
      const current = prev[rootId] || [];
      return { ...prev, [rootId]: current.slice(0, -1) };
    });
  };

  // Navigate directly to a breadcrumb ancestor
  const handleBreadcrumbClick = (rootId, index) => {
    setNavState((prev) => {
      const current = prev[rootId] || [];
      return { ...prev, [rootId]: current.slice(0, index) };
    });
  };

  // Toggle a leaf selection
  const handleLeafClick = (rootId, leafNode, currentPathIds, currentPathLabels) => {
    const fullPathIds = [rootId, ...currentPathIds, leafNode.id];
    const fullPathLabels = [
      NESTED_INTERESTS_TREE[rootId]?.label || rootId,
      ...currentPathLabels,
      leafNode.label,
    ];
    const pathId = fullPathIds.join('/');

    const pathObject = {
      pathId,
      rootId,
      pathIds: fullPathIds,
      pathLabels: fullPathLabels,
      leafId: leafNode.id,
      leafLabel: leafNode.label,
    };

    onTogglePath(pathObject);
  };

  return (
    <div className="onboarding-step-content" role="group" aria-labelledby="step-nested-niches-heading">
      <div className="step-intro-header">
        <div className="step-header-row">
          <div>
            <h3 id="step-nested-niches-heading" className="step-main-title">
              Select Niches & Specializations
            </h3>
            <p className="step-main-desc">
              Drill down from broad domains to your specific focus areas, stacks, games, or instruments.
            </p>
          </div>
          <div className="interests-selection-counter" aria-live="polite">
            <Layers size={15} />
            <span>{selectedPaths.length} complete path{selectedPaths.length === 1 ? '' : 's'}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="step-inline-alert alert-error" role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Summary of Active Complete Selection Paths */}
      {selectedPaths.length > 0 && (
        <div className="active-paths-summary-block">
          <div className="active-paths-header">
            <span className="active-paths-title">Selected Specialization Paths:</span>
            <span className="active-paths-count">{selectedPaths.length} Active</span>
          </div>
          <div className="active-paths-chips-list">
            {selectedPaths.map((p) => (
              <div key={p.pathId} className="active-path-chip">
                <span className="path-text">
                  {p.pathLabels.map((label, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span className="path-separator">›</span>}
                      <span className={idx === p.pathLabels.length - 1 ? 'path-leaf' : 'path-ancestor'}>
                        {label}
                      </span>
                    </React.Fragment>
                  ))}
                </span>
                <button
                  type="button"
                  onClick={() => onRemovePath(p.pathId)}
                  className="btn-remove-path"
                  aria-label={`Remove path ${p.pathLabels.join(' > ')}`}
                  title="Remove selection"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeCategories.length === 0 ? (
        <div className="niches-empty-notice" role="status">
          <p>No interest categories selected. Please return to Step 2 to pick at least one category.</p>
        </div>
      ) : (
        <div className="nested-category-cards-list">
          {activeCategories.map((cat) => {
            const rootTree = NESTED_INTERESTS_TREE[cat.id];
            if (!rootTree) return null;

            const CategoryIcon = cat.icon;
            const currentSubPath = navState[cat.id] || [];
            const currentNode = getNodeAtPath(rootTree, currentSubPath);

            // Compute breadcrumb labels
            const breadcrumbItems = [];
            let walk = rootTree;
            breadcrumbItems.push({ id: rootTree.id, label: rootTree.label, index: 0 });
            for (let i = 0; i < currentSubPath.length; i++) {
              if (walk && walk.children) {
                walk = walk.children.find((c) => c.id === currentSubPath[i]);
                if (walk) {
                  breadcrumbItems.push({ id: walk.id, label: walk.label, index: i + 1 });
                }
              }
            }

            // Check if this category has at least one complete path
            const pathsForCategory = selectedPaths.filter((p) => p.rootId === cat.id);
            const isCategorySatisfied = pathsForCategory.length > 0;

            const currentPathLabels = breadcrumbItems.slice(1).map((b) => b.label);

            return (
              <div key={cat.id} className="nested-category-card">
                {/* Category Header Row */}
                <div className="nested-card-top-header">
                  <div className="nested-card-identity">
                    <div className={`nested-cat-icon-badge ${cat.colorClass}`}>
                      {CategoryIcon && <CategoryIcon size={18} />}
                    </div>
                    <div>
                      <h4 className="nested-cat-title">{cat.name}</h4>
                      <p className="nested-cat-hint">{cat.description}</p>
                    </div>
                  </div>

                  <div className="nested-card-status">
                    {isCategorySatisfied ? (
                      <span className="status-badge-complete">
                        <CheckCircle2 size={14} />
                        <span>{pathsForCategory.length} complete path{pathsForCategory.length === 1 ? '' : 's'}</span>
                      </span>
                    ) : (
                      <span className="status-badge-incomplete">
                        <Compass size={14} />
                        <span>Select leaf option to complete</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Interactive Multi-Level Drilldown Explorer */}
                <div className="nested-drilldown-box">
                  {/* Breadcrumb Navigation Trail */}
                  <div className="drilldown-breadcrumb-bar">
                    <div className="breadcrumb-trail">
                      {breadcrumbItems.map((item, idx) => {
                        const isLast = idx === breadcrumbItems.length - 1;
                        return (
                          <React.Fragment key={item.id}>
                            {idx > 0 && <ChevronRight size={13} className="crumb-arrow" />}
                            {isLast ? (
                              <span className="crumb-current">{item.label}</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleBreadcrumbClick(cat.id, item.index)}
                                className="crumb-link-btn"
                              >
                                {item.label}
                              </button>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {currentSubPath.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleNavigateUp(cat.id)}
                        className="btn-crumb-back"
                        title="Go back one level"
                      >
                        <ArrowLeft size={13} />
                        <span>Back</span>
                      </button>
                    )}
                  </div>

                  {/* Level Content: Options List */}
                  <div className="drilldown-options-area">
                    <div className="options-level-prompt">
                      {currentNode?.children && currentNode.children.some((c) => c.children) ? (
                        <span>Choose a sub-discipline or category to drill down:</span>
                      ) : (
                        <span>Select your specific interests / leaf options (Multiple selections allowed):</span>
                      )}
                    </div>

                    <div className="drilldown-tiles-grid">
                      {currentNode?.children?.map((child) => {
                        const hasSubChildren = child.children && child.children.length > 0;
                        const fullChildPathId = [cat.id, ...currentSubPath, child.id].join('/');
                        const isSelected = !hasSubChildren && isLeafSelected(fullChildPathId);
                        const selectedUnderCount = hasSubChildren
                          ? countLeafSelectionsUnder(child, [cat.id, ...currentSubPath])
                          : 0;

                        if (hasSubChildren) {
                          // Intermediate Branch Node (Click to drill down)
                          return (
                            <button
                              key={child.id}
                              type="button"
                              onClick={() => handleDrilldown(cat.id, child.id)}
                              className="drilldown-branch-card"
                            >
                              <div className="branch-card-text">
                                <span className="branch-title">{child.label}</span>
                                <span className="branch-subcount">
                                  {child.children.length} sub-options
                                  {selectedUnderCount > 0 && (
                                    <span className="branch-picked-tag">
                                      · {selectedUnderCount} selected
                                    </span>
                                  )}
                                </span>
                              </div>
                              <ChevronRight size={16} className="branch-chevron" />
                            </button>
                          );
                        }

                        // Terminal Leaf Option (Click to toggle complete path selection)
                        return (
                          <button
                            key={child.id}
                            type="button"
                            role="checkbox"
                            aria-checked={isSelected}
                            onClick={() => handleLeafClick(cat.id, child, currentSubPath, currentPathLabels)}
                            className={`drilldown-leaf-tile ${isSelected ? 'is-selected' : ''}`}
                          >
                            <span className={`leaf-tile-checkbox ${isSelected ? 'checked' : ''}`} aria-hidden="true">
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </span>
                            <span className="leaf-tile-name">{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StepNiches;
