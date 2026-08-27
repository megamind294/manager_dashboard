import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { payrollService, PayrollRecord, PayrollService, PayrollUpdates } from './payrollService';
import { useSession } from '../session/SessionProvider';

interface PayrollContextValue {
  payroll: PayrollRecord[];
  loading: boolean;
  error: string | null;
  updatePayroll: (id: string, updates: PayrollUpdates) => Promise<PayrollRecord>;
  resetPayroll: () => Promise<void>;
}

const PayrollContext = createContext<PayrollContextValue | undefined>(undefined);

export function PayrollProvider({ children, service = payrollService }: { children: ReactNode; service?: PayrollService }) {
  const { canManageEmployees, employeeId } = useSession();
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeRequest = useRef(0);
  const load = useCallback(async () => {
    const requestId = ++activeRequest.current;
    setLoading(true); setError(null);
    try {
      const nextPayroll = canManageEmployees ? await service.listPayroll() : await service.listPayrollByEmployee(employeeId);
      if (requestId === activeRequest.current) setPayroll(nextPayroll);
    }
    catch (cause) {
      if (requestId === activeRequest.current) setError(cause instanceof Error ? cause.message : 'Payroll is unavailable.');
    }
    finally { if (requestId === activeRequest.current) setLoading(false); }
  }, [canManageEmployees, employeeId, service]);
  useEffect(() => { void load(); }, [load]);
  const visiblePayroll = canManageEmployees
    ? payroll
    : payroll.filter((record) => record.employeeId === employeeId);

  const value = useMemo<PayrollContextValue>(() => ({
    payroll: visiblePayroll, loading, error,
    async updatePayroll(id, updates) {
      if (!canManageEmployees) {
        const cause = new Error('Payroll updates require an Admin session.');
        setError(cause.message);
        throw cause;
      }
      try {
        const updated = await service.updatePayroll(id, updates);
        setPayroll((current) => current.map((record) => record.id === id ? updated : record));
        return updated;
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Payroll could not be updated.');
        throw cause;
      }
    },
    async resetPayroll() {
      if (!canManageEmployees) {
        setError('Payroll recovery requires an Admin session.');
        return;
      }
      setLoading(true);
      try { setPayroll(await service.resetPayroll()); setError(null); }
      catch (cause) { setError(cause instanceof Error ? cause.message : 'Payroll is unavailable.'); throw cause; }
      finally { setLoading(false); }
    },
  }), [canManageEmployees, error, loading, service, visiblePayroll]);
  return <PayrollContext.Provider value={value}>{children}</PayrollContext.Provider>;
}

export function usePayroll() {
  const context = useContext(PayrollContext);
  if (!context) throw new Error('usePayroll must be used within PayrollProvider.');
  return context;
}
