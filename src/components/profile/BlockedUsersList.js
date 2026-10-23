import React, { useState, useEffect } from 'react';
import './BlockedUsersList.css';

// Sample blocked users data - in a real app this would come from a server or context
const SAMPLE_BLOCKED_USERS = [
  { id: '1', username: 'john_doe', avatar: 'https://i.pravatar.cc/150?img=1', blockedDate: '2026-01-15' },
  { id: '2', username: 'jane_smith', avatar: 'https://i.pravatar.cc/150?img=2', blockedDate: '2026-03-20' },
];

function BlockedUsersList() {
  const [blockedUsers, setBlockedUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('malviyasphere_blocked');
      return saved ? JSON.parse(saved) : SAMPLE_BLOCKED_USERS;
    } catch (e) {
      return SAMPLE_BLOCKED_USERS;
    }
  });

  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('malviyasphere_blocked', JSON.stringify(blockedUsers));
    } catch (e) {}
  }, [blockedUsers]);

  const handleUnblock = (userId) => {
    setLoadingId(userId);
    setTimeout(() => {
      setBlockedUsers((prev) => prev.filter((u) => u.id !== userId));
      setLoadingId(null);
    }, 600);
  };

  return (
    <div className="blocked-users-container">
      <h2>Blocked Accounts</h2>
      <p className="subtitle">Blocked users can no longer message you, tag you, or view your profile.</p>
      {blockedUsers.length === 0 ? (
        <div className="empty-state"><p>You haven't blocked any users yet.</p></div>
      ) : (
        <ul className="blocked-list">
          {blockedUsers.map((user) => (
            <li key={user.id} className="blocked-item">
              <div className="user-info">
                <img src={user.avatar} alt={user.username} className="avatar" />
                <div>
                  <span className="username">@{user.username}</span>
                  <span className="blocked-date">Blocked on {user.blockedDate}</span>
                </div>
              </div>
              <button className="unblock-btn" onClick={() => handleUnblock(user.id)} disabled={loadingId === user.id}>
                {loadingId === user.id ? 'Unblocking...' : 'Unblock'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BlockedUsersList;
