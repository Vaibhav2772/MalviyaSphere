import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from './App';

describe('MalviyaSphere Chat Module Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    const mockUser = {
      name: 'Campus Scholar',
      email: 'scholar@mmmut.ac.in',
      hasCompletedOnboarding: true,
    };
    localStorage.setItem('malviyasphere_mock_user', JSON.stringify(mockUser));
    window.history.pushState({}, '', '/messages');
  });

  test('renders Messages page, conversation sidebar, and default active conversation', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /conversations/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search conversations/i)).toBeInTheDocument();
    // Default active conversation
    expect(screen.getAllByRole('heading', { name: 'RoboMalviya Autonomous Rover' }).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
  });

  test('filters conversations by search query', () => {
    render(<App />);
    const sidebar = screen.getByRole('complementary', { name: /messages sidebar/i });
    const searchInput = screen.getByPlaceholderText(/search conversations/i);
    fireEvent.change(searchInput, { target: { value: 'Riya Sen' } });

    expect(within(sidebar).getByText('Riya Sen')).toBeInTheDocument();
    expect(within(sidebar).queryByText('RoboMalviya Autonomous Rover')).not.toBeInTheDocument();
  });

  test('filters conversations by tabs (Direct vs Teams)', () => {
    render(<App />);
    const sidebar = screen.getByRole('complementary', { name: /messages sidebar/i });
    const directTab = screen.getByRole('tab', { name: /direct/i });
    fireEvent.click(directTab);

    // Direct students visible in sidebar
    expect(within(sidebar).getAllByText('Aarav Sharma').length).toBeGreaterThan(0);
    // Team conversation filtered out from sidebar
    expect(within(sidebar).queryByText('RoboMalviya Autonomous Rover')).not.toBeInTheDocument();

    const teamsTab = screen.getByRole('tab', { name: /teams/i });
    fireEvent.click(teamsTab);

    expect(within(sidebar).getByText('RoboMalviya Autonomous Rover')).toBeInTheDocument();
  });

  test('sends a message and updates the active conversation history and last message preview', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/type a message/i);
    fireEvent.change(input, { target: { value: 'Testing ground sensors tomorrow morning!' } });

    const sendBtn = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(sendBtn);

    // Verify message appears in history
    expect(screen.getAllByText('Testing ground sensors tomorrow morning!').length).toBeGreaterThan(0);
    // Input is cleared
    expect(input.value).toBe('');
  });

  test('switches conversation when clicked in the sidebar', () => {
    render(<App />);
    const riyaItem = screen.getAllByRole('heading', { name: 'Riya Sen' })[0];
    fireEvent.click(riyaItem);

    // Active conversation body updates to Riya Sen
    expect(screen.getAllByText(/jam session at the cultural activity center/i).length).toBeGreaterThan(0);
  });

  test('supports blocking and unblocking a student in direct chat', async () => {
    render(<App />);
    // Select direct chat with Aarav Sharma from sidebar
    const aaravItem = screen.getAllByRole('heading', { name: 'Aarav Sharma' })[0];
    fireEvent.click(aaravItem);

    // Open dropdown actions
    const moreBtn = screen.getByRole('button', { name: /conversation actions/i });
    fireEvent.click(moreBtn);

    const blockOption = screen.getByRole('button', { name: /block student/i });
    fireEvent.click(blockOption);

    // Confirmation dialog appears
    expect(screen.getByRole('heading', { name: /block aarav sharma\?/i })).toBeInTheDocument();
    const confirmBlockBtn = screen.getByRole('button', { name: /confirm block/i });
    fireEvent.click(confirmBlockBtn);

    // Blocked indicator banner appears
    expect(screen.getByText(/you have blocked this student/i)).toBeInTheDocument();
    expect(screen.getByText(/this conversation is blocked/i)).toBeInTheDocument();

    // Now unblock
    fireEvent.click(moreBtn);
    const unblockOption = screen.getByRole('button', { name: /unblock student/i });
    fireEvent.click(unblockOption);

    // Input is restored
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
  });

  test('opens report dialog, validates reason, and submits report', () => {
    render(<App />);
    const moreBtn = screen.getByRole('button', { name: /conversation actions/i });
    fireEvent.click(moreBtn);

    const reportOption = screen.getByRole('button', { name: /report conversation/i });
    fireEvent.click(reportOption);

    expect(screen.getByRole('heading', { name: /report/i })).toBeInTheDocument();

    // Select Spam radio
    const spamRadio = screen.getByLabelText(/spam or commercial solicitation/i);
    fireEvent.click(spamRadio);

    const submitReportBtn = screen.getByRole('button', { name: /submit report/i });
    fireEvent.click(submitReportBtn);

    // Verify submission confirmation
    expect(screen.getByText(/report recorded \(frontend simulation\)/i)).toBeInTheDocument();
  });

  test('toggles simulated offline mode and displays offline warning', () => {
    render(<App />);
    const offlineToggle = screen.getByRole('button', { name: /toggle offline simulation/i });
    fireEvent.click(offlineToggle);

    // Offline notice in banner and input area
    expect(screen.getByText(/simulated offline mode: new messages cannot be sent/i)).toBeInTheDocument();
    expect(screen.getByText(/simulated offline mode: reconnect to send messages/i)).toBeInTheDocument();
  });
});
