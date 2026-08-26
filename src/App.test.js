import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState({}, '', '/employees');
});

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
  expect(window.location.pathname).toBe('/employees/EMP-001');

  fireEvent.click(screen.getByRole('button', { name: 'Back to directory' }));
  expect(screen.getByRole('heading', { name: 'Team directory' })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/employees');
});

test('renders an employee directly from its URL', async () => {
  window.history.replaceState({}, '', '/employees/EMP-002');
  render(<App />);

  expect(await screen.findByRole('heading', { name: 'Lena Kowalska' })).toBeInTheDocument();
  expect(screen.getByText('EMP-002')).toBeInTheDocument();
});

test('renders a recoverable employee-not-found view for an unknown id', async () => {
  window.history.replaceState({}, '', '/employees/EMP-999');
  render(<App />);

  expect(await screen.findByRole('heading', { name: /employee not found/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /back to directory/i }));
  expect(screen.getByRole('heading', { name: 'Team directory' })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/employees');
});

test('responds to browser history navigation', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: 'Team directory' });

  window.history.pushState({}, '', '/employees/EMP-003');
  fireEvent.popState(window);

  expect(await screen.findByRole('heading', { name: 'Noah Smith' })).toBeInTheDocument();
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

test('switches to a read-only employee view', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: /employee management/i });

  fireEvent.change(screen.getByLabelText('Preview role'), { target: { value: 'employee' } });

  expect(screen.getByText(/read-only employee view/i)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /add employee/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Edit Maya Patel' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Delete Maya Patel' })).not.toBeInTheDocument();
  expect(screen.queryByLabelText('Change status for Maya Patel')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'View Maya Patel' })).toBeInTheDocument();
});
