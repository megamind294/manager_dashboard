import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type DemoRole = 'admin' | 'employee';

interface SessionContextValue {
  role: DemoRole;
  canManageEmployees: boolean;
  setRole: (role: DemoRole) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({
  children,
  initialRole = 'admin',
}: {
  children: ReactNode;
  initialRole?: DemoRole;
}) {
  const [role, setRole] = useState<DemoRole>(initialRole);
  const value = useMemo(
    () => ({ role, setRole, canManageEmployees: role === 'admin' }),
    [role],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider.');
  }
  return context;
}
