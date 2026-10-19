import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('MalviyaSphere Student Profile Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders student profile for student-1 (Aarav Sharma)', () => {
    window.history.pushState({}, '', '/profile/student-1');
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Aarav Sharma' })).toBeInTheDocument();
    expect(screen.getByText(/Computer Science and Engineering/i)).toBeInTheDocument();
    expect(screen.getByText(/Interests & Niches Hierarchy/i)).toBeInTheDocument();
    expect(screen.getByText(/Self-Reported Skills & Experience/i)).toBeInTheDocument();
    expect(screen.getByText('Campus Pulse')).toBeInTheDocument();

    // Verified section for Aarav has Smart India Hackathon
    expect(screen.getByText(/Smart India Hackathon 2024 Finalist/i)).toBeInTheDocument();
  });

  test('renders "No verified achievements yet" for student without verified achievements', () => {
    window.history.pushState({}, '', '/profile/student-2');
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Priya Patel' })).toBeInTheDocument();
    expect(screen.getByText(/No verified achievements yet/i)).toBeInTheDocument();
  });

  test('shows proper "Profile not found" page for invalid student ID with back button', () => {
    window.history.pushState({}, '', '/profile/invalid-id-999');
    render(<App />);

    expect(screen.getByText(/Student Profile Not Found/i)).toBeInTheDocument();
    const backBtn = screen.getByRole('button', { name: /back to explore students/i });
    expect(backBtn).toBeInTheDocument();

    // Click back to explore
    fireEvent.click(backBtn);
    expect(screen.getByText(/Explore MalviyaSphere/i)).toBeInTheDocument();
  });

  test('opens mock message modal when Message button is clicked', () => {
    window.history.pushState({}, '', '/profile/student-1');
    render(<App />);

    const messageBtn = screen.getByRole('button', { name: /message/i });
    fireEvent.click(messageBtn);

    expect(screen.getByText(/Message Aarav Sharma/i)).toBeInTheDocument();
    expect(screen.getByText(/Frontend Simulation Notice/i)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /close message dialog/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/Message Aarav Sharma/i)).not.toBeInTheDocument();
  });

  test('allows editing profile when current user views their profile', () => {
    // Set mock user in localStorage
    const mockUser = {
      name: 'Rohan TestUser',
      email: 'rohan.test@mmmut.ac.in',
      hasCompletedOnboarding: true,
      onboardingProfile: {
        fullName: 'Rohan TestUser',
        branch: 'Mechanical Engineering',
        academicYear: 'Third Year',
        experienceSummary: 'Enthusiastic robotics maker',
        interests: ['technology'],
        skillLevel: 'intermediate',
        projects: [{ id: 'p1', name: 'Bot Project', description: 'Arduino rover' }],
      },
    };
    localStorage.setItem('malviyasphere_mock_user', JSON.stringify(mockUser));

    window.history.pushState({}, '', '/profile/me');
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Rohan TestUser' })).toBeInTheDocument();
    expect(screen.getByText('Your Profile')).toBeInTheDocument();

    const editBtn = screen.getByRole('button', { name: /edit profile/i });
    expect(editBtn).toBeInTheDocument();

    // Open edit modal
    fireEvent.click(editBtn);
    expect(screen.getByText('Edit Your Profile')).toBeInTheDocument();

    // Change name in modal
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'Rohan UpdatedName' } });

    // Submit form
    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveBtn);

    // Profile header should update
    expect(screen.getByRole('heading', { level: 1, name: 'Rohan UpdatedName' })).toBeInTheDocument();
  });
});
