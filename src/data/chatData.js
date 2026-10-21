// Mock Data Models for MalviyaSphere Chat & Messaging System
// Covers one-to-one student chats, dedicated project team discussions, and campus groups

export const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-team-1',
    type: 'team',
    teamId: 'team-1',
    title: 'RoboMalviya Autonomous Rover',
    avatar: '🤖',
    participants: ['student-1', 'student-6', 'student-2'],
    isOnline: true,
    lastMessage: {
      text: 'Gazebo simulation for dynamic obstacle avoidance is passing all 10 waypoint benchmark tests!',
      timestamp: '10:42 AM',
      senderId: 'student-1',
      senderName: 'Aarav Sharma',
    },
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    messages: [
      {
        id: 'm-1-1',
        senderId: 'student-1',
        senderName: 'Aarav Sharma',
        text: 'Hey team, we just received the LiDAR mounting bracket from the mechanical workshop.',
        timestamp: '10:15 AM',
        isMe: false,
      },
      {
        id: 'm-1-2',
        senderId: 'student-6',
        senderName: 'Rohan Joshi',
        text: 'Awesome! I have verified the 5V buck converter and CAN bus telemetry lines.',
        timestamp: '10:28 AM',
        isMe: false,
      },
      {
        id: 'm-1-3',
        senderId: 'student-2',
        senderName: 'Priya Patel',
        text: 'Stereo camera calibration is finished too. Ready for obstacle detection testing.',
        timestamp: '10:35 AM',
        isMe: false,
      },
      {
        id: 'm-1-4',
        senderId: 'student-1',
        senderName: 'Aarav Sharma',
        text: 'Gazebo simulation for dynamic obstacle avoidance is passing all 10 waypoint benchmark tests!',
        timestamp: '10:42 AM',
        isMe: false,
      },
    ],
  },
  {
    id: 'conv-student-1',
    type: 'direct',
    otherStudentId: 'student-1',
    title: 'Aarav Sharma',
    avatar: null,
    isOnline: true,
    lastMessage: {
      text: 'Let us connect on Saturday afternoon to sync on the hackathon submission architecture.',
      timestamp: 'Yesterday',
      senderId: 'student-1',
      senderName: 'Aarav Sharma',
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), // 20 hrs ago
    messages: [
      {
        id: 'm-2-1',
        senderId: 'student-1',
        senderName: 'Aarav Sharma',
        text: 'Hi there! Saw your profile on MalviyaSphere Explore.',
        timestamp: 'Yesterday, 3:10 PM',
        isMe: false,
      },
      {
        id: 'm-2-2',
        senderId: 'me',
        senderName: 'You',
        text: 'Hey Aarav! Loved your work on Campus Pulse and DevQuery.',
        timestamp: 'Yesterday, 3:18 PM',
        isMe: true,
      },
      {
        id: 'm-2-3',
        senderId: 'student-1',
        senderName: 'Aarav Sharma',
        text: 'Let us connect on Saturday afternoon to sync on the hackathon submission architecture.',
        timestamp: 'Yesterday, 3:22 PM',
        isMe: false,
      },
    ],
  },
  {
    id: 'conv-team-2',
    type: 'team',
    teamId: 'team-2',
    title: 'CampusPulse Student Portal',
    avatar: '📱',
    participants: ['student-2', 'student-1', 'student-5'],
    isOnline: true,
    lastMessage: {
      text: 'Push notifications for hostel mess menu updates are now working on mobile browsers.',
      timestamp: 'Yesterday',
      senderId: 'student-2',
      senderName: 'Priya Patel',
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    messages: [
      {
        id: 'm-3-1',
        senderId: 'student-5',
        senderName: 'Neha Chaurasia',
        text: 'Uploaded the high-res SVG navigation icons and banner tokens on Figma.',
        timestamp: 'Yesterday, 11:30 AM',
        isMe: false,
      },
      {
        id: 'm-3-2',
        senderId: 'student-2',
        senderName: 'Priya Patel',
        text: 'Push notifications for hostel mess menu updates are now working on mobile browsers.',
        timestamp: 'Yesterday, 1:15 PM',
        isMe: false,
      },
    ],
  },
  {
    id: 'conv-student-2',
    type: 'direct',
    otherStudentId: 'student-2',
    title: 'Priya Patel',
    avatar: null,
    isOnline: false,
    lastMessage: {
      text: 'I shared the PyTorch Colab notebook with crop disease weights in the drive.',
      timestamp: 'Oct 19',
      senderId: 'student-2',
      senderName: 'Priya Patel',
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    messages: [
      {
        id: 'm-4-1',
        senderId: 'student-2',
        senderName: 'Priya Patel',
        text: 'Hey! Are you working with PyTorch on the upcoming vision hackathon?',
        timestamp: 'Oct 19, 4:20 PM',
        isMe: false,
      },
      {
        id: 'm-4-2',
        senderId: 'me',
        senderName: 'You',
        text: 'Yes! Experimenting with ResNet transfer learning and augmented crop datasets.',
        timestamp: 'Oct 19, 4:45 PM',
        isMe: true,
      },
      {
        id: 'm-4-3',
        senderId: 'student-2',
        senderName: 'Priya Patel',
        text: 'I shared the PyTorch Colab notebook with crop disease weights in the drive.',
        timestamp: 'Oct 19, 5:02 PM',
        isMe: false,
      },
    ],
  },
  {
    id: 'conv-student-3',
    type: 'direct',
    otherStudentId: 'student-3',
    title: 'Riya Sen',
    avatar: null,
    isOnline: true,
    lastMessage: {
      text: 'Jam session at the Cultural Activity Center tomorrow at 5 PM! Bring your guitar.',
      timestamp: 'Oct 18',
      senderId: 'student-3',
      senderName: 'Riya Sen',
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    messages: [
      {
        id: 'm-5-1',
        senderId: 'student-3',
        senderName: 'Riya Sen',
        text: 'Jam session at the Cultural Activity Center tomorrow at 5 PM! Bring your guitar.',
        timestamp: 'Oct 18, 6:00 PM',
        isMe: false,
      },
    ],
  },
  {
    id: 'conv-group-1',
    type: 'group',
    title: 'MMMUT Hackathon 2025 Squad',
    avatar: '⚡',
    participants: ['student-1', 'student-2', 'student-5'],
    isOnline: true,
    lastMessage: {
      text: 'Abstract submission deadline is extended to next Monday.',
      timestamp: 'Oct 16',
      senderId: 'student-5',
      senderName: 'Neha Chaurasia',
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    messages: [
      {
        id: 'm-6-1',
        senderId: 'student-1',
        senderName: 'Aarav Sharma',
        text: 'Registration for internal round is officially live on the portal.',
        timestamp: 'Oct 16, 11:00 AM',
        isMe: false,
      },
      {
        id: 'm-6-2',
        senderId: 'student-5',
        senderName: 'Neha Chaurasia',
        text: 'Abstract submission deadline is extended to next Monday.',
        timestamp: 'Oct 16, 2:15 PM',
        isMe: false,
      },
    ],
  },
];

// Helper to format timestamps consistently
export function formatMessageTimestamp(date = new Date()) {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Just now';

  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
