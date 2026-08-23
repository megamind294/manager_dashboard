import type { Employee } from './types';

export const seedEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Maya Patel',
    email: 'maya.patel@northstar.dev',
    role: 'Frontend Engineer',
    department: 'Engineering',
    status: 'Active',
    joinedAt: '2026-01-12',
  },
  {
    id: 'EMP-002',
    name: 'Lena Kowalska',
    email: 'lena.kowalska@northstar.dev',
    role: 'React Developer',
    department: 'Engineering',
    status: 'Active',
    joinedAt: '2026-03-21',
  },
  {
    id: 'EMP-003',
    name: 'Noah Smith',
    email: 'noah.smith@northstar.dev',
    role: 'Product Designer',
    department: 'Design',
    status: 'On Leave',
    joinedAt: '2025-11-08',
  },
  {
    id: 'EMP-004',
    name: 'Aisha Khan',
    email: 'aisha.khan@northstar.dev',
    role: 'HR Specialist',
    department: 'People',
    status: 'Active',
    joinedAt: '2025-09-15',
  },
  {
    id: 'EMP-005',
    name: 'Jakub Nowak',
    email: 'jakub.nowak@northstar.dev',
    role: 'QA Engineer',
    department: 'Quality',
    status: 'Inactive',
    joinedAt: '2025-07-01',
  },
];
