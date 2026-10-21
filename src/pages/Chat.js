import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import ConversationSidebar from '../components/chat/ConversationSidebar';
import ChatHeader from '../components/chat/ChatHeader';
import MessageBubble from '../components/chat/MessageBubble';
import MessageInput from '../components/chat/MessageInput';
import BlockConfirmDialog from '../components/chat/BlockConfirmDialog';
import ReportDialog from '../components/chat/ReportDialog';
import ChatDetailsDrawer from '../components/chat/ChatDetailsDrawer';
import { 
  MessageSquare, 
  ShieldAlert, 
  Inbox
} from 'lucide-react';
import './Chat.css';

function Chat() {
  const {
    activeConversationId,
    activeConversation,
    sendMessage,
    getOrCreateDirectConversation,
    getOrCreateTeamConversation,
    blockUser,
    unblockUser,
    isUserBlocked,
    reportConversation,
    isOfflineSimulated,
  } = useChat();

  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [activeConversationId, activeConversation?.messages?.length]);

  // Handle URL query parameters: e.g. /messages?teamId=team-1 or /messages?studentId=student-2
  const processedParamRef = useRef('');
  useEffect(() => {
    const searchStr = window.location.search;
    if (searchStr && searchStr !== processedParamRef.current) {
      processedParamRef.current = searchStr;
      const params = new URLSearchParams(searchStr);
      const teamId = params.get('teamId');
      const studentId = params.get('studentId');

      if (teamId) {
        getOrCreateTeamConversation(teamId);
        setMobileShowChat(true);
      } else if (studentId) {
        getOrCreateDirectConversation(studentId);
        setMobileShowChat(true);
      }
    }
  }, [getOrCreateTeamConversation, getOrCreateDirectConversation]);

  const handleSendMessage = (text) => {
    if (!activeConversation) return;
    try {
      sendMessage(activeConversation.id, text);
      setTimeout(() => scrollToBottom('smooth'), 50);
    } catch (err) {
      alert(err.message || 'Could not send message.');
    }
  };

  const handleSelectConv = (convId) => {
    setMobileShowChat(true);
  };

  const isBlocked = activeConversation?.otherStudentId
    ? isUserBlocked(activeConversation.otherStudentId)
    : false;

  const handleBlockConfirm = () => {
    if (activeConversation?.otherStudentId) {
      blockUser(activeConversation.otherStudentId);
    }
  };

  const handleUnblock = () => {
    if (activeConversation?.otherStudentId) {
      unblockUser(activeConversation.otherStudentId);
    }
  };

  const handleSubmitReport = ({ reason, details }) => {
    reportConversation({
      targetId: activeConversation?.id,
      targetType: activeConversation?.type,
      reason,
      details,
    });
  };

  return (
    <div className="chat-page-root">
      <div className="chat-container container">
        <div className={`chat-layout-card ${mobileShowChat ? 'mobile-viewing-chat' : ''}`}>
          {/* 1. Left Sidebar: Conversation List */}
          <div className="chat-sidebar-wrapper">
            <ConversationSidebar onSelectConversation={handleSelectConv} />
          </div>

          {/* 2. Main Chat Panel */}
          <main className="chat-main-wrapper" aria-label="Active Conversation">
            {activeConversation ? (
              <div className="chat-active-flex">
                {/* Chat Top Header */}
                <ChatHeader
                  conversation={activeConversation}
                  onBackToList={() => setMobileShowChat(false)}
                  onOpenReport={() => setIsReportOpen(true)}
                  onOpenBlock={() => setIsBlockOpen(true)}
                  onToggleDetails={() => setIsDrawerOpen(!isDrawerOpen)}
                  isBlocked={isBlocked}
                  onUnblock={handleUnblock}
                />

                {/* Main Middle: Message History */}
                <div className="chat-history-scroll">
                  {/* Notice if Blocked */}
                  {isBlocked && (
                    <div className="chat-blocked-banner">
                      <ShieldAlert size={16} />
                      <span>
                        You have blocked this student. Messages from this user are hidden and you cannot send messages until unblocked.
                      </span>
                    </div>
                  )}

                  {/* Empty Messages State */}
                  {(!activeConversation.messages || activeConversation.messages.length === 0) ? (
                    <div className="chat-empty-messages">
                      <MessageSquare size={36} className="empty-msg-icon" />
                      <h4 className="empty-msg-title">No Messages Yet</h4>
                      <p className="empty-msg-text">
                        Be the first to say hi! Send a message below to start collaborating with {activeConversation.title}.
                      </p>
                    </div>
                  ) : (
                    /* Messages List */
                    <div className="messages-stream">
                      {activeConversation.messages.map((msg) => (
                        <MessageBubble
                          key={msg.id}
                          message={msg}
                          isGroupOrTeam={activeConversation.type !== 'direct'}
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Bottom Input Area */}
                <MessageInput
                  onSendMessage={handleSendMessage}
                  isBlocked={isBlocked}
                  isOffline={isOfflineSimulated}
                />
              </div>
            ) : (
              /* No Active Conversation Selected */
              <div className="chat-none-selected-state">
                <Inbox size={48} className="none-icon" />
                <h3 className="none-title">Select a Conversation</h3>
                <p className="none-desc">
                  Choose an existing direct conversation or project team discussion from the sidebar to view message history.
                </p>
              </div>
            )}

            {/* Expandable Details Drawer */}
            <ChatDetailsDrawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              conversation={activeConversation}
            />
          </main>
        </div>
      </div>

      {/* Block Confirm Dialog */}
      <BlockConfirmDialog
        isOpen={isBlockOpen}
        onClose={() => setIsBlockOpen(false)}
        onConfirm={handleBlockConfirm}
        studentName={activeConversation?.title || 'this student'}
      />

      {/* Report Dialog */}
      <ReportDialog
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmitReport={handleSubmitReport}
        title={activeConversation?.title || 'Conversation'}
      />
    </div>
  );
}

export default Chat;
