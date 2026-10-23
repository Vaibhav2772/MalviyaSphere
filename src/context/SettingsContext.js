import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  privacy: {
    profileVisibility: 'public', // 'public' | 'connections' | 'private'
    connectionRequests: 'everyone', // 'everyone' | 'mutual' | 'none'
    whoCanMessage: 'everyone', // 'everyone' | 'connections' | 'team_only'
    searchVisibility: true,
    showEmailOnProfile: false,
    showActivityStatus: true,
  },
  messages: {
    directMessages: true,
    groupMessages: 'all', // 'all' | 'mentions' | 'muted'
    allowTeamInvites: true,
  },
  account: {
    interfaceTheme: 'dark', // 'dark' | 'contrast'
    density: 'comfortable', // 'comfortable' | 'compact'
    language: 'English (Campus Standard)',
  },
};

export function SettingsProvider({ children }) {
  // Load persisted settings or fallback to DEFAULT_SETTINGS
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('malviyasphere_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          privacy: { ...DEFAULT_SETTINGS.privacy, ...(parsed.privacy || {}) },
          messages: { ...DEFAULT_SETTINGS.messages, ...(parsed.messages || {}) },
          account: { ...DEFAULT_SETTINGS.account, ...(parsed.account || {}) },
        };
      }
      return DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  // Persist settings changes
  useEffect(() => {
    try {
      localStorage.setItem('malviyasphere_settings', JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  // Update privacy setting
  const updatePrivacySetting = useCallback((key, value) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));
  }, []);

  // Update message preferences (excluding notification settings)
  const updateMessageSetting = useCallback((key, value) => {
    setSettings((prev) => ({
      ...prev,
      messages: {
        ...prev.messages,
        [key]: value,
      },
    }));
  }, []);

  // Update account preference
  const updateAccountSetting = useCallback((key, value) => {
    setSettings((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        [key]: value,
      },
    }));
  }, []);

  // Reset settings to default
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem('malviyasphere_settings', JSON.stringify(DEFAULT_SETTINGS));
    } catch (e) {}
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        privacy: settings.privacy,
        messages: settings.messages,
        account: settings.account,
        updatePrivacySetting,
        updateMessageSetting,
        updateAccountSetting,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
