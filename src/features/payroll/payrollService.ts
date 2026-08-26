export type PayrollStatus = 'Scheduled' | 'Paid';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  period: string;
  currency: 'PLN';
  baseSalary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  status: PayrollStatus;
  paidAt: string | null;
}

export type PayrollUpdates = Partial<Pick<PayrollRecord, 'bonus' | 'deductions' | 'status' | 'paidAt'>>;

export interface PayrollService {
  listPayroll(): Promise<PayrollRecord[]>;
  listPayrollByEmployee(employeeId: string): Promise<PayrollRecord[]>;
  updatePayroll(id: string, updates: PayrollUpdates): Promise<PayrollRecord>;
  resetPayroll(): Promise<PayrollRecord[]>;
}

export const PAYROLL_STORAGE_KEY = 'northstar-hr-payroll';

export const seedPayrollRecords: PayrollRecord[] = [
  { id: 'PAY-001', employeeId: 'EMP-001', period: '2026-08', currency: 'PLN', baseSalary: 12000, bonus: 800, deductions: 2300, netPay: 10500, status: 'Paid', paidAt: '2026-08-25' },
  { id: 'PAY-002', employeeId: 'EMP-001', period: '2026-07', currency: 'PLN', baseSalary: 12000, bonus: 0, deductions: 2200, netPay: 9800, status: 'Paid', paidAt: '2026-07-25' },
  { id: 'PAY-003', employeeId: 'EMP-002', period: '2026-08', currency: 'PLN', baseSalary: 15000, bonus: 1200, deductions: 3100, netPay: 13100, status: 'Paid', paidAt: '2026-08-25' },
  { id: 'PAY-004', employeeId: 'EMP-003', period: '2026-08', currency: 'PLN', baseSalary: 10500, bonus: 0, deductions: 1950, netPay: 8550, status: 'Scheduled', paidAt: null },
];

export class PayrollDataError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'PayrollDataError';
    if (options?.cause !== undefined) (this as Error & { cause?: unknown }).cause = options.cause;
  }
}

type StorageSource = Storage | (() => Storage);

function cloneRecords(records: PayrollRecord[]) {
  return records.map((record) => ({ ...record }));
}

function isPayrollRecord(value: unknown): value is PayrollRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === 'string' && record.id.length > 0 &&
    typeof record.employeeId === 'string' && record.employeeId.length > 0 &&
    typeof record.period === 'string' && record.period.length > 0 &&
    record.currency === 'PLN' &&
    typeof record.period === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(record.period) &&
    typeof record.baseSalary === 'number' && Number.isFinite(record.baseSalary) && record.baseSalary >= 0 &&
    typeof record.bonus === 'number' && Number.isFinite(record.bonus) && record.bonus >= 0 &&
    typeof record.deductions === 'number' && Number.isFinite(record.deductions) && record.deductions >= 0 &&
    typeof record.netPay === 'number' && Number.isFinite(record.netPay) && record.netPay >= 0 &&
    record.netPay === Number(record.baseSalary) + Number(record.bonus) - Number(record.deductions) &&
    (record.status === 'Scheduled' || record.status === 'Paid') &&
    ((record.status === 'Scheduled' && record.paidAt === null) ||
      (record.status === 'Paid' && typeof record.paidAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(record.paidAt)));
}

export function createPayrollService(storageSource: StorageSource): PayrollService {
  function storage() {
    try {
      return typeof storageSource === 'function' ? storageSource() : storageSource;
    } catch (cause) {
      throw new PayrollDataError('Payroll storage is not available.', { cause });
    }
  }

  function write(records: PayrollRecord[]) {
    try {
      storage().setItem(PAYROLL_STORAGE_KEY, JSON.stringify(records));
      return cloneRecords(records);
    } catch (cause) {
      throw new PayrollDataError('Payroll data could not be saved.', { cause });
    }
  }

  function read() {
    let stored: string | null;
    try {
      stored = storage().getItem(PAYROLL_STORAGE_KEY);
    } catch (cause) {
      throw new PayrollDataError('Payroll data could not be read.', { cause });
    }
    if (stored === null) return write(seedPayrollRecords);
    try {
      const parsed: unknown = JSON.parse(stored);
      if (!Array.isArray(parsed) || !parsed.every(isPayrollRecord)) throw new Error('Invalid payroll array.');
      if (new Set(parsed.map((record) => record.id)).size !== parsed.length) throw new Error('Duplicate payroll IDs.');
      return cloneRecords(parsed);
    } catch (cause) {
      throw new PayrollDataError('Stored payroll data is malformed.', { cause });
    }
  }

  return {
    async listPayroll() { return read(); },
    async listPayrollByEmployee(employeeId) { return read().filter((record) => record.employeeId === employeeId); },
    async updatePayroll(id, updates) {
      const records = read();
      const index = records.findIndex((record) => record.id === id);
      if (index === -1) throw new PayrollDataError(`Payroll record ${id} was not found.`);
      const candidate = { ...records[index], ...updates, id, employeeId: records[index].employeeId };
      candidate.netPay = candidate.baseSalary + candidate.bonus - candidate.deductions;
      if (!isPayrollRecord(candidate)) throw new PayrollDataError('Payroll data is invalid.');
      const next = [...records];
      next[index] = candidate;
      write(next);
      return { ...candidate };
    },
    async resetPayroll() { return write(seedPayrollRecords); },
  };
}

export const payrollService = createPayrollService(() => window.localStorage);
