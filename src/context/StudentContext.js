import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { MOCK_STUDENTS } from '../data/studentsData';
import { useAuth } from './AuthContext';

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const { user, completeOnboarding } = useAuth();

  // Load custom student edits from localStorage or fallback to default MOCK_STUDENTS
  const [customStudents, setCustomStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('malviyasphere_mock_students');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Persisted Connection states: { [studentId]: 'connect' | 'pending' | 'connected' }
  const [connectionStates, setConnectionStates] = useState(() => {
    try {
      const saved = localStorage.getItem('malviyasphere_connections');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Persisted Follow states: { [studentId]: boolean }
  const [followStates, setFollowStates] = useState(() => {
    try {
      const saved = localStorage.getItem('malviyasphere_following');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Sync connections to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('malviyasphere_connections', JSON.stringify(connectionStates));
    } catch (e) {}
  }, [connectionStates]);

  // Sync followings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('malviyasphere_following', JSON.stringify(followStates));
    } catch (e) {}
  }, [followStates]);


  // Convert currently logged-in user to a student profile if they exist
  const loggedInStudentProfile = useMemo(() => {
    if (!user) return null;
    const profile = user.onboardingProfile || {};
    return {
      id: 'me',
      isCurrentUser: true,
      fullName: user.name || profile.fullName || 'Campus Scholar',
      email: user.email || 'student@mmmut.ac.in',
      branch: profile.branch || 'Computer Science and Engineering',
      programme: profile.programme || 'Undergraduate',
      academicYear: profile.academicYear || 'Third Year',
      avatar: profile.avatar || null,
      bio: profile.experienceSummary || 'Passionate student exploring interests and collaborating on campus projects at MMMUT.',
      interests: profile.interests || ['technology'],
      selectedPaths: profile.selectedPaths || [],
      niches: profile.niches || (profile.selectedPaths ? profile.selectedPaths.map(p => p.leafLabel) : ['React.js']),
      skillLevel: profile.skillLevel || 'learner',
      experienceCategory: profile.experienceCategory || 'Some experience',
      experienceSummary: profile.experienceSummary || '',
      projects: profile.projects || [],
      achievements: profile.achievements || '',
      verifiedAchievements: profile.verifiedAchievements || [],
      portfolioUrl: profile.portfolioUrl || '',
      githubUrl: profile.githubUrl || '',
      linkedinUrl: profile.linkedinUrl || '',
      goals: profile.goals || ['goal-tech-hackathons'],
      collabs: profile.collabs || ['project-teams'],
      availability: profile.availability || 'flexible',
    };
  }, [user]);

  // Combined list of students (default + user if onboarded)
  const students = useMemo(() => {
    const baseList = customStudents || MOCK_STUDENTS;
    if (loggedInStudentProfile && user?.hasCompletedOnboarding) {
      // Check if logged in user is already present in customStudents
      const existsIndex = baseList.findIndex((s) => s.id === 'me' || s.isCurrentUser);
      if (existsIndex >= 0) {
        return baseList;
      }
      return [loggedInStudentProfile, ...baseList];
    }
    return baseList;
  }, [customStudents, loggedInStudentProfile, user?.hasCompletedOnboarding]);

  // Toggle connection request
  const toggleConnect = useCallback((studentId) => {
    setConnectionStates((prev) => {
      const current = prev[studentId] || 'connect';
      let nextState;
      if (current === 'connect') {
        nextState = 'pending';
      } else if (current === 'pending') {
        nextState = 'connected';
      } else {
        nextState = 'connect';
      }
      return { ...prev, [studentId]: nextState };
    });
  }, []);

  // Toggle follow status
  const toggleFollow = useCallback((studentId) => {
    setFollowStates((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  }, []);

  // Update a student profile
  const updateStudentProfile = useCallback((studentId, updatedFields) => {
    // If it's the current user or 'me', update auth onboarding profile as well
    if (studentId === 'me' || (user && studentId === `user-${user.email}`)) {
      if (completeOnboarding) {
        completeOnboarding(updatedFields);
      }
    }

    setCustomStudents((prev) => {
      const currentList = prev || MOCK_STUDENTS;
      const index = currentList.findIndex((s) => s.id === studentId || (studentId === 'me' && s.isCurrentUser));
      let newList;
      if (index >= 0) {
        newList = [...currentList];
        newList[index] = { ...newList[index], ...updatedFields };
      } else if (studentId === 'me' && loggedInStudentProfile) {
        newList = [{ ...loggedInStudentProfile, ...updatedFields }, ...currentList];
      } else {
        newList = currentList;
      }

      try {
        localStorage.setItem('malviyasphere_mock_students', JSON.stringify(newList));
      } catch (e) {}

      return newList;
    });
  }, [completeOnboarding, user, loggedInStudentProfile]);

  // Look up student by id
  const getStudentById = useCallback((id) => {
    if (!id) return null;
    if (id === 'me') {
      return loggedInStudentProfile;
    }
    const found = students.find((s) => s.id === id);
    if (found) return found;

    // Check if matching current user's email or identifier
    if (user && (id === `user-${user.email}` || (user.id && id === user.id))) {
      return loggedInStudentProfile;
    }

    return null;
  }, [students, loggedInStudentProfile, user]);

  return (
    <StudentContext.Provider
      value={{
        students,
        connectionStates,
        followStates,
        toggleConnect,
        toggleFollow,
        updateStudentProfile,
        getStudentById,
        currentUserStudent: loggedInStudentProfile,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
}
