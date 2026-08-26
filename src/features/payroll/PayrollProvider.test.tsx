import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DemoRole, SessionProvider, useSession } from '../session/SessionProvider';
import { PayrollProvider, usePayroll } from './PayrollProvider';
import { seedPayrollRecords } from './payrollService';

let service: {
  listPayroll: jest.Mock;
  listPayrollByEmployee: jest.Mock;
  updatePayroll: jest.Mock;
  resetPayroll: jest.Mock;
};

function Probe() {
  const { payroll, updatePayroll } = usePayroll();
  return <><span>{payroll.map((record) => record.employeeId).join(',')}</span><button onClick={() => { void updatePayroll('PAY-001', { bonus: 1 }).catch(() => undefined); }}>Update payroll</button></>;
}

function RoleProbe() {
  const { payroll } = usePayroll();
  const { role, setRole } = useSession();
  return <><span>{role}</span><span>{payroll.map((record) => record.employeeId).join(',')}</span><button onClick={() => setRole('admin' as DemoRole)}>Use admin</button></>;
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

beforeEach(() => {
  service = {
    listPayroll: jest.fn().mockResolvedValue(seedPayrollRecords),
    listPayrollByEmployee: jest.fn().mockImplementation(async (employeeId: string) => seedPayrollRecords.filter((record) => record.employeeId === employeeId)),
    updatePayroll: jest.fn().mockResolvedValue(seedPayrollRecords[0]),
    resetPayroll: jest.fn().mockResolvedValue(seedPayrollRecords),
  };
});

test('loads and exposes only the signed-in employee payroll for employee sessions', async () => {
  render(<SessionProvider initialRole="employee"><PayrollProvider service={service}><Probe /></PayrollProvider></SessionProvider>);

  await waitFor(() => expect(service.listPayrollByEmployee).toHaveBeenCalledWith('EMP-001'));
  expect(await screen.findByText('EMP-001,EMP-001')).toBeInTheDocument();
  expect(screen.queryByText(/EMP-002/)).not.toBeInTheDocument();
});

test('rejects payroll writes below the UI layer for employee sessions', async () => {
  render(<SessionProvider initialRole="employee"><PayrollProvider service={service}><Probe /></PayrollProvider></SessionProvider>);

  fireEvent.click(screen.getByRole('button', { name: 'Update payroll' }));
  await waitFor(() => expect(service.updatePayroll).not.toHaveBeenCalled());
});

test('ignores a stale employee-scoped load after switching to admin', async () => {
  const employeeLoad = deferred<typeof seedPayrollRecords>();
  const adminLoad = deferred<typeof seedPayrollRecords>();
  service.listPayrollByEmployee.mockReturnValue(employeeLoad.promise);
  service.listPayroll.mockReturnValue(adminLoad.promise);
  render(<SessionProvider initialRole="employee"><PayrollProvider service={service}><RoleProbe /></PayrollProvider></SessionProvider>);

  await waitFor(() => expect(service.listPayrollByEmployee).toHaveBeenCalled());
  fireEvent.click(screen.getByRole('button', { name: 'Use admin' }));
  await waitFor(() => expect(service.listPayroll).toHaveBeenCalled());
  adminLoad.resolve(seedPayrollRecords);
  expect(await screen.findByText(/EMP-002/)).toBeInTheDocument();
  await act(async () => { employeeLoad.resolve(seedPayrollRecords.filter((record) => record.employeeId === 'EMP-001')); });

  await waitFor(() => expect(screen.getByText(/EMP-002/)).toBeInTheDocument());
});
