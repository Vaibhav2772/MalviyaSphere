import React, { useState, useEffect, useCallback } from 'react';
import './Onboarding.css';
import logo from '../assets/logo.png';
import ProgressIndicator from '../components/onboarding/ProgressIndicator';
import StepBasicInfo from '../components/onboarding/StepBasicInfo';
import StepInterests from '../components/onboarding/StepInterests';
import StepNiches from '../components/onboarding/StepNiches';
import StepSkillsExperience from '../components/onboarding/StepSkillsExperience';
import StepGoalsPreferences from '../components/onboarding/StepGoalsPreferences';
import OnboardingCompletion from '../components/onboarding/OnboardingCompletion';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

const TOTAL_STEPS = 5;

// URL Validator helper
const isValidHttpUrl = (string) => {
  if (!string || !string.trim()) return true;
  const val = string.trim();
  // Accept standard URLs or domain-like entries (e.g. github.com/user or https://...)
  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i;
  return urlPattern.test(val);
};

function Onboarding() {
  const { user, completeOnboarding, saveOnboardingDraft, getOnboardingDraft, clearOnboardingDraft } = useAuth();
  const { navigate } = useRouter();

  // Current Step (1 to 5, or 6 for completion)
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: user?.name || '',
    programme: 'undergraduate',
    branch: '',
    academicYear: '',
    avatar: null,

    // Step 2: Interests
    interests: [],

    // Step 3: Niches & Nested Paths
    selectedPaths: [],
    niches: [],

    // Step 4: Skills & Experience
    skillLevel: 'learner',
    experienceSummary: '',
    projects: [],
    achievements: '',
    portfolioUrl: '',
    githubUrl: '',
    linkedinUrl: '',

    // Step 5: Goals & Preferences
    goals: [],
    collabs: [],
    availability: '',
  });

  // Step-level validation error states
  const [stepErrors, setStepErrors] = useState({});
  const [urlErrors, setUrlErrors] = useState({});

  // Restore draft from localStorage on initial mount
  useEffect(() => {
    const savedDraft = getOnboardingDraft();
    if (savedDraft) {
      setFormData((prev) => ({
        ...prev,
        ...savedDraft,
        // Keep user name prefilled if saved draft didn't have it
        fullName: savedDraft.fullName || user?.name || prev.fullName,
        selectedPaths: savedDraft.selectedPaths || [],
      }));
      if (savedDraft._savedStep && savedDraft._savedStep <= TOTAL_STEPS) {
        setCurrentStep(savedDraft._savedStep);
      }
    } else if (user?.name) {
      setFormData((prev) => ({ ...prev, fullName: user.name }));
    }
  }, [getOnboardingDraft, user]);

  // Persist draft on changes
  useEffect(() => {
    if (!isCompleted) {
      saveOnboardingDraft({
        ...formData,
        _savedStep: currentStep,
      });
    }
  }, [formData, currentStep, isCompleted, saveOnboardingDraft]);

  // Step 1 Change Handlers
  const handleBasicInfoChange = useCallback((fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    // Clear relevant errors
    setStepErrors((prev) => {
      const updated = { ...prev };
      Object.keys(fields).forEach((k) => delete updated[k]);
      return updated;
    });
  }, []);

  // Step 2: Toggle Interest selection
  const handleToggleInterest = useCallback((interestId) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interestId);
      const newInterests = exists
        ? prev.interests.filter((id) => id !== interestId)
        : [...prev.interests, interestId];

      // If an interest is deselected, also remove all its descendant selection paths & niches
      let newSelectedPaths = prev.selectedPaths || [];
      let newNiches = prev.niches || [];
      if (exists) {
        newSelectedPaths = newSelectedPaths.filter((p) => p.rootId !== interestId);
        newNiches = newSelectedPaths.map((p) => p.leafLabel);
      }

      return {
        ...prev,
        interests: newInterests,
        selectedPaths: newSelectedPaths,
        niches: newNiches,
      };
    });

    setStepErrors((prev) => {
      const updated = { ...prev };
      delete updated.interests;
      return updated;
    });
  }, []);

  // Step 3: Toggle complete leaf selection path
  const handleTogglePath = useCallback((pathObj) => {
    setFormData((prev) => {
      const currentPaths = prev.selectedPaths || [];
      const exists = currentPaths.some((p) => p.pathId === pathObj.pathId);
      const updatedPaths = exists
        ? currentPaths.filter((p) => p.pathId !== pathObj.pathId)
        : [...currentPaths, pathObj];

      return {
        ...prev,
        selectedPaths: updatedPaths,
        niches: updatedPaths.map((p) => p.leafLabel),
      };
    });

    setStepErrors((prev) => {
      const updated = { ...prev };
      delete updated.niches;
      return updated;
    });
  }, []);

  const handleRemovePath = useCallback((pathId) => {
    setFormData((prev) => {
      const currentPaths = prev.selectedPaths || [];
      const updatedPaths = currentPaths.filter((p) => p.pathId !== pathId);
      return {
        ...prev,
        selectedPaths: updatedPaths,
        niches: updatedPaths.map((p) => p.leafLabel),
      };
    });
  }, []);

  // Step 4: Skills & Projects Handlers
  const handleSkillsChange = useCallback((fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  }, []);

  const handleAddProject = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { id: Date.now(), name: '', description: '', link: '' },
      ],
    }));
  }, []);

  const handleUpdateProject = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedProjects = [...(prev.projects || [])];
      if (updatedProjects[index]) {
        updatedProjects[index] = { ...updatedProjects[index], [field]: value };
      }
      return { ...prev, projects: updatedProjects };
    });

    // Clear project URL error if updated
    if (field === 'link') {
      setUrlErrors((prev) => {
        const copy = { ...prev };
        delete copy[`project_${index}`];
        return copy;
      });
    }
  }, []);

  const handleRemoveProject = useCallback((index) => {
    setFormData((prev) => {
      const updated = [...(prev.projects || [])];
      updated.splice(index, 1);
      return { ...prev, projects: updated };
    });
  }, []);

  // Step 5: Goals & Preferences Handlers
  const handleToggleGoal = useCallback((goalId) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goalId);
      const newGoals = exists
        ? prev.goals.filter((g) => g !== goalId)
        : [...prev.goals, goalId];
      return { ...prev, goals: newGoals };
    });

    setStepErrors((prev) => {
      const updated = { ...prev };
      delete updated.goals;
      return updated;
    });
  }, []);

  const handleToggleCollab = useCallback((collabId) => {
    setFormData((prev) => {
      const exists = prev.collabs.includes(collabId);
      const newCollabs = exists
        ? prev.collabs.filter((c) => c !== collabId)
        : [...prev.collabs, collabId];
      return { ...prev, collabs: newCollabs };
    });
  }, []);

  const handleSelectAvailability = useCallback((val) => {
    setFormData((prev) => ({ ...prev, availability: val }));
  }, []);

  // Step Validation logic
  const validateCurrentStep = () => {
    const errors = {};

    if (currentStep === 1) {
      if (!formData.fullName || !formData.fullName.trim()) {
        errors.fullName = 'Full name is required.';
      }
      if (!formData.programme) {
        errors.programme = 'Please select your academic programme level.';
      }
      if (!formData.branch) {
        errors.branch = 'Please select your department or branch.';
      }
      if (!formData.academicYear) {
        errors.academicYear = 'Please select your current academic year.';
      }
    } else if (currentStep === 2) {
      if (!formData.interests || formData.interests.length === 0) {
        errors.interests = 'Please select at least one interest category to proceed.';
      }
    } else if (currentStep === 3) {
      // Require at least one complete leaf selection path for each selected interest
      const missingCategories = (formData.interests || []).filter((interestId) => {
        return !(formData.selectedPaths || []).some((path) => path.rootId === interestId);
      });
      if (missingCategories.length > 0) {
        errors.niches = 'Please select at least one complete specialization path ending at a specific focus for each of your selected interests.';
      }
    } else if (currentStep === 4) {
      // Validate URLs if provided
      const newUrlErrors = {};
      if (formData.portfolioUrl && !isValidHttpUrl(formData.portfolioUrl)) {
        newUrlErrors.portfolioUrl = 'Please enter a valid URL (e.g. https://yourportfolio.dev)';
      }
      if (formData.githubUrl && !isValidHttpUrl(formData.githubUrl)) {
        newUrlErrors.githubUrl = 'Please enter a valid GitHub URL (e.g. https://github.com/username)';
      }
      if (formData.linkedinUrl && !isValidHttpUrl(formData.linkedinUrl)) {
        newUrlErrors.linkedinUrl = 'Please enter a valid LinkedIn URL (e.g. https://linkedin.com/in/username)';
      }

      (formData.projects || []).forEach((proj, idx) => {
        if (proj.link && !isValidHttpUrl(proj.link)) {
          newUrlErrors[`project_${idx}`] = 'Please enter a valid project URL.';
        }
      });

      setUrlErrors(newUrlErrors);
      if (Object.keys(newUrlErrors).length > 0) {
        errors.urls = 'Please correct the invalid URL format(s) before proceeding.';
      }
    } else if (currentStep === 5) {
      if (!formData.goals || formData.goals.length === 0) {
        errors.goals = 'Please select at least one goal for joining MalviyaSphere.';
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation: Next
  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Step 5 completed -> Finalize
      handleFinalizeProfile();
    }
  };

  // Navigation: Back
  const handleBack = () => {
    if (currentStep > 1) {
      setStepErrors({});
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Navigation: Skip (allowed on optional Step 4)
  const handleSkip = () => {
    if (currentStep === 4) {
      setUrlErrors({});
      setStepErrors({});
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Profile Completion
  const handleFinalizeProfile = () => {
    completeOnboarding(formData);
    clearOnboardingDraft();
    setIsCompleted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset Onboarding draft to start over
  const handleResetDraft = () => {
    if (window.confirm('Reset onboarding draft and start from Step 1?')) {
      clearOnboardingDraft();
      setFormData({
        fullName: user?.name || '',
        programme: 'undergraduate',
        branch: '',
        academicYear: '',
        avatar: null,
        interests: [],
        selectedPaths: [],
        niches: [],
        skillLevel: 'learner',
        experienceSummary: '',
        projects: [],
        achievements: '',
        portfolioUrl: '',
        githubUrl: '',
        linkedinUrl: '',
        goals: [],
        collabs: [],
        availability: '',
      });
      setCurrentStep(1);
      setStepErrors({});
      setUrlErrors({});
    }
  };

  return (
    <div className="onboarding-page-container">
      {/* Main Content Area */}
      <main className="onboarding-main-stage container">
        <div className="onboarding-center-card">
          {/* Header Banner */}
          {!isCompleted && (
            <div className="onboarding-card-header">
              <div className="onboarding-card-brand-row">
                <div className="onboarding-brand-pill">
                  <img src={logo} alt="MalviyaSphere Logo" className="brand-logo-img" />
                  <span className="brand-name">
                    Malviya<span className="brand-name-accent">Sphere</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetDraft}
                  className="btn-draft-reset"
                  title="Reset onboarding draft to start fresh"
                >
                  <RotateCcw size={13} />
                  <span>Reset Draft</span>
                </button>
              </div>

              <h1 className="onboarding-main-headline">Let's build your sphere.</h1>
              <p className="onboarding-sub-headline">
                Tell us what you love, what you're learning, and what you'd like to build.
              </p>

              {/* Progress Indicator */}
              <ProgressIndicator
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
              />
            </div>
          )}

          {/* Form Step Body */}
          <div className="onboarding-form-body">
            {isCompleted ? (
              <OnboardingCompletion
                profileData={formData}
                onFinish={() => navigate('/')}
              />
            ) : (
              <>
                {currentStep === 1 && (
                  <StepBasicInfo
                    data={formData}
                    errors={stepErrors}
                    onChange={handleBasicInfoChange}
                  />
                )}

                {currentStep === 2 && (
                  <StepInterests
                    selectedInterests={formData.interests}
                    error={stepErrors.interests}
                    onToggleInterest={handleToggleInterest}
                  />
                )}

                {currentStep === 3 && (
                  <StepNiches
                    selectedInterests={formData.interests}
                    selectedPaths={formData.selectedPaths || []}
                    error={stepErrors.niches}
                    onTogglePath={handleTogglePath}
                    onRemovePath={handleRemovePath}
                  />
                )}

                {currentStep === 4 && (
                  <StepSkillsExperience
                    data={formData}
                    urlErrors={urlErrors}
                    error={stepErrors.urls}
                    onChange={handleSkillsChange}
                    onAddProject={handleAddProject}
                    onUpdateProject={handleUpdateProject}
                    onRemoveProject={handleRemoveProject}
                  />
                )}

                {currentStep === 5 && (
                  <StepGoalsPreferences
                    selectedInterests={formData.interests}
                    selectedPaths={formData.selectedPaths || []}
                    selectedGoals={formData.goals}
                    selectedCollabs={formData.collabs}
                    availability={formData.availability}
                    goalsError={stepErrors.goals}
                    onToggleGoal={handleToggleGoal}
                    onToggleCollab={handleToggleCollab}
                    onSelectAvailability={handleSelectAvailability}
                  />
                )}

                {/* Navigation Footer Row */}
                <div className="onboarding-nav-footer">
                  <div className="nav-footer-left">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="btn-onboarding-back"
                        aria-label="Go back to previous step"
                      >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                      </button>
                    )}
                  </div>

                  <div className="nav-footer-right">
                    {/* Skip button for Step 4 (Skills & Experience) */}
                    {currentStep === 4 && (
                      <button
                        type="button"
                        onClick={handleSkip}
                        className="btn-onboarding-skip"
                      >
                        Skip for now
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary btn-onboarding-next"
                    >
                      <span>
                        {currentStep === TOTAL_STEPS ? 'Complete Profile' : 'Next Step'}
                      </span>
                      {currentStep === TOTAL_STEPS ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <ArrowRight size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Onboarding;
