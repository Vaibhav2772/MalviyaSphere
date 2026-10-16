import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Current authenticated mock user
  const [user, setUser] = useState(null);

  // College email verification status flow: 'not_verified' | 'pending' | 'verified' | 'failed'
  const [verificationStatus, setVerificationStatus] = useState('not_verified');

  // Simulated pending states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState(null);

  // Logout message state
  const [logoutMessage, setLogoutMessage] = useState(null);

  // Simulated Login
  const login = async ({ email, password, rememberMe }) => {
    // Artificial network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulated rejection condition for testing invalid credentials
    if (email.toLowerCase().includes('fail') || password === 'wrongpassword') {
      throw new Error('Invalid email or password. Please verify your credentials and try again.');
    }

    const mockUser = {
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Campus Scholar',
      email: email.trim().toLowerCase(),
      college: 'Madan Mohan Malaviya University of Technology, Gorakhpur',
      joinedAt: new Date().toLocaleDateString(),
    };

    setUser(mockUser);
    setLogoutMessage(null);

    if (rememberMe) {
      try {
        localStorage.setItem('malviyasphere_remembered_email', email.trim().toLowerCase());
      } catch (err) {
        // Ignore localStorage errors
      }
    } else {
      try {
        localStorage.removeItem('malviyasphere_remembered_email');
      } catch (err) {
        // Ignore localStorage errors
      }
    }

    return mockUser;
  };

  // Simulated Sign Up
  const signup = async ({ name, email, password, college }) => {
    // Artificial network delay
    await new Promise((resolve) => setTimeout(resolve, 900));

    // Simulated rejection condition
    if (email.toLowerCase().includes('exists')) {
      throw new Error('An account with this college email already exists. Please log in instead.');
    }

    const mockUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      college: college.trim(),
      joinedAt: new Date().toLocaleDateString(),
    };

    setUser(mockUser);
    setVerificationStatus('pending');
    setVerificationFeedback({
      type: 'info',
      message: `Verification email would be sent to ${email.trim().toLowerCase()}. (Frontend simulation)`,
    });
    setLogoutMessage(null);

    return mockUser;
  };

  // Simulated Logout
  const logout = async () => {
    // Short processing delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 400));
    setUser(null);
    setVerificationStatus('not_verified');
    setVerificationFeedback(null);
    setLogoutMessage('You have been logged out successfully.');
  };

  // Simulated Resend Verification Email
  const resendVerificationEmail = async (targetEmail) => {
    if (isVerifying) return;

    setIsVerifying(true);
    setVerificationFeedback({
      type: 'pending',
      message: 'Simulating verification email delivery...',
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsVerifying(false);
    setVerificationStatus('pending');
    setVerificationFeedback({
      type: 'success',
      message: `A simulated verification link has been resent to ${targetEmail || user?.email || 'your college email'}.`,
    });
  };

  // Helper to test / cycle verification status in the UI preview
  const setSimulatedStatus = (status) => {
    setVerificationStatus(status);
    if (status === 'verified') {
      setVerificationFeedback({
        type: 'success',
        message: 'Your college email is marked as verified for this preview session.',
      });
    } else if (status === 'failed') {
      setVerificationFeedback({
        type: 'error',
        message: 'Verification simulation failed. You can attempt to resend below.',
      });
    } else if (status === 'pending') {
      setVerificationFeedback({
        type: 'info',
        message: 'Verification email is currently pending delivery simulation.',
      });
    } else {
      setVerificationFeedback(null);
    }
  };

  const getRememberedEmail = () => {
    try {
      return localStorage.getItem('malviyasphere_remembered_email') || '';
    } catch (e) {
      return '';
    }
  };

  const clearLogoutMessage = () => {
    setLogoutMessage(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        verificationStatus,
        verificationFeedback,
        isVerifying,
        logoutMessage,
        clearLogoutMessage,
        login,
        signup,
        logout,
        resendVerificationEmail,
        setSimulatedStatus,
        getRememberedEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
