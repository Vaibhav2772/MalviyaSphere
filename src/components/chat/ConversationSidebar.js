import React, { useState, useMemo } from 'react';
import { useChat } from '../../context/ChatContext';
import { useRouter } from '../../context/RouterContext';
import ConversationItem from './ConversationItem';
import { 
  Search, 
  X, 
  MessageSquare, 
  Wifi, 
  WifiOff, 
  Inbox
} from 'lucide-react';
import './ConversationSidebar.css';

function ConversationSidebar({ onSelectConversation }) {
  const { 
    conversations, 
    activeConversationId, 
    selectConversation, 
    isOfflineSimulated, 
    toggleOfflineSimulation 
  } = useChat();
  const { navigate } = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'direct' | 'team'

  // Filter & sort conversations by latest activity
  const filteredConversations = useMemo(() => {
    let list = [...conversations];

    // Filter by tab
    if (activeTab === 'direct') {
      list = list.filter((c) => c.type === 'direct');
    } else if (activeTab === 'team') {
      list = list.filter((c) => c.type === 'team' || c.type === 'group');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => {
        const titleMatch = c.title.toLowerCase().includes(q);
        const lastMsgMatch = c.lastMessage?.text?.toLowerCase().includes(q);
        return titleMatch || lastMsgMatch;
      });
    }

    // Sort by latest update timestamp (descending)
    list.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

    return list;
  }, [conversations, activeTab, searchQuery]);

  const handleItemClick = (convId) => {
    selectConversation(convId);
    if (onSelectConversation) {
      onSelectConversation(convId);
    }
  };

  return (
    <aside className="chat-sidebar-root" aria-label="Messages Sidebar">
      {/* Sidebar Header */}
      <div className="chat-sidebar-header">
        <div className="sidebar-title-row">
          <div className="sidebar-title-wrap">
            <MessageSquare size={18} className="sidebar-header-icon" />
            <h2 className="sidebar-heading">Conversations</h2>
          </div>

          {/* Offline Mode Toggle for simulation test */}
          <button
            type="button"
            onClick={toggleOfflineSimulation}
            className={`btn-toggle-offline ${isOfflineSimulated ? 'offline' : 'online'}`}
            title={isOfflineSimulated ? 'Simulated Offline Mode Active (Click to go online)' : 'Online Mode (Click to simulate offline state)'}
            aria-label="Toggle offline simulation"
          >
            {isOfflineSimulated ? (
              <>
                <WifiOff size={13} />
                <span>Offline (Sim)</span>
              </>
            ) : (
              <>
                <Wifi size={13} />
                <span>Online</span>
              </>
            )}
          </button>
        </div>

        {/* Offline Banner if Active */}
        {isOfflineSimulated && (
          <div className="offline-banner-notice">
            <WifiOff size={14} />
            <span>Simulated Offline Mode: New messages cannot be sent.</span>
          </div>
        )}

        {/* Search Input */}
        <div className="sidebar-search-box">
          <Search size={15} className="sidebar-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="sidebar-search-input"
            aria-label="Search conversations"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="btn-clear-sidebar-search"
              aria-label="Clear conversation search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Tabs: All / Direct / Teams */}
        <div className="sidebar-tabs-nav" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
            className={`sidebar-tab ${activeTab === 'all' ? 'active' : ''}`}
          >
            All ({conversations.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'direct'}
            onClick={() => setActiveTab('direct')}
            className={`sidebar-tab ${activeTab === 'direct' ? 'active' : ''}`}
          >
            Direct
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'team'}
            onClick={() => setActiveTab('team')}
            className={`sidebar-tab ${activeTab === 'team' ? 'active' : ''}`}
          >
            Teams
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="sidebar-conversations-list">
        {filteredConversations.length === 0 ? (
          <div className="sidebar-empty-state">
            <Inbox size={32} className="empty-inbox-icon" />
            <h4 className="empty-sidebar-title">
              {searchQuery ? 'No Results Found' : 'No Conversations Yet'}
            </h4>
            <p className="empty-sidebar-desc">
              {searchQuery
                ? `No conversation matches "${searchQuery}".`
                : 'Connect with students on Explore or join project teams to start collaborating.'}
            </p>
            <div className="sidebar-empty-actions">
              <button
                type="button"
                onClick={() => navigate('/explore')}
                className="btn-sidebar-discover"
              >
                <span>Find Students</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/teams')}
                className="btn-sidebar-discover primary"
              >
                <span>Browse Teams</span>
              </button>
            </div>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onClick={() => handleItemClick(conv.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}

export default ConversationSidebar;
