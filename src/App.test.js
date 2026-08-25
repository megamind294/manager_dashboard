import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => window.localStorage.clear());

test('loads persisted employees before rendering the management dashboard', async () => {
  render(<App />);
  expect(screen.getByText(/loading employees/i)).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: /employee management/i })).toBeInTheDocument();
  expect(screen.getByText('Maya Patel')).toBeInTheDocument();
});
