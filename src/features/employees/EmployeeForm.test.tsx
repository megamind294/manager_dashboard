import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EmployeeForm from './EmployeeForm';

test('keeps form values and rejects a case-insensitive duplicate email', () => {
  const onAdd = jest.fn();
  render(
    <EmployeeForm
      existingEmails={['maya.patel@northstar.dev']}
      onAdd={onAdd}
      onClose={jest.fn()}
    />,
  );

  fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Another Maya' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: ' MAYA.PATEL@NORTHSTAR.DEV ' } });
  fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'Engineer' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add employee' }));

  expect(screen.getByText('An employee with this email already exists.')).toBeInTheDocument();
  expect(screen.getByLabelText('Full name')).toHaveValue('Another Maya');
  expect(onAdd).not.toHaveBeenCalled();
});

test('prefills edit values and preserves immutable employee fields', async () => {
  const employee = {
    id: 'EMP-001',
    name: 'Maya Patel',
    email: 'maya.patel@northstar.dev',
    role: 'Frontend Engineer',
    department: 'Engineering',
    status: 'Active' as const,
    joinedAt: '2026-01-12',
  };
  const onAdd = jest.fn();

  render(
    <EmployeeForm employee={employee} existingEmails={[]} onAdd={onAdd} onClose={jest.fn()} />,
  );

  expect(screen.getByRole('heading', { name: 'Edit employee' })).toBeInTheDocument();
  expect(screen.getByLabelText('Full name')).toHaveValue('Maya Patel');
  fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'Senior Frontend Engineer' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

  await waitFor(() => {
    expect(onAdd).toHaveBeenCalledWith({
      ...employee,
      role: 'Senior Frontend Engineer',
    });
  });
});
