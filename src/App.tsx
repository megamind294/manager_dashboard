import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import EmployeeForm from './features/employees/EmployeeForm';
import EmployeeTable from './features/employees/EmployeeTable';
import { EmployeesProvider, useEmployees } from './features/employees/EmployeesProvider';
import StatsCards from './features/employees/StatsCards';
import { filterEmployees, getEmployeeStats } from './features/employees/employeeUtils';
import type { Employee, EmployeeStatus } from './features/employees/types';
import PerformanceReviews from './features/reviews/PerformanceReviews';
import { ReviewsProvider } from './features/reviews/ReviewsProvider';
import { DemoRole, SessionProvider, useSession } from './features/session/SessionProvider';
import { employeePath, parseRoute } from './navigation';

function EmployeeDashboard() {
  const { employees, loading, error, createEmployee, updateEmployee, deleteEmployee, resetEmployeeData } = useEmployees();
  const { role, setRole, canManageEmployees } = useSession();
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState<'All' | EmployeeStatus>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const departments = useMemo(
    () => ['All', ...Array.from(new Set(employees.map((employee) => employee.department)))],
    [employees],
  );

  const visibleEmployees = useMemo(
    () => filterEmployees(employees, search, department, status),
    [employees, search, department, status],
  );

  const stats = useMemo(() => getEmployeeStats(employees), [employees]);
  const editingEmployee = employees.find((employee) => employee.id === editingEmployeeId);
  const selectedEmployee = route.name === 'employee'
    ? employees.find((employee) => employee.id === route.employeeId)
    : undefined;

  function navigate(path: string) {
    window.history.pushState({}, '', path);
    setRoute(parseRoute(path));
  }

  function openCreateForm() {
    if (!canManageEmployees) return;
    setEditingEmployeeId(null);
    setIsFormOpen(true);
  }

  function openEditForm(employee: Employee) {
    if (!canManageEmployees) return;
    setEditingEmployeeId(employee.id);
    setIsFormOpen(true);
  }

  async function saveEmployee(employee: Employee) {
    if (!canManageEmployees) return;
    if (editingEmployeeId) {
      await updateEmployee(employee.id, {
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
      });
    } else {
      await createEmployee(employee);
    }
  }

  async function removeEmployee(employee: Employee) {
    if (!canManageEmployees) return;
    if (!window.confirm(`Delete ${employee.name}? This action cannot be undone.`)) return;
    await deleteEmployee(employee.id);
    if (route.name === 'employee' && route.employeeId === employee.id) navigate('/employees');
    if (editingEmployeeId === employee.id) setEditingEmployeeId(null);
  }

  if (loading) {
    return <main className="state-screen"><p>Loading employees…</p></main>;
  }

  if (error) {
    return (
      <main className="state-screen" role="alert">
        <h1>Employee data needs attention</h1>
        <p>{error}</p>
        <button className="primary-button" type="button" onClick={() => void resetEmployeeData()}>
          Reset employee data
        </button>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">N</div>
        <div>
          <strong>Northstar HR</strong>
          <span>Employee workspace</span>
        </div>
        <nav aria-label="Primary navigation">
          <button className="nav-item nav-item-active" type="button" onClick={() => navigate('/employees')}>Employees</button>
          <button className="nav-item" type="button" disabled>Attendance</button>
          <button className="nav-item" type="button" disabled>Reports</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="eyebrow">People operations</p>
            <h1>Employee management</h1>
            <p className="page-subtitle">
              {canManageEmployees ? 'Admin workspace with employee management access.' : 'Read-only employee view.'}
            </p>
          </div>
          <div className="header-actions">
            <label className="role-switcher">
              Preview role
              <select value={role} onChange={(event) => setRole(event.target.value as DemoRole)}>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
            </label>
            {canManageEmployees && (
              <button className="primary-button" type="button" onClick={openCreateForm}>
                + Add employee
              </button>
            )}
          </div>
        </header>

        {route.name === 'employee' && selectedEmployee ? (
          <section className="panel employee-details">
            <div className="details-heading">
              <div>
                <p className="eyebrow">Employee details</p>
                <h2>{selectedEmployee.name}</h2>
                <p>{selectedEmployee.role} · {selectedEmployee.department}</p>
              </div>
              <div className="details-actions">
                <button className="secondary-button" type="button" onClick={() => navigate('/employees')}>Back to directory</button>
                {canManageEmployees && (
                  <>
                    <button className="primary-button" type="button" onClick={() => openEditForm(selectedEmployee)}>Edit employee</button>
                    <button className="danger-button" type="button" onClick={() => void removeEmployee(selectedEmployee)}>Delete employee</button>
                  </>
                )}
              </div>
            </div>
            <dl className="details-grid">
              <div><dt>Employee ID</dt><dd>{selectedEmployee.id}</dd></div>
              <div><dt>Email</dt><dd>{selectedEmployee.email}</dd></div>
              <div><dt>Status</dt><dd>{selectedEmployee.status}</dd></div>
              <div><dt>Joined</dt><dd>{new Date(selectedEmployee.joinedAt).toLocaleDateString()}</dd></div>
            </dl>
            <PerformanceReviews employeeId={selectedEmployee.id} canManage={canManageEmployees} />
          </section>
        ) : route.name === 'employee' ? (
          <section className="panel employee-details">
            <p className="eyebrow">Employee details</p>
            <h2>Employee not found</h2>
            <p>No employee matches ID {route.employeeId}.</p>
            <button className="primary-button" type="button" onClick={() => navigate('/employees')}>
              Back to directory
            </button>
          </section>
        ) : route.name === 'not-found' ? (
          <section className="panel employee-details">
            <p className="eyebrow">Navigation</p>
            <h2>Page not found</h2>
            <p>The requested page does not exist.</p>
            <button className="primary-button" type="button" onClick={() => navigate('/employees')}>
              Go to employees
            </button>
          </section>
        ) : (
          <>
            <StatsCards {...stats} />
            <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Team directory</h2>
              <p>{visibleEmployees.length} of {employees.length} employees</p>
            </div>
            <div className="filters">
              <input
                aria-label="Search employees"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email or role"
              />
              <select aria-label="Filter by department" value={department} onChange={(event) => setDepartment(event.target.value)}>
                {departments.map((option) => <option key={option}>{option}</option>)}
              </select>
              <select
                aria-label="Filter by status"
                value={status}
                onChange={(event) => setStatus(event.target.value as 'All' | EmployeeStatus)}
              >
                <option>All</option>
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

              <EmployeeTable
                employees={visibleEmployees}
                canManage={canManageEmployees}
                onView={(employee) => navigate(employeePath(employee.id))}
                onEdit={openEditForm}
                onDelete={(employee) => void removeEmployee(employee)}
                onStatusChange={(employee, nextStatus) => void updateEmployee(employee.id, { status: nextStatus })}
              />
            </section>
          </>
        )}
      </main>

      {isFormOpen && (
        <EmployeeForm
          employee={editingEmployee}
          existingEmails={employees.filter((employee) => employee.id !== editingEmployeeId).map((employee) => employee.email)}
          onAdd={saveEmployee}
          onClose={() => { setIsFormOpen(false); setEditingEmployeeId(null); }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <SessionProvider>
      <EmployeesProvider>
        <ReviewsProvider>
          <EmployeeDashboard />
        </ReviewsProvider>
      </EmployeesProvider>
    </SessionProvider>
  );
}

export default App;
