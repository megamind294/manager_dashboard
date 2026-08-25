import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => window.localStorage.clear());

test('loads persisted employees before rendering the management dashboard', async () => {
  render(<App />);
  expect(screen.getByText(/loading employees/i)).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: /employee management/i })).toBeInTheDocument();
  expect(screen.getByText('Maya Patel')).toBeInTheDocument();
});

test('opens employee details and returns to the directory', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: /employee management/i });

  fireEvent.click(screen.getByRole('button', { name: 'View Maya Patel' }));
  expect(screen.getByRole('heading', { name: 'Maya Patel' })).toBeInTheDocument();
  expect(screen.getByText('EMP-001')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Back to directory' }));
  expect(screen.getByRole('heading', { name: 'Team directory' })).toBeInTheDocument();
});

test('requires confirmation before deleting an employee', async () => {
  const confirm = jest.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
  render(<App />);
  await screen.findByRole('heading', { name: /employee management/i });

  fireEvent.click(screen.getByRole('button', { name: 'Delete Maya Patel' }));
  expect(screen.getByText('Maya Patel')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Delete Maya Patel' }));
  expect(await screen.findByText('4 of 4 employees')).toBeInTheDocument();
  expect(screen.queryByText('Maya Patel')).not.toBeInTheDocument();
  confirm.mockRestore();
});
