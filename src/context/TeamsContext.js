import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { MOCK_TEAMS, MOCK_JOIN_REQUESTS, MOCK_INVITATIONS, computeRecruitmentStatus } from '../data/teamsData';
import { useAuth } from './AuthContext';
import { useStudents } from './StudentContext';

const TeamsContext = createContext(null);

export function TeamsProvider({ children }) {
  const { user } = useAuth();
  const { students, currentUserStudent } = useStudents();

  // 1. Teams state with localStorage persistence
  const [teams, setTeams] = useState(() => {
    try {
      const saved = localStorage.getItem('malviyasphere_teams');
      return saved ? JSON.parse(saved) : MOCK_TEAMS;
    } catch (e) {
      return MOCK_TEAMS;
    }
  });

  // 2. Join Requests state with persistence
  const [joinRequests, setJoinRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('malviyasphere_join_requests');
      return saved ? JSON.parse(saved) : MOCK_JOIN_REQUESTS;
    } catch (e) {
      return MOCK_JOIN_REQUESTS;
    }
  });

  // 3. Invitations state with persistence
  const [invitations, setInvitations] = useState(() => {
    try {
      const saved = localStorage.getItem('malviyasphere_invitations');
      return saved ? JSON.parse(saved) : MOCK_INVITATIONS;
    } catch (e) {
      return MOCK_INVITATIONS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('malviyasphere_teams', JSON.stringify(teams));
    } catch (e) {}
  }, [teams]);

  useEffect(() => {
    try {
      localStorage.setItem('malviyasphere_join_requests', JSON.stringify(joinRequests));
    } catch (e) {}
  }, [joinRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('malviyasphere_invitations', JSON.stringify(invitations));
    } catch (e) {}
  }, [invitations]);

  // Current user identifier
  const currentUserId = useMemo(() => {
    if (!user) return 'student-1'; // Default guest explorer preview identifier
    return currentUserStudent?.id || `user-${user.email}`;
  }, [user, currentUserStudent]);

  // Look up team by ID
  const getTeamById = useCallback((teamId) => {
    if (!teamId) return null;
    return teams.find((t) => t.id === teamId) || null;
  }, [teams]);

  // Check if current user is lead of team
  const isTeamLead = useCallback((team, userId = currentUserId) => {
    if (!team) return false;
    if (team.leadId === userId) return true;
    if (userId === 'me' && (team.leadId === 'me' || (user && team.leadId === `user-${user.email}`))) return true;
    return false;
  }, [currentUserId, user]);

  // Check if user is a member of team
  const isTeamMember = useCallback((team, userId = currentUserId) => {
    if (!team || !team.members) return false;
    return team.members.some((m) => m.studentId === userId || (userId === 'me' && m.studentId === 'me'));
  }, [currentUserId]);

  // Get user's pending request for a team
  const getUserJoinRequest = useCallback((teamId, userId = currentUserId) => {
    return joinRequests.find(
      (r) => r.teamId === teamId && (r.studentId === userId || (userId === 'me' && r.studentId === 'me')) && r.status === 'pending'
    );
  }, [joinRequests, currentUserId]);

  // Create Team
  const createTeam = useCallback((formData) => {
    const teamId = `team-${Date.now()}`;
    const leadId = currentUserId;

    const newTeam = {
      id: teamId,
      name: formData.name.trim(),
      logo: formData.logo || '🚀',
      objective: formData.objective.trim(),
      description: formData.description.trim(),
      category: formData.category || 'technology',
      categoryLabel: formData.categoryLabel || 'Technology',
      requiredSkills: Array.isArray(formData.requiredSkills) ? formData.requiredSkills : [],
      maxMembers: parseInt(formData.maxMembers, 10) || 4,
      leadId: leadId,
      members: [
        {
          studentId: leadId,
          role: 'Team Lead & Founder',
          joinedAt: new Date().toISOString().split('T')[0],
        },
      ],
      openRoles: Array.isArray(formData.openRoles) ? formData.openRoles : [],
      isExplicitlyClosed: formData.recruitmentStatus === 'closed',
      projectLink: formData.projectLink ? formData.projectLink.trim() : '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTeams((prev) => [newTeam, ...prev]);
    return newTeam;
  }, [currentUserId]);

  // Request to Join Team
  const requestToJoin = useCallback((teamId, message = '', roleTitle = '') => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) throw new Error('Team not found');

    const status = computeRecruitmentStatus(team);
    if (status === 'closed') {
      throw new Error('This team is not currently accepting join requests.');
    }

    if (isTeamMember(team, currentUserId)) {
      throw new Error('You are already a member of this team.');
    }

    const existingPending = joinRequests.find(
      (r) => r.teamId === teamId && r.studentId === currentUserId && r.status === 'pending'
    );
    if (existingPending) {
      throw new Error('You already have a pending join request for this team.');
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      teamId,
      studentId: currentUserId,
      message: message.trim() || 'I would love to collaborate with your team!',
      roleTitle: roleTitle || 'Collaborator',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setJoinRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  }, [teams, isTeamMember, currentUserId, joinRequests]);

  // Cancel Join Request
  const cancelJoinRequest = useCallback((requestId) => {
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
  }, []);

  // Respond to Join Request (Accept / Reject)
  const respondToJoinRequest = useCallback((requestId, action) => {
    const req = joinRequests.find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const team = teams.find((t) => t.id === req.teamId);
    if (!team) throw new Error('Team not found');

    if (action === 'accept') {
      const currentCount = team.members ? team.members.length : 0;
      if (currentCount >= team.maxMembers || team.isExplicitlyClosed) {
        throw new Error('Cannot accept request: team capacity is full or recruitment is closed.');
      }

      // Add to team members
      const updatedMembers = [
        ...team.members,
        {
          studentId: req.studentId,
          role: req.roleTitle || 'Team Member',
          joinedAt: new Date().toISOString().split('T')[0],
        },
      ];

      // Update team in state
      setTeams((prevTeams) =>
        prevTeams.map((t) => (t.id === team.id ? { ...t, members: updatedMembers } : t))
      );

      // Update request status
      setJoinRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'accepted' } : r))
      );
    } else {
      // Reject
      setJoinRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
      );
    }
  }, [joinRequests, teams]);

  // Invite student to team
  const inviteStudent = useCallback((teamId, studentId, roleTitle = 'Collaborator', message = '') => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) throw new Error('Team not found');

    const currentCount = team.members ? team.members.length : 0;
    if (currentCount >= team.maxMembers) {
      throw new Error('Team is at maximum capacity.');
    }

    if (isTeamMember(team, studentId)) {
      throw new Error('Student is already a member of this team.');
    }

    const existingPending = invitations.find(
      (i) => i.teamId === teamId && i.studentId === studentId && i.status === 'pending'
    );
    if (existingPending) {
      throw new Error('An invitation is already pending for this student.');
    }

    const newInvite = {
      id: `inv-${Date.now()}`,
      teamId,
      studentId,
      invitedBy: currentUserId,
      role: roleTitle,
      message: message.trim() || `You have been invited to join ${team.name}!`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setInvitations((prev) => [newInvite, ...prev]);
    return newInvite;
  }, [teams, isTeamMember, invitations, currentUserId]);

  // Respond to Invitation (Accept / Decline)
  const respondToInvitation = useCallback((invitationId, action) => {
    const inv = invitations.find((i) => i.id === invitationId);
    if (!inv) throw new Error('Invitation not found');

    const team = teams.find((t) => t.id === inv.teamId);
    if (!team) throw new Error('Team not found');

    if (action === 'accept') {
      const currentCount = team.members ? team.members.length : 0;
      if (currentCount >= team.maxMembers) {
        throw new Error('Team is already full.');
      }

      const updatedMembers = [
        ...team.members,
        {
          studentId: inv.studentId,
          role: inv.role || 'Team Member',
          joinedAt: new Date().toISOString().split('T')[0],
        },
      ];

      setTeams((prevTeams) =>
        prevTeams.map((t) => (t.id === team.id ? { ...t, members: updatedMembers } : t))
      );

      setInvitations((prev) =>
        prev.map((i) => (i.id === invitationId ? { ...i, status: 'accepted' } : i))
      );
    } else {
      setInvitations((prev) =>
        prev.map((i) => (i.id === invitationId ? { ...i, status: 'declined' } : i))
      );
    }
  }, [invitations, teams]);

  // Toggle recruitment status (Open / Closed)
  const toggleRecruitmentStatus = useCallback((teamId) => {
    setTeams((prevTeams) =>
      prevTeams.map((t) => {
        if (t.id === teamId) {
          return { ...t, isExplicitlyClosed: !t.isExplicitlyClosed };
        }
        return t;
      })
    );
  }, []);

  // Hydrate member objects with student details
  const getPopulatedMembers = useCallback((team) => {
    if (!team || !team.members) return [];
    return team.members.map((m) => {
      let student = students.find((s) => s.id === m.studentId);
      if (!student && (m.studentId === 'me' || (user && m.studentId === `user-${user.email}`))) {
        student = currentUserStudent;
      }
      return {
        ...m,
        student: student || {
          id: m.studentId,
          fullName: 'Campus Scholar',
          branch: 'MMMUT Student',
          academicYear: 'Undergraduate',
        },
      };
    });
  }, [students, user, currentUserStudent]);

  // Get lead student details
  const getTeamLead = useCallback((team) => {
    if (!team) return null;
    let lead = students.find((s) => s.id === team.leadId);
    if (!lead && (team.leadId === 'me' || (user && team.leadId === `user-${user.email}`))) {
      lead = currentUserStudent;
    }
    return lead || { id: team.leadId, fullName: 'Team Lead', branch: 'MMMUT' };
  }, [students, user, currentUserStudent]);

  return (
    <TeamsContext.Provider
      value={{
        teams,
        joinRequests,
        invitations,
        currentUserId,
        getTeamById,
        isTeamLead,
        isTeamMember,
        getUserJoinRequest,
        createTeam,
        requestToJoin,
        cancelJoinRequest,
        respondToJoinRequest,
        inviteStudent,
        respondToInvitation,
        toggleRecruitmentStatus,
        getPopulatedMembers,
        getTeamLead,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams() {
  const context = useContext(TeamsContext);
  if (!context) {
    throw new Error('useTeams must be used within a TeamsProvider');
  }
  return context;
}
