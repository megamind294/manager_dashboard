import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { createEmployeeService } from './employeeService';
import { EmployeesProvider, useEmployees } from './EmployeesProvider';
import type { Employee } from './types';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return Array.from(this.values.keys())[index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

const employee: Employee = {
  id: 'EMP-900',
  name: 'Rinkle Sharma',
  email: 'rinkle@northstar.dev',
  role: 'Frontend Engineer',
  department: 'Engineering',
  status: 'Active',
  joinedAt: '2026-08-25',
};

let actions: ReturnType<typeof useEmployees>;

function Probe() {
  actions = useEmployees();
  if (actions.loading) return <p>Loading employees</p>;
  if (actions.error) return <p>{actions.error}</p>;
  return <p>{actions.employees.map((item) => `${item.name}:${item.status}`).join(',')}</p>;
}

describe('EmployeesProvider', () => {
  test('loads employees and keeps context in sync after persisted mutations', async () => {
    const service = createEmployeeService(new MemoryStorage());
    render(<EmployeesProvider service={service}><Probe /></EmployeesProvider>);

    expect(screen.getByText('Loading employees')).toBeInTheDocument();
    await screen.findByText(/Maya Patel:Active/);

    await act(async () => { await actions.createEmployee(employee); });
    expect(screen.getByText(/Rinkle Sharma:Active/)).toBeInTheDocument();

    await act(async () => { await actions.updateEmployee(employee.id, { status: 'On Leave' }); });
    expect(screen.getByText(/Rinkle Sharma:On Leave/)).toBeInTheDocument();

    await act(async () => { await actions.deleteEmployee(employee.id); });
    expect(screen.queryByText(/Rinkle Sharma/)).not.toBeInTheDocument();
    await expect(service.getEmployee(employee.id)).resolves.toBeUndefined();
  });

  test('shows malformed-storage errors and recovers only after explicit reset', async () => {
    const storage = new MemoryStorage();
    storage.setItem('northstar-hr-employees', '{broken');
    const service = createEmployeeService(storage);
    render(<EmployeesProvider service={service}><Probe /></EmployeesProvider>);

    await screen.findByText('Stored employee data is malformed.');
    await act(async () => { await actions.resetEmployeeData(); });
    expect(await screen.findByText(/Maya Patel:Active/)).toBeInTheDocument();
  });

  test('requires useEmployees to be rendered inside its provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Probe />)).toThrow('useEmployees must be used within EmployeesProvider.');
    consoleError.mockRestore();
  });
});
