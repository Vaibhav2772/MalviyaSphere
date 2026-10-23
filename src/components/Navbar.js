import React from 'react';
import './Navbar.css';
import logo from '../assets/logo.png';
import {
  Home,
  Compass,
  Users,
  MessageSquare,
  LogOut,
  ArrowRight,
  LogIn,
  UserPlus,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useChat } from '../context/ChatContext';

function getInitials(name = '') {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const { currentPath, navigate } = useRouter();
  const chatContext = useChat();
  const unreadMessagesCount = chatContext?.unreadMessagesCount || 0;

  const handleBrandClick = (e) => {
    e.preventDefault();
    if (currentPath === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleNavigate = (path) => (e) => {
    e.preventDefault();
    navigate(path);
  };

  // Determine active destination states
  const isHomeActive = currentPath === '/';
  const isExploreActive = currentPath.startsWith('/explore');
  const isTeamsActive = currentPath.startsWith('/teams');
  const isMessagesActive = currentPath.startsWith('/messages');
  const isSettingsActive = currentPath === '/settings';
  const isProfileActive =
    currentPath.startsWith('/profile/me') ||
    currentPath === '/onboarding' ||
    (user && (currentPath === `/profile/user-${user.email}` || (user.id && currentPath === `/profile/${user.id}`)));

  const profilePath = user?.hasCompletedOnboarding ? '/profile/me' : '/onboarding';

  return (
    <>
      {/* Top Navbar Header */}
      <header className="navbar-header">
        <nav className="navbar-container container" aria-label="Main Navigation">
          {/* Brand Logo & Name */}
          <a
            href="/"
            className="navbar-brand"
            onClick={handleBrandClick}
            aria-label="MalviyaSphere Home"
          >
            <img src={logo} alt="MalviyaSphere Logo" className="brand-logo-img" />
            <span className="brand-name">
              Malviya<span className="brand-name-accent">Sphere</span>
            </span>
          </a>

          {/* Desktop Navigation Links — 5 Primary Destinations */}
          <ul className="navbar-links" role="menubar">
            {/* 1. Home */}
            <li role="none">
              <a
                href="/"
                className={`nav-link ${isHomeActive ? 'is-active' : ''}`}
                aria-current={isHomeActive ? 'page' : undefined}
                onClick={handleNavigate('/')}
                role="menuitem"
              >
                <Home size={16} className="nav-item-icon" />
                <span>Home</span>
              </a>
            </li>

            {/* 2. Explore */}
            <li role="none">
              <a
                href="/explore"
                className={`nav-link ${isExploreActive ? 'is-active' : ''}`}
                aria-current={isExploreActive ? 'page' : undefined}
                onClick={handleNavigate('/explore')}
                role="menuitem"
              >
                <Compass size={16} className="nav-item-icon" />
                <span>Explore</span>
              </a>
            </li>

            {/* 3. Teams */}
            <li role="none">
              <a
                href="/teams"
                className={`nav-link ${isTeamsActive ? 'is-active' : ''}`}
                aria-current={isTeamsActive ? 'page' : undefined}
                onClick={handleNavigate('/teams')}
                role="menuitem"
              >
                <Users size={16} className="nav-item-icon" />
                <span>Teams</span>
              </a>
            </li>

            {/* 4. Messages (Authenticated only) */}
            {isAuthenticated && (
              <li role="none">
                <a
                  href="/messages"
                  className={`nav-link ${isMessagesActive ? 'is-active' : ''}`}
                  aria-current={isMessagesActive ? 'page' : undefined}
                  onClick={handleNavigate('/messages')}
                  role="menuitem"
                >
                  <span className="nav-icon-wrap">
                    <MessageSquare size={16} className="nav-item-icon" />
                    {unreadMessagesCount > 0 && (
                      <span className="nav-unread-dot" aria-label={`${unreadMessagesCount} unread messages`} />
                    )}
                  </span>
                  <span>Messages</span>
                </a>
              </li>
            )}

            {/* 5. Profile (Authenticated only) */}
            {isAuthenticated && (
              <li role="none">
                <a
                  href={profilePath}
                  className={`nav-link nav-link-profile ${isProfileActive ? 'is-active' : ''}`}
                  aria-current={isProfileActive ? 'page' : undefined}
                  onClick={handleNavigate(profilePath)}
                  role="menuitem"
                  title={user?.name ? `${user.name}'s Profile` : 'Your Profile'}
                >
                  <span className="nav-profile-chip-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="nav-avatar-img" />
                    ) : (
                      <span className="nav-avatar-text">{getInitials(user?.name)}</span>
                    )}
                  </span>
                  <span>Profile</span>
                </a>
              </li>
            )}
          </ul>

          {/* Desktop Actions Area */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <div className="navbar-auth-logged-in">
                {!user?.hasCompletedOnboarding && (
                  <button
                    type="button"
                    className="btn-navbar-onboarding"
                    onClick={handleNavigate('/onboarding')}
                    aria-label="Complete Profile Onboarding"
                  >
                    <span>Complete Setup</span>
                    <ArrowRight size={14} />
                  </button>
                )}
                <button
                  type="button"
                  className={`btn-navbar-settings ${isSettingsActive ? 'is-active' : ''}`}
                  onClick={handleNavigate('/settings')}
                  aria-label="Settings"
                  title="Settings"
                >
                  <SettingsIcon size={15} />
                  <span>Settings</span>
                </button>
                <button
                  type="button"
                  className="btn-navbar-logout"
                  onClick={handleNavigate('/logout')}
                  aria-label="Log Out"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="navbar-auth-guest">
                <button
                  type="button"
                  className="btn-login"
                  onClick={handleNavigate('/login')}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="btn-signup"
                  onClick={handleNavigate('/signup')}
                >
                  <span>Sign Up</span>
                  <ArrowRight size={16} className="btn-arrow-icon" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Top Header Actions */}
          <div className="navbar-mobile-header-actions">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className={`btn-mobile-top-settings ${isSettingsActive ? 'is-active' : ''}`}
                  onClick={handleNavigate('/settings')}
                  aria-label="Settings"
                  title="Settings"
                >
                  <SettingsIcon size={15} />
                  <span>Settings</span>
                </button>
                <button
                  type="button"
                  className="btn-mobile-top-logout"
                  onClick={handleNavigate('/logout')}
                  aria-label="Log Out"
                  title="Log Out"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn-mobile-top-login"
                onClick={handleNavigate('/login')}
                aria-label="Log In"
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Compact Bottom Navigation Bar — All 5 Destinations Accessible */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
        {/* 1. Home */}
        <a
          href="/"
          className={`mobile-nav-item ${isHomeActive ? 'is-active' : ''}`}
          aria-current={isHomeActive ? 'page' : undefined}
          onClick={handleNavigate('/')}
        >
          <Home size={19} className="mobile-item-icon" />
          <span className="mobile-item-label">Home</span>
        </a>

        {/* 2. Explore */}
        <a
          href="/explore"
          className={`mobile-nav-item ${isExploreActive ? 'is-active' : ''}`}
          aria-current={isExploreActive ? 'page' : undefined}
          onClick={handleNavigate('/explore')}
        >
          <Compass size={19} className="mobile-item-icon" />
          <span className="mobile-item-label">Explore</span>
        </a>

        {/* 3. Teams */}
        <a
          href="/teams"
          className={`mobile-nav-item ${isTeamsActive ? 'is-active' : ''}`}
          aria-current={isTeamsActive ? 'page' : undefined}
          onClick={handleNavigate('/teams')}
        >
          <Users size={19} className="mobile-item-icon" />
          <span className="mobile-item-label">Teams</span>
        </a>

        {/* 4. Messages (or Login when unauthenticated) */}
        {isAuthenticated ? (
          <a
            href="/messages"
            className={`mobile-nav-item ${isMessagesActive ? 'is-active' : ''}`}
            aria-current={isMessagesActive ? 'page' : undefined}
            onClick={handleNavigate('/messages')}
          >
            <span className="mobile-icon-wrap">
              <MessageSquare size={19} className="mobile-item-icon" />
              {unreadMessagesCount > 0 && <span className="mobile-unread-dot" />}
            </span>
            <span className="mobile-item-label">Messages</span>
          </a>
        ) : (
          <a
            href="/login"
            className={`mobile-nav-item ${currentPath === '/login' ? 'is-active' : ''}`}
            aria-current={currentPath === '/login' ? 'page' : undefined}
            onClick={handleNavigate('/login')}
          >
            <LogIn size={19} className="mobile-item-icon" />
            <span className="mobile-item-label">Login</span>
          </a>
        )}

        {/* 5. Profile (or Sign Up when unauthenticated) */}
        {isAuthenticated ? (
          <a
            href={profilePath}
            className={`mobile-nav-item ${isProfileActive ? 'is-active' : ''}`}
            aria-current={isProfileActive ? 'page' : undefined}
            onClick={handleNavigate(profilePath)}
          >
            <span className="mobile-profile-avatar-wrap">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="mobile-avatar-img" />
              ) : (
                <span className="mobile-avatar-initials">{getInitials(user?.name)}</span>
              )}
            </span>
            <span className="mobile-item-label">Profile</span>
          </a>
        ) : (
          <a
            href="/signup"
            className={`mobile-nav-item ${currentPath === '/signup' ? 'is-active' : ''}`}
            aria-current={currentPath === '/signup' ? 'page' : undefined}
            onClick={handleNavigate('/signup')}
          >
            <UserPlus size={19} className="mobile-item-icon" />
            <span className="mobile-item-label">Sign Up</span>
          </a>
        )}
      </nav>
    </>
  );
}

export default Navbar;
