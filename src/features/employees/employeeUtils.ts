import type { Employee } from './types';

export type DepartmentFilter = 'All' | string;

export function filterEmployees(
  employees: Employee[],
  searchText: string,
  department: DepartmentFilter,
): Employee[] {
  const normalizedSearch = searchText.trim().toLowerCase();

  return employees.filter((employee) => {
    const matchesDepartment =
      department === 'All' || employee.department === department;

    const searchableText = [
      employee.name,
      employee.email,
      employee.role,
      employee.department,
    ]
      .join(' ')
      .toLowerCase();

    const matchesSearch =
      normalizedSearch.length === 0 || searchableText.includes(normalizedSearch);

    return matchesDepartment && matchesSearch;
  });
}

export function getEmployeeStats(employees: Employee[]) {
  return {
    total: employees.length,
    active: employees.filter((employee) => employee.status === 'Active').length,
    onLeave: employees.filter((employee) => employee.status === 'On Leave').length,
    departments: new Set(employees.map((employee) => employee.department)).size,
  };
}
