import { seedEmployees } from './data';
import type { Employee, EmployeeStatus } from './types';

export const EMPLOYEE_STORAGE_KEY = 'northstar-hr-employees';

const employeeStatuses: EmployeeStatus[] = ['Active', 'On Leave', 'Inactive'];

export class EmployeeDataError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'EmployeeDataError';
    if (options?.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

export type EmployeeUpdates = Partial<Omit<Employee, 'id' | 'joinedAt'>>;

export interface EmployeeService {
  listEmployees(): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  createEmployee(employee: Employee): Promise<Employee>;
  updateEmployee(id: string, updates: EmployeeUpdates): Promise<Employee>;
  deleteEmployee(id: string): Promise<void>;
  resetEmployeeData(): Promise<Employee[]>;
}

type StorageSource = Storage | (() => Storage);

function cloneEmployees(employees: Employee[]): Employee[] {
  return employees.map((employee) => ({ ...employee }));
}

function isEmployee(value: unknown): value is Employee {
  if (!value || typeof value !== 'object') return false;
  const employee = value as Record<string, unknown>;

  return (
    typeof employee.id === 'string' &&
    typeof employee.name === 'string' &&
    typeof employee.email === 'string' &&
    typeof employee.role === 'string' &&
    typeof employee.department === 'string' &&
    typeof employee.joinedAt === 'string' &&
    employeeStatuses.includes(employee.status as EmployeeStatus)
  );
}

export function createEmployeeService(storageSource: StorageSource): EmployeeService {
  function getStorage(): Storage {
    try {
      return typeof storageSource === 'function' ? storageSource() : storageSource;
    } catch (cause) {
      throw new EmployeeDataError('Employee storage is not available.', { cause });
    }
  }

  function write(employees: Employee[]): Employee[] {
    try {
      getStorage().setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(employees));
      return cloneEmployees(employees);
    } catch (cause) {
      throw new EmployeeDataError('Employee data could not be saved.', { cause });
    }
  }

  function read(): Employee[] {
    let stored: string | null;
    try {
      stored = getStorage().getItem(EMPLOYEE_STORAGE_KEY);
    } catch (cause) {
      throw new EmployeeDataError('Employee data could not be read.', { cause });
    }

    if (stored === null) {
      return write(seedEmployees);
    }

    try {
      const parsed: unknown = JSON.parse(stored);
      const ids = Array.isArray(parsed) ? parsed.map((employee) => (employee as Employee).id) : [];
      if (
        !Array.isArray(parsed) ||
        !parsed.every(isEmployee) ||
        new Set(ids).size !== ids.length
      ) {
        throw new Error('Stored value is not an employee array.');
      }
      return cloneEmployees(parsed);
    } catch (cause) {
      throw new EmployeeDataError('Stored employee data is malformed.', { cause });
    }
  }

  return {
    async listEmployees() {
      return read();
    },

    async getEmployee(id) {
      const employee = read().find((candidate) => candidate.id === id);
      return employee ? { ...employee } : undefined;
    },

    async createEmployee(employee) {
      const employees = read();
      if (employees.some((candidate) => candidate.id === employee.id)) {
        throw new EmployeeDataError(`Employee ${employee.id} already exists.`);
      }
      write([employee, ...employees]);
      return { ...employee };
    },

    async updateEmployee(id, updates) {
      const employees = read();
      const index = employees.findIndex((employee) => employee.id === id);
      if (index === -1) {
        throw new EmployeeDataError(`Employee ${id} was not found.`);
      }

      const updated = { ...employees[index], ...updates, id, joinedAt: employees[index].joinedAt };
      const nextEmployees = [...employees];
      nextEmployees[index] = updated;
      write(nextEmployees);
      return { ...updated };
    },

    async deleteEmployee(id) {
      const employees = read();
      if (!employees.some((employee) => employee.id === id)) {
        throw new EmployeeDataError(`Employee ${id} was not found.`);
      }
      write(employees.filter((employee) => employee.id !== id));
    },

    async resetEmployeeData() {
      return write(seedEmployees);
    },
  };
}

export const employeeService = createEmployeeService(() => window.localStorage);
