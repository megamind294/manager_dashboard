import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SessionProvider, useSession } from './SessionProvider';

function SessionProbe() {
  const { role, canManageEmployees, setRole } = useSession();
  return (
    <div>
      <span>{role}</span>
      <span>{canManageEmployees ? 'can manage' : 'read only'}</span>
      <button type="button" onClick={() => setRole('employee')}>Use employee role</button>
    </div>
  );
}

test('starts with an admin demo session', () => {
  render(<SessionProvider><SessionProbe /></SessionProvider>);

  expect(screen.getByText('admin')).toBeInTheDocument();
  expect(screen.getByText('can manage')).toBeInTheDocument();
});

test('updates permissions when the demo role changes', () => {
  render(<SessionProvider><SessionProbe /></SessionProvider>);

  fireEvent.click(screen.getByRole('button', { name: 'Use employee role' }));
  expect(screen.getByText('employee')).toBeInTheDocument();
  expect(screen.getByText('read only')).toBeInTheDocument();
});

test('requires consumers to be wrapped in the session provider', () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  expect(() => render(<SessionProbe />)).toThrow('useSession must be used within SessionProvider.');
  consoleError.mockRestore();
});
