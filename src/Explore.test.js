import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

describe('MalviyaSphere Explore Page', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/explore');
  });

  test('renders Explore page title and search bar', () => {
    render(<App />);
    expect(screen.getByText(/Explore MalviyaSphere/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Find people, interests, skills, or niches/i)
    ).toBeInTheDocument();
  });

  test('displays initial student profile cards', () => {
    render(<App />);
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
    expect(screen.getByText('Priya Patel')).toBeInTheDocument();
    expect(screen.getByText('Vikram Singh')).toBeInTheDocument();
  });

  test('searches students by name and tech skill', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Find people, interests, skills, or niches/i);

    // Search for "Aarav"
    fireEvent.change(searchInput, { target: { value: 'Aarav' } });
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
    expect(screen.queryByText('Vikram Singh')).not.toBeInTheDocument();

    // Clear search
    const clearBtn = screen.getByTitle('Clear search');
    fireEvent.click(clearBtn);
    expect(screen.getByText('Vikram Singh')).toBeInTheDocument();
  });

  test('filters students by category hierarchy card selection', () => {
    render(<App />);
    // Click on Gaming category card
    const gamingCard = screen.getByRole('button', { name: /explore category gaming/i });
    fireEvent.click(gamingCard);

    // Gaming students should be visible
    expect(screen.getByText('Vikram Singh')).toBeInTheDocument();
    // Non-gaming student like Aarav Sharma (tech only) should be filtered out
    expect(screen.queryByText('Aarav Sharma')).not.toBeInTheDocument();

    // Breadcrumbs should appear
    expect(screen.getByText('All Categories')).toBeInTheDocument();

    // Click "All Categories" to return
    fireEvent.click(screen.getByText('All Categories'));
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
  });

  test('toggles Connect and Follow states without duplicate actions', () => {
    render(<App />);
    const studentCard = screen.getByTestId('student-card-student-1');

    // Initial Connect button
    const connectBtn = within(studentCard).getByRole('button', { name: /connect with aarav sharma/i });
    expect(connectBtn).toHaveTextContent('Connect');

    // Click to connect -> Pending
    fireEvent.click(connectBtn);
    expect(within(studentCard).getByRole('button', { name: /pending with aarav sharma/i })).toHaveTextContent('Pending');

    // Click pending -> Connected
    fireEvent.click(within(studentCard).getByRole('button', { name: /pending with aarav sharma/i }));
    expect(within(studentCard).getByRole('button', { name: /connected with aarav sharma/i })).toHaveTextContent('Connected');

    // Follow toggle
    const followBtn = within(studentCard).getByRole('button', { name: /follow aarav sharma/i });
    expect(followBtn).toHaveTextContent('Follow');

    fireEvent.click(followBtn);
    expect(within(studentCard).getByRole('button', { name: /unfollow aarav sharma/i })).toHaveTextContent('Following');
  });

  test('displays empty state when no students match search and allows resetting', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Find people, interests, skills, or niches/i);

    fireEvent.change(searchInput, { target: { value: 'NonexistentKeywordXYZ123' } });
    expect(screen.getByText(/No matching students found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear search query/i })).toBeInTheDocument();

    // Click clear search query
    fireEvent.click(screen.getByRole('button', { name: /clear search query/i }));
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
  });

  test('navigates to student profile when View Profile is clicked', () => {
    render(<App />);
    const studentCard = screen.getByTestId('student-card-student-1');
    const viewProfileBtn = within(studentCard).getByRole('button', { name: /view profile of aarav sharma/i });

    fireEvent.click(viewProfileBtn);

    // Should now be on profile page
    expect(screen.getByText('Interests & Niches Hierarchy')).toBeInTheDocument();
    expect(screen.getByText('Self-Reported Skills & Experience')).toBeInTheDocument();
  });
});
