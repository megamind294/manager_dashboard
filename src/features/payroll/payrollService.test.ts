import { createPayrollService, PAYROLL_STORAGE_KEY, seedPayrollRecords } from './payrollService';

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const values = new Map(Object.entries(initial));
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => Array.from(values.keys())[index] ?? null,
    removeItem: (key) => { values.delete(key); },
    setItem: (key, value) => { values.set(key, value); },
  };
}

test('seeds payroll records and persists them on first load', async () => {
  const storage = memoryStorage();
  const service = createPayrollService(storage);

  await expect(service.listPayroll()).resolves.toEqual(seedPayrollRecords);
  expect(storage.getItem(PAYROLL_STORAGE_KEY)).toBe(JSON.stringify(seedPayrollRecords));
});

test('returns payroll for only the requested employee', async () => {
  const service = createPayrollService(memoryStorage());

  const records = await service.listPayrollByEmployee('EMP-001');

  expect(records).toHaveLength(2);
  expect(records.every((record) => record.employeeId === 'EMP-001')).toBe(true);
});

test('updates a payroll record while preserving its identity', async () => {
  const service = createPayrollService(memoryStorage());

  const updated = await service.updatePayroll('PAY-001', { bonus: 1200, status: 'Paid' });

  expect(updated).toMatchObject({ id: 'PAY-001', employeeId: 'EMP-001', bonus: 1200, status: 'Paid' });
  expect(updated.netPay).toBe(updated.baseSalary + 1200 - updated.deductions);
});

test('rejects malformed persisted payroll data', async () => {
  const service = createPayrollService(memoryStorage({ [PAYROLL_STORAGE_KEY]: '{"bad":true}' }));

  await expect(service.listPayroll()).rejects.toThrow('Stored payroll data is malformed.');
});

test('resets payroll data after a recoverable storage error', async () => {
  const storage = memoryStorage({ [PAYROLL_STORAGE_KEY]: 'not-json' });
  const service = createPayrollService(storage);

  await expect(service.resetPayroll()).resolves.toEqual(seedPayrollRecords);
  await expect(service.listPayroll()).resolves.toEqual(seedPayrollRecords);
});

test('rejects inconsistent persisted payroll summaries', async () => {
  const invalid = [{ ...seedPayrollRecords[0], netPay: 999, paidAt: null }];
  const service = createPayrollService(memoryStorage({ [PAYROLL_STORAGE_KEY]: JSON.stringify(invalid) }));

  await expect(service.listPayroll()).rejects.toThrow('Stored payroll data is malformed.');
});

test('rejects invalid status/date combinations during updates', async () => {
  const service = createPayrollService(memoryStorage());

  await expect(service.updatePayroll('PAY-001', { status: 'Scheduled' })).rejects.toThrow('Payroll data is invalid.');
  await expect(service.updatePayroll('PAY-004', { status: 'Paid' })).rejects.toThrow('Payroll data is invalid.');
});
