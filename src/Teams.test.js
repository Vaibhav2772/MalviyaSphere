import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('MalviyaSphere Teams Module Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/teams');
  });

  test('renders Teams page heading, search bar, and initial teams', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /find your team/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search by team name, objective, skills/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create team/i })).toBeInTheDocument();
    // Verify mock teams rendered
    expect(screen.getByText('RoboMalviya Autonomous Rover')).toBeInTheDocument();
    expect(screen.getByText('CampusPulse Student Portal')).toBeInTheDocument();
  });

  test('filters teams by search query', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/search by team name, objective, skills/i);
    fireEvent.change(searchInput, { target: { value: 'Esports' } });

    expect(screen.getByText('Garuda Esports Championship Squad')).toBeInTheDocument();
    expect(screen.queryByText('RoboMalviya Autonomous Rover')).not.toBeInTheDocument();
  });

  test('filters teams by domain category', () => {
    render(<App />);
    const categorySelect = screen.getByLabelText(/project domain \/ category/i);
    fireEvent.change(categorySelect, { target: { value: 'music' } });

    expect(screen.getByText('Malviya Rhythms Acoustic Collective')).toBeInTheDocument();
    expect(screen.queryByText('RoboMalviya Autonomous Rover')).not.toBeInTheDocument();
  });

  test('shows empty state when no teams match search', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/search by team name, objective, skills/i);
    fireEvent.change(searchInput, { target: { value: 'NonexistentUnicornProjectXYZ' } });

    expect(screen.getByText(/no teams found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument();
  });

  test('opens Create Team modal, validates required fields, and creates a new team', async () => {
    render(<App />);
    const createBtn = screen.getByRole('button', { name: /create team/i });
    fireEvent.click(createBtn);

    expect(screen.getByRole('heading', { name: /create a project team/i })).toBeInTheDocument();

    // Trigger validation with empty name
    const submitBtn = screen.getByRole('button', { name: /create team & publish/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/team name is required/i)).toBeInTheDocument();

    // Fill valid inputs
    const nameInput = screen.getByLabelText(/team name/i);
    fireEvent.change(nameInput, { target: { value: 'MMMUT Rocketry Club' } });

    const objInput = screen.getByLabelText(/project objective \/ mission/i);
    fireEvent.change(objInput, { target: { value: 'Designing high-powered avionics sounding rockets.' } });

    const descInput = screen.getByLabelText(/detailed project description/i);
    fireEvent.change(descInput, { target: { value: 'An interdisciplinary collegiate team working on recovery parachutes and solid rocket motor telemetry.' } });

    fireEvent.click(submitBtn);

    // Verify success state
    expect(await screen.findByText(/team "mmmut rocketry club" created!/i)).toBeInTheDocument();
  });

  test('navigates to Team Details page and displays recruitment details', () => {
    render(<App />);
    const teamTitle = screen.getByText('RoboMalviya Autonomous Rover');
    fireEvent.click(teamTitle);

    expect(screen.getByRole('heading', { name: 'RoboMalviya Autonomous Rover' })).toBeInTheDocument();
    expect(screen.getByText(/about this project/i)).toBeInTheDocument();
    expect(screen.getByText(/open positions & roles/i)).toBeInTheDocument();
    expect(screen.getByText(/team lead & founder/i)).toBeInTheDocument();
  });
});
