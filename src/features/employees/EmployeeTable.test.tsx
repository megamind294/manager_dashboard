import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import EmployeeTable from './EmployeeTable';
import type { Employee } from './types';

const employee: Employee = {
  id: 'EMP-001',
  name: 'Maya Patel',
  email: 'maya.patel@northstar.dev',
  role: 'Frontend Engineer',
  department: 'Engineering',
  status: 'Active',
  joinedAt: '2026-01-12',
};

test('exposes view, edit, status, and delete actions for each employee', () => {
  const onView = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const onStatusChange = jest.fn();

  render(
    <EmployeeTable
      employees={[employee]}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      onStatusChange={onStatusChange}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'View Maya Patel' }));
  fireEvent.click(screen.getByRole('button', { name: 'Edit Maya Patel' }));
  fireEvent.change(screen.getByLabelText('Change status for Maya Patel'), { target: { value: 'On Leave' } });
  fireEvent.click(screen.getByRole('button', { name: 'Delete Maya Patel' }));

  expect(onView).toHaveBeenCalledWith(employee);
  expect(onEdit).toHaveBeenCalledWith(employee);
  expect(onStatusChange).toHaveBeenCalledWith(employee, 'On Leave');
  expect(onDelete).toHaveBeenCalledWith(employee);
});
