import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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
