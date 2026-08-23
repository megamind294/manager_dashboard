import { filterEmployees, getEmployeeStats } from './employeeUtils';
import type { Employee } from './types';

const employees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Maya Patel',
    email: 'maya.patel@example.com',
    role: 'Frontend Engineer',
    department: 'Engineering',
    status: 'Active',
    joinedAt: '2026-01-12',
  },
  {
    id: 'EMP-002',
    name: 'Noah Smith',
    email: 'noah.smith@example.com',
    role: 'Product Designer',
    department: 'Design',
    status: 'On Leave',
    joinedAt: '2025-11-08',
  },
  {
    id: 'EMP-003',
    name: 'Lena Kowalska',
    email: 'lena.k@example.com',
    role: 'React Developer',
    department: 'Engineering',
    status: 'Active',
    joinedAt: '2026-03-21',
  },
];

describe('employee utilities', () => {
  test('filters employees by search text across name, email and role', () => {
    expect(filterEmployees(employees, 'react', 'All')).toEqual([employees[2]]);
    expect(filterEmployees(employees, 'maya', 'All')).toEqual([employees[0]]);
  });

  test('filters employees by department', () => {
    expect(filterEmployees(employees, '', 'Engineering')).toEqual([
      employees[0],
      employees[2],
    ]);
  });

  test('calculates total, active, leave and department counts', () => {
    expect(getEmployeeStats(employees)).toEqual({
      total: 3,
      active: 2,
      onLeave: 1,
      departments: 2,
    });
  });
});
