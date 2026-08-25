import { seedEmployees } from './data';
import {
  EmployeeDataError,
  EMPLOYEE_STORAGE_KEY,
  createEmployeeService,
} from './employeeService';
import type { Employee } from './types';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const newEmployee: Employee = {
  id: 'EMP-900',
  name: 'Rinkle Sharma',
  email: 'rinkle@northstar.dev',
  role: 'Frontend Engineer',
  department: 'Engineering',
  status: 'Active',
  joinedAt: '2026-08-25',
};

describe('employeeService', () => {
  test('initializes missing storage from seed employees', async () => {
    const storage = new MemoryStorage();
    const service = createEmployeeService(storage);

    await expect(service.listEmployees()).resolves.toEqual(seedEmployees);
    expect(JSON.parse(storage.getItem(EMPLOYEE_STORAGE_KEY) as string)).toEqual(seedEmployees);
  });

  test('treats an existing stored dataset as authoritative', async () => {
    const storage = new MemoryStorage();
    storage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify([newEmployee]));

    await expect(createEmployeeService(storage).listEmployees()).resolves.toEqual([newEmployee]);
  });

  test('reports malformed storage without silently replacing it', async () => {
    const storage = new MemoryStorage();
    storage.setItem(EMPLOYEE_STORAGE_KEY, '{broken json');

    await expect(createEmployeeService(storage).listEmployees()).rejects.toBeInstanceOf(EmployeeDataError);
    expect(storage.getItem(EMPLOYEE_STORAGE_KEY)).toBe('{broken json');
  });

  test('reports duplicate stored employee IDs as malformed data', async () => {
    const storage = new MemoryStorage();
    storage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify([newEmployee, { ...newEmployee }]));

    await expect(createEmployeeService(storage).listEmployees()).rejects.toBeInstanceOf(EmployeeDataError);
    expect(JSON.parse(storage.getItem(EMPLOYEE_STORAGE_KEY) as string)).toHaveLength(2);
  });

  test('wraps blocked storage acquisition and read failures as data errors', async () => {
    const blockedService = createEmployeeService(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });
    const readFailure = new MemoryStorage();
    readFailure.getItem = () => {
      throw new DOMException('Blocked', 'SecurityError');
    };

    await expect(blockedService.listEmployees()).rejects.toBeInstanceOf(EmployeeDataError);
    await expect(createEmployeeService(readFailure).listEmployees()).rejects.toBeInstanceOf(EmployeeDataError);
  });

  test('wraps initialization, mutation and reset write failures as data errors', async () => {
    const initializeFailure = new MemoryStorage();
    initializeFailure.setItem = () => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    };
    await expect(createEmployeeService(initializeFailure).listEmployees()).rejects.toBeInstanceOf(EmployeeDataError);

    const mutationFailure = new MemoryStorage();
    mutationFailure.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify([]));
    mutationFailure.setItem = () => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    };
    const service = createEmployeeService(mutationFailure);
    await expect(service.createEmployee(newEmployee)).rejects.toBeInstanceOf(EmployeeDataError);
    await expect(service.resetEmployeeData()).rejects.toBeInstanceOf(EmployeeDataError);
  });

  test('persists create, update, lookup and delete operations', async () => {
    const storage = new MemoryStorage();
    storage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify([]));
    const service = createEmployeeService(storage);

    await expect(service.createEmployee(newEmployee)).resolves.toEqual(newEmployee);
    await expect(service.getEmployee(newEmployee.id)).resolves.toEqual(newEmployee);

    const updated = await service.updateEmployee(newEmployee.id, {
      role: 'Senior Frontend Engineer',
      status: 'On Leave',
      id: 'REPLACED',
      joinedAt: '2099-01-01',
    } as Parameters<typeof service.updateEmployee>[1] & { id: string; joinedAt: string });
    expect(updated).toEqual({ ...newEmployee, role: 'Senior Frontend Engineer', status: 'On Leave' });

    await service.deleteEmployee(newEmployee.id);
    await expect(service.listEmployees()).resolves.toEqual([]);
  });

  test('rejects updates and deletes for an unknown employee', async () => {
    const storage = new MemoryStorage();
    storage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify([]));
    const service = createEmployeeService(storage);

    await expect(service.updateEmployee('missing', { role: 'Manager' })).rejects.toBeInstanceOf(EmployeeDataError);
    await expect(service.deleteEmployee('missing')).rejects.toBeInstanceOf(EmployeeDataError);
  });

  test('explicit reset replaces malformed storage with seed employees', async () => {
    const storage = new MemoryStorage();
    storage.setItem(EMPLOYEE_STORAGE_KEY, 'invalid');
    const service = createEmployeeService(storage);

    await expect(service.resetEmployeeData()).resolves.toEqual(seedEmployees);
    await expect(service.listEmployees()).resolves.toEqual(seedEmployees);
  });
});
