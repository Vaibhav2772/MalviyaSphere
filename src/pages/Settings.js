import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';
import { useRouter } from '../context/RouterContext';
import EditProfileModal from '../components/profile/EditProfileModal';
import BlockedUsersList from '../components/profile/BlockedUsersList';
import './Settings.css';
import { RotateCcw, User, Shield, MessageSquare, Ban, Settings as SettingsIcon, LogOut, ExternalLink } from 'lucide-react';

function Settings() {
  const {
    settings,
    privacy,
    messages,
    account,
    updatePrivacySetting,
    updateMessageSetting,
    updateAccountSetting,
    resetSettings,
  } = useSettings();

  const { user } = useAuth();
  const { currentUserStudent, updateStudentProfile } = useStudents();
  const { navigate } = useRouter();

  const [showEditModal, setShowEditModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const currentStudentData = currentUserStudent || {
    id: 'me',
    fullName: user?.name || 'Campus Student',
    email: user?.email || '',
    branch: 'Computer Science and Engineering',
    academicYear: 'Third Year',
    skillLevel: 'learner',
    interests: ['technology'],
    projects: [],
  };

  const handlePrivacyChange = (key, value) => {
    updatePrivacySetting(key, value);
  };

  const handleMessageChange = (key, value) => {
    updateMessageSetting(key, value);
  };

  const handleAccountChange = (key, value) => {
    updateAccountSetting(key, value);
  };

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to log out of MalviyaSphere?')) {
      navigate('/logout');
    }
  };

  const handleSaveProfile = (updatedData) => {
    if (updateStudentProfile) {
      updateStudentProfile('me', updatedData);
    }
    updateAccountSetting('profile', updatedData);
    setShowEditModal(false);
    setSaveSuccessMsg('Profile information updated successfully.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  return (
    <div className="settings-page-wrapper">
      <div className="settings-page container">
        <header className="settings-header">
          <div className="settings-title-row">
            <SettingsIcon size={24} className="settings-title-icon" />
            <h1 className="settings-main-heading">Settings</h1>
          </div>
          <p className="settings-subtitle">
            Manage your profile details, privacy controls, message preferences, and account configurations.
          </p>
        </header>

        {saveSuccessMsg && (
          <div className="settings-success-banner" role="status">
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* 1. Edit Profile & Onboarding Information */}
        <section className="settings-section edit-profile-section" aria-labelledby="section-profile-heading">
          <div className="settings-section-header">
            <User size={18} className="section-header-icon" />
            <h2 id="section-profile-heading">Profile &amp; Onboarding</h2>
          </div>
          <p className="section-description">
            Update your public profile, bio, interests, academic branch, skills, and portfolio links.
          </p>
          <div className="profile-settings-row">
            <div className="profile-settings-info">
              <span className="profile-user-name">{user?.name || currentStudentData.fullName}</span>
              <span className="profile-user-email">{user?.email || 'Logged in user'}</span>
              <span className="profile-onboarding-status">
                {user?.hasCompletedOnboarding ? 'Onboarding completed' : 'Onboarding setup pending'}
              </span>
            </div>
            <div className="profile-settings-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowEditModal(true)}
              >
                Edit Profile
              </button>
              {!user?.hasCompletedOnboarding ? (
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => navigate('/onboarding')}
                >
                  Complete Onboarding
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => navigate('/profile/me')}
                >
                  <ExternalLink size={14} />
                  <span>View Public Profile</span>
                </button>
              )}
            </div>
          </div>

          {showEditModal && (
            <EditProfileModal
              student={settings.profile || currentStudentData}
              onSave={handleSaveProfile}
              onClose={() => setShowEditModal(false)}
            />
          )}
        </section>

        {/* 2. Privacy Settings */}
        <section className="settings-section privacy-section" aria-labelledby="section-privacy-heading">
          <div className="settings-section-header">
            <Shield size={18} className="section-header-icon" />
            <h2 id="section-privacy-heading">Privacy Preferences</h2>
          </div>
          <p className="section-description">
            Control who can see your activity, send connection requests, and message your account.
          </p>
          <div className="setting-item">
            <label htmlFor="setting-profile-visibility">Profile Visibility</label>
            <select
              id="setting-profile-visibility"
              value={privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
            >
              <option value="public">Public (All MMMUT Students)</option>
              <option value="connections">Connections Only</option>
              <option value="private">Private (Only You)</option>
            </select>
          </div>
          <div className="setting-item">
            <label htmlFor="setting-connection-requests">Connection Requests</label>
            <select
              id="setting-connection-requests"
              value={privacy.connectionRequests}
              onChange={(e) => handlePrivacyChange('connectionRequests', e.target.value)}
            >
              <option value="everyone">Everyone</option>
              <option value="mutual">Mutual Connections</option>
              <option value="none">No One</option>
            </select>
          </div>
          <div className="setting-item">
            <label htmlFor="setting-who-can-message">Who Can Message You</label>
            <select
              id="setting-who-can-message"
              value={privacy.whoCanMessage}
              onChange={(e) => handlePrivacyChange('whoCanMessage', e.target.value)}
            >
              <option value="everyone">Everyone</option>
              <option value="connections">Connections Only</option>
              <option value="team_only">Team Members Only</option>
            </select>
          </div>
        </section>

        {/* 3. Message Preferences (Notification Settings Excluded) */}
        <section className="settings-section message-prefs-section" aria-labelledby="section-messages-heading">
          <div className="settings-section-header">
            <MessageSquare size={18} className="section-header-icon" />
            <h2 id="section-messages-heading">Message Preferences</h2>
          </div>
          <p className="section-description">
            Customize peer direct messaging options and group conversation delivery rules.
          </p>
          <div className="setting-item checkbox-item">
            <label htmlFor="setting-direct-messages">
              <span className="setting-label-title">Allow Direct Messages</span>
              <span className="setting-label-desc">Permit students and collaborators to initiate 1-on-1 chats with you.</span>
            </label>
            <input
              id="setting-direct-messages"
              type="checkbox"
              checked={messages.directMessages}
              onChange={(e) => handleMessageChange('directMessages', e.target.checked)}
            />
          </div>
          <div className="setting-item">
            <label htmlFor="setting-group-messages">Group &amp; Team Messages Delivery</label>
            <select
              id="setting-group-messages"
              value={messages.groupMessages}
              onChange={(e) => handleMessageChange('groupMessages', e.target.value)}
            >
              <option value="all">All Group Messages</option>
              <option value="mentions">Mentions Only (@you)</option>
              <option value="muted">Muted</option>
            </select>
          </div>
          <div className="setting-item checkbox-item">
            <label htmlFor="setting-team-invites">
              <span className="setting-label-title">Allow Team Invitations</span>
              <span className="setting-label-desc">Allow team leads to invite you to join project and hackathon teams.</span>
            </label>
            <input
              id="setting-team-invites"
              type="checkbox"
              checked={messages.allowTeamInvites ?? true}
              onChange={(e) => handleMessageChange('allowTeamInvites', e.target.checked)}
            />
          </div>
        </section>

        {/* 4. Blocked Users and Unblock Actions */}
        <section className="settings-section blocked-users-section" aria-labelledby="section-blocked-heading">
          <div className="settings-section-header">
            <Ban size={18} className="section-header-icon" />
            <h2 id="section-blocked-heading">Blocked Users</h2>
          </div>
          <BlockedUsersList />
        </section>

        {/* 5. Account Settings and Logout */}
        <section className="settings-section account-section" aria-labelledby="section-account-heading">
          <div className="settings-section-header">
            <SettingsIcon size={18} className="section-header-icon" />
            <h2 id="section-account-heading">Account Settings</h2>
          </div>
          <p className="section-description">
            Customize display preferences, accessibility mode, and session management.
          </p>
          <div className="setting-item">
            <label htmlFor="setting-interface-theme">Interface Theme</label>
            <select
              id="setting-interface-theme"
              value={account.interfaceTheme}
              onChange={(e) => handleAccountChange('interfaceTheme', e.target.value)}
            >
              <option value="dark">Standard Theme</option>
              <option value="contrast">High Contrast Mode</option>
            </select>
          </div>
          <div className="setting-item">
            <label htmlFor="setting-density">Density</label>
            <select
              id="setting-density"
              value={account.density}
              onChange={(e) => handleAccountChange('density', e.target.value)}
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>
          <div className="setting-item">
            <label htmlFor="setting-language">Language</label>
            <select
              id="setting-language"
              value={account.language}
              onChange={(e) => handleAccountChange('language', e.target.value)}
            >
              <option value="English (Campus Standard)">English (Campus Standard)</option>
              <option value="Spanish (Español)">Spanish (Español)</option>
            </select>
          </div>
          <div className="account-logout-row">
            <button
              type="button"
              className="btn-danger"
              onClick={handleLogoutClick}
            >
              <LogOut size={15} />
              <span>Log Out of MalviyaSphere</span>
            </button>
          </div>
        </section>

        {/* 6. Reset Settings */}
        <section className="settings-section reset-section">
          <button type="button" className="btn-secondary" onClick={resetSettings}>
            <RotateCcw size={14} />
            <span>Reset All Settings to Defaults</span>
          </button>
        </section>
      </div>
    </div>
  );
}

export default Settings;
