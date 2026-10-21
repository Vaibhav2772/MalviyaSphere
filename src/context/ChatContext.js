import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { INITIAL_CONVERSATIONS, formatMessageTimestamp } from '../data/chatData';
import { useAuth } from './AuthContext';
import { useStudents } from './StudentContext';
import { useTeams } from './TeamsContext';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const { students, currentUserStudent } = useStudents();
  const { teams } = useTeams();

  // 1. Conversations state with localStorage persistence
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem('malviyasphere_conversations');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch (e) {
      return INITIAL_CONVERSATIONS;
    }
  });

  // 2. Active conversation ID
  const [activeConversationId, setActiveConversationId] = useState(() => {
    try {
      const saved = localStorage.getItem('malviyasphere_active_conv');
      return saved || 'conv-team-1';
    } catch (e) {
      return 'conv-team-1';
    }
  });

  // 3. Blocked users set
  const [blockedUsers, setBlockedUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('malviyasphere_blocked_users');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 4. Reports state
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem('malviyasphere_reports');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 5. Simulated offline mode toggle
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('malviyasphere_conversations', JSON.stringify(conversations));
    } catch (e) {}
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem('malviyasphere_active_conv', activeConversationId);
    } catch (e) {}
  }, [activeConversationId]);

  useEffect(() => {
    try {
      localStorage.setItem('malviyasphere_blocked_users', JSON.stringify(blockedUsers));
    } catch (e) {}
  }, [blockedUsers]);

  useEffect(() => {
    try {
      localStorage.setItem('malviyasphere_reports', JSON.stringify(reports));
    } catch (e) {}
  }, [reports]);

  // Current user info
  const currentUserName = useMemo(() => {
    if (user?.name) return user.name;
    if (currentUserStudent?.fullName) return currentUserStudent.fullName;
    return 'You';
  }, [user, currentUserStudent]);

  // Active conversation object
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  // Keep a ref of conversations to allow stable callback functions
  const conversationsRef = useRef(conversations);
  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // Select a conversation and mark as read
  const selectConversation = useCallback((convId) => {
    setActiveConversationId(convId);
    setConversations((prev) => {
      const target = prev.find((c) => c.id === convId);
      if (!target || !target.unreadCount) {
        return prev;
      }
      return prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c));
    });
  }, []);

  // Send a message to active or specified conversation
  const sendMessage = useCallback((convId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    if (isOfflineSimulated) {
      throw new Error('Cannot send message: Simulated Offline Mode is active.');
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: currentUserName,
      text: trimmed,
      timestamp: formatMessageTimestamp(new Date()),
      isMe: true,
    };

    setConversations((prev) => {
      const targetIndex = prev.findIndex((c) => c.id === convId);
      if (targetIndex < 0) return prev;

      const targetConv = prev[targetIndex];
      const updatedConv = {
        ...targetConv,
        messages: [...(targetConv.messages || []), newMsg],
        lastMessage: {
          text: trimmed,
          timestamp: 'Just now',
          senderId: 'me',
          senderName: currentUserName,
        },
        updatedAt: new Date().toISOString(),
      };

      // Move updated conversation to top of list
      const rest = prev.filter((c) => c.id !== convId);
      return [updatedConv, ...rest];
    });

    return newMsg;
  }, [isOfflineSimulated, currentUserName]);

  // Get or Create Direct Conversation
  const getOrCreateDirectConversation = useCallback((studentId) => {
    if (!studentId) return null;

    const currentList = conversationsRef.current;
    // Check if conversation already exists
    const existing = currentList.find(
      (c) => c.type === 'direct' && c.otherStudentId === studentId
    );

    if (existing) {
      selectConversation(existing.id);
      return existing.id;
    }

    // Lookup student
    const student = students.find((s) => s.id === studentId) || {
      fullName: 'Campus Student',
      branch: 'MMMUT',
    };

    const newConvId = `conv-${studentId}`;
    const newConv = {
      id: newConvId,
      type: 'direct',
      otherStudentId: studentId,
      title: student.fullName,
      avatar: student.avatar || null,
      isOnline: true,
      lastMessage: {
        text: `Started a new conversation with ${student.fullName}.`,
        timestamp: 'Just now',
        senderId: 'system',
        senderName: 'System',
      },
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    setConversations((prev) => {
      if (prev.some((c) => c.id === newConvId)) return prev;
      return [newConv, ...prev];
    });
    setActiveConversationId(newConvId);
    return newConvId;
  }, [students, selectConversation]);

  // Get or Create Team Conversation
  const getOrCreateTeamConversation = useCallback((teamId) => {
    if (!teamId) return null;

    const currentList = conversationsRef.current;
    // Check if conversation already exists
    const existing = currentList.find(
      (c) => c.type === 'team' && c.teamId === teamId
    );

    if (existing) {
      selectConversation(existing.id);
      return existing.id;
    }

    // Lookup team
    const team = teams.find((t) => t.id === teamId) || {
      name: 'Project Team Discussion',
      logo: '🚀',
      members: [],
    };

    const newConvId = `conv-${teamId}`;
    const newConv = {
      id: newConvId,
      type: 'team',
      teamId: teamId,
      title: team.name,
      avatar: team.logo || '🚀',
      participants: (team.members || []).map((m) => m.studentId),
      isOnline: true,
      lastMessage: {
        text: `Dedicated team discussion initialized for ${team.name}.`,
        timestamp: 'Just now',
        senderId: 'system',
        senderName: 'System',
      },
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: 'system',
          senderName: 'MalviyaSphere',
          text: `Welcome to the dedicated discussion space for "${team.name}". Team members can coordinate here.`,
          timestamp: formatMessageTimestamp(new Date()),
          isMe: false,
        },
      ],
    };

    setConversations((prev) => {
      if (prev.some((c) => c.id === newConvId)) return prev;
      return [newConv, ...prev];
    });
    setActiveConversationId(newConvId);
    return newConvId;
  }, [teams, selectConversation]);

  // Block User
  const blockUser = useCallback((studentId) => {
    if (!studentId) return;
    setBlockedUsers((prev) => (prev.includes(studentId) ? prev : [...prev, studentId]));
  }, []);

  // Unblock User
  const unblockUser = useCallback((studentId) => {
    if (!studentId) return;
    setBlockedUsers((prev) => prev.filter((id) => id !== studentId));
  }, []);

  // Check if User Blocked
  const isUserBlocked = useCallback((studentId) => {
    if (!studentId) return false;
    return blockedUsers.includes(studentId);
  }, [blockedUsers]);

  // Report User or Conversation
  const reportConversation = useCallback(({ targetId, targetType, reason, details }) => {
    const newReport = {
      id: `report-${Date.now()}`,
      targetId,
      targetType, // 'student' | 'conversation' | 'team'
      reason,
      details: details ? details.trim() : '',
      submittedAt: new Date().toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);
    return newReport;
  }, []);

  // Toggle Simulated Offline
  const toggleOfflineSimulation = useCallback(() => {
    setIsOfflineSimulated((prev) => !prev);
  }, []);

  // Total unread messages count
  const unreadMessagesCount = useMemo(() => {
    return (conversations || []).reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [conversations]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        activeConversation,
        unreadMessagesCount,
        blockedUsers,
        reports,
        isOfflineSimulated,
        selectConversation,
        sendMessage,
        getOrCreateDirectConversation,
        getOrCreateTeamConversation,
        blockUser,
        unblockUser,
        isUserBlocked,
        reportConversation,
        toggleOfflineSimulation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
