export type AppRoute =
  | { name: 'directory' }
  | { name: 'employee'; employeeId: string }
  | { name: 'not-found' };

export function parseRoute(pathname: string): AppRoute {
  if (pathname === '/' || pathname === '/employees') {
    return { name: 'directory' };
  }

  const employeeMatch = pathname.match(/^\/employees\/([^/]+)$/);
  if (!employeeMatch) {
    return { name: 'not-found' };
  }

  try {
    return { name: 'employee', employeeId: decodeURIComponent(employeeMatch[1]) };
  } catch {
    return { name: 'not-found' };
  }
}

export function employeePath(employeeId: string) {
  return `/employees/${encodeURIComponent(employeeId)}`;
}
