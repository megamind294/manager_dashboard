import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { employeeService, EmployeeService, EmployeeUpdates } from './employeeService';
import type { Employee } from './types';

interface EmployeesContextValue {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  resetEmployeeData: () => Promise<void>;
  createEmployee: (employee: Employee) => Promise<Employee>;
  updateEmployee: (id: string, updates: EmployeeUpdates) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<void>;
}

const EmployeesContext = createContext<EmployeesContextValue | undefined>(undefined);

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Employee data is unavailable.';
}

export function EmployeesProvider({
  children,
  service = employeeService,
}: {
  children: ReactNode;
  service?: EmployeeService;
}) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEmployees(await service.listEmployees());
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<EmployeesContextValue>(() => ({
    employees,
    loading,
    error,
    refresh,
    async resetEmployeeData() {
      setLoading(true);
      setError(null);
      try {
        setEmployees(await service.resetEmployeeData());
      } catch (cause) {
        setError(errorMessage(cause));
      } finally {
        setLoading(false);
      }
    },
    async createEmployee(employee) {
      try {
        const created = await service.createEmployee(employee);
        setEmployees((current) => [created, ...current]);
        return created;
      } catch (cause) {
        setError(errorMessage(cause));
        throw cause;
      }
    },
    async updateEmployee(id, updates) {
      try {
        const updated = await service.updateEmployee(id, updates);
        setEmployees((current) => current.map((item) => (item.id === id ? updated : item)));
        return updated;
      } catch (cause) {
        setError(errorMessage(cause));
        throw cause;
      }
    },
    async deleteEmployee(id) {
      try {
        await service.deleteEmployee(id);
        setEmployees((current) => current.filter((item) => item.id !== id));
      } catch (cause) {
        setError(errorMessage(cause));
        throw cause;
      }
    },
  }), [employees, error, loading, refresh, service]);

  return <EmployeesContext.Provider value={value}>{children}</EmployeesContext.Provider>;
}

export function useEmployees(): EmployeesContextValue {
  const context = useContext(EmployeesContext);
  if (!context) {
    throw new Error('useEmployees must be used within EmployeesProvider.');
  }
  return context;
}
