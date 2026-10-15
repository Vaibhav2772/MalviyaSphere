import { render, screen } from '@testing-library/react';
import App from './App';

test('renders MalviyaSphere landing page hero heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Your people\./i);
  expect(headingElement).toBeInTheDocument();
});

test('renders Find Your People CTA button', () => {
  render(<App />);
  const ctaButton = screen.getByRole('button', { name: /find your people/i });
  expect(ctaButton).toBeInTheDocument();
});

test('renders Featured Interests section heading', () => {
  render(<App />);
  const sectionTitle = screen.getByText(/Find your kind of people/i);
  expect(sectionTitle).toBeInTheDocument();
});
