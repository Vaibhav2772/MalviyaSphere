import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('MalviyaSphere Navigation & Auth Routing Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Authenticated Navigation (Logged In)', () => {
    const mockUser = {
      name: 'Aditya Verma',
      email: 'aditya.cs@mmmut.ac.in',
      hasCompletedOnboarding: true,
      college: 'MMMUT Gorakhpur',
    };

    beforeEach(() => {
      localStorage.setItem('malviyasphere_mock_user', JSON.stringify(mockUser));
      window.history.pushState({}, '', '/');
    });

    test('renders 5 primary navigation destinations in exact order: Home, Explore, Teams, Messages, Profile', () => {
      render(<App />);

      const desktopNav = screen.getByRole('menubar');
      const navLinks = desktopNav.querySelectorAll('.nav-link');

      expect(navLinks.length).toBe(5);
      expect(navLinks[0]).toHaveTextContent('Home');
      expect(navLinks[1]).toHaveTextContent('Explore');
      expect(navLinks[2]).toHaveTextContent('Teams');
      expect(navLinks[3]).toHaveTextContent('Messages');
      expect(navLinks[4]).toHaveTextContent('Profile');
    });

    test('highlights the active page for each destination', () => {
      window.history.pushState({}, '', '/explore');
      const { unmount } = render(<App />);

      const desktopNav = screen.getByRole('menubar');
      const exploreLink = desktopNav.querySelector('a[href="/explore"]');
      expect(exploreLink).toHaveClass('is-active');
      expect(exploreLink).toHaveAttribute('aria-current', 'page');

      unmount();

      // Test Teams active state
      window.history.pushState({}, '', '/teams');
      render(<App />);
      const desktopNavTeams = screen.getByRole('menubar');
      const teamsLink = desktopNavTeams.querySelector('a[href="/teams"]');
      expect(teamsLink).toHaveClass('is-active');
      expect(teamsLink).toHaveAttribute('aria-current', 'page');
    });

    test('displays user initials in the Profile navigation link', () => {
      render(<App />);

      const desktopNav = screen.getByRole('menubar');
      const profileLink = desktopNav.querySelector('.nav-link-profile');
      expect(profileLink).toBeInTheDocument();
      // Aditya Verma -> AV initials
      expect(profileLink).toHaveTextContent('AV');
      expect(profileLink).toHaveTextContent('Profile');
    });

    test('navigates to Home when brand logo is clicked', () => {
      window.history.pushState({}, '', '/teams');
      render(<App />);

      const brandLogo = screen.getByLabelText(/malviyasphere home/i);
      fireEvent.click(brandLogo);

      // Verify Landing page content is rendered
      expect(screen.getByText(/Your people\./i)).toBeInTheDocument();
    });

    test('renders mobile bottom navigation bar with all 5 destinations and accessible labels', () => {
      render(<App />);

      const mobileNav = screen.getByLabelText('Mobile Bottom Navigation');
      expect(mobileNav).toBeInTheDocument();

      const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-item');
      expect(mobileLinks.length).toBe(5);
      expect(mobileLinks[0]).toHaveTextContent('Home');
      expect(mobileLinks[1]).toHaveTextContent('Explore');
      expect(mobileLinks[2]).toHaveTextContent('Teams');
      expect(mobileLinks[3]).toHaveTextContent('Messages');
      expect(mobileLinks[4]).toHaveTextContent('Profile');
    });

    test('allows authenticated user to access protected /messages and /profile/me routes', () => {
      window.history.pushState({}, '', '/messages');
      const { unmount } = render(<App />);

      expect(screen.getByRole('heading', { name: /conversations/i })).toBeInTheDocument();

      unmount();

      window.history.pushState({}, '', '/profile/me');
      render(<App />);

      expect(screen.getByText('Your Profile')).toBeInTheDocument();
    });
  });

  describe('Unauthenticated Navigation (Logged Out)', () => {
    beforeEach(() => {
      localStorage.clear();
      window.history.pushState({}, '', '/');
    });

    test('does not expose private Messages or Profile in unauthenticated desktop navigation', () => {
      render(<App />);

      const desktopNav = screen.getByRole('menubar');
      const navLinks = desktopNav.querySelectorAll('.nav-link');

      // Only Home, Explore, Teams are shown
      expect(navLinks.length).toBe(3);
      expect(navLinks[0]).toHaveTextContent('Home');
      expect(navLinks[1]).toHaveTextContent('Explore');
      expect(navLinks[2]).toHaveTextContent('Teams');

      // Private routes are not exposed in nav
      expect(desktopNav).not.toHaveTextContent('Messages');
      expect(desktopNav).not.toHaveTextContent('Profile');

      // Login and Sign Up actions are visible
      expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^sign up$/i })).toBeInTheDocument();
    });

    test('renders mobile bottom bar with Home, Explore, Teams, Login, and Sign Up when logged out', () => {
      render(<App />);

      const mobileNav = screen.getByLabelText('Mobile Bottom Navigation');
      const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-item');

      expect(mobileLinks.length).toBe(5);
      expect(mobileLinks[0]).toHaveTextContent('Home');
      expect(mobileLinks[1]).toHaveTextContent('Explore');
      expect(mobileLinks[2]).toHaveTextContent('Teams');
      expect(mobileLinks[3]).toHaveTextContent('Login');
      expect(mobileLinks[4]).toHaveTextContent('Sign Up');
    });

    test('redirects unauthenticated user from protected /messages route to login page', () => {
      window.history.pushState({}, '', '/messages');
      render(<App />);

      // Protected route redirects to Login
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/college email address/i)).toBeInTheDocument();
    });

    test('redirects unauthenticated user from protected /profile/me route to login page', () => {
      window.history.pushState({}, '', '/profile/me');
      render(<App />);

      // Protected route redirects to Login
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    });

    test('allows unauthenticated users to view public student profile from Explore', () => {
      window.history.pushState({}, '', '/profile/student-1');
      render(<App />);

      // Public profile is accessible
      expect(screen.getByRole('heading', { level: 1, name: 'Aarav Sharma' })).toBeInTheDocument();
    });
  });
});
