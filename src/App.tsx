import React, { useMemo, useState } from 'react';
import './App.css';
import EmployeeForm from './features/employees/EmployeeForm';
import EmployeeTable from './features/employees/EmployeeTable';
import { EmployeesProvider, useEmployees } from './features/employees/EmployeesProvider';
import StatsCards from './features/employees/StatsCards';
import { filterEmployees, getEmployeeStats } from './features/employees/employeeUtils';
import type { Employee, EmployeeStatus } from './features/employees/types';

function EmployeeDashboard() {
  const { employees, loading, error, createEmployee, updateEmployee, deleteEmployee, resetEmployeeData } = useEmployees();
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState<'All' | EmployeeStatus>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

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
  const selectedEmployee = employees.find((employee) => employee.id === selectedEmployeeId);

  function openCreateForm() {
    setEditingEmployeeId(null);
    setIsFormOpen(true);
  }

  function openEditForm(employee: Employee) {
    setEditingEmployeeId(employee.id);
    setIsFormOpen(true);
  }

  async function saveEmployee(employee: Employee) {
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
    if (!window.confirm(`Delete ${employee.name}? This action cannot be undone.`)) return;
    await deleteEmployee(employee.id);
    if (selectedEmployeeId === employee.id) setSelectedEmployeeId(null);
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
          <button className="nav-item nav-item-active" type="button">Employees</button>
          <button className="nav-item" type="button" disabled>Attendance</button>
          <button className="nav-item" type="button" disabled>Reports</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="eyebrow">People operations</p>
            <h1>Employee management</h1>
            <p className="page-subtitle">A persistent Day 2 workspace for managing your team.</p>
          </div>
          <button className="primary-button" type="button" onClick={openCreateForm}>
            + Add employee
          </button>
        </header>

        {selectedEmployee ? (
          <section className="panel employee-details">
            <div className="details-heading">
              <div>
                <p className="eyebrow">Employee details</p>
                <h2>{selectedEmployee.name}</h2>
                <p>{selectedEmployee.role} · {selectedEmployee.department}</p>
              </div>
              <div className="details-actions">
                <button className="secondary-button" type="button" onClick={() => setSelectedEmployeeId(null)}>Back to directory</button>
                <button className="primary-button" type="button" onClick={() => openEditForm(selectedEmployee)}>Edit employee</button>
                <button className="danger-button" type="button" onClick={() => void removeEmployee(selectedEmployee)}>Delete employee</button>
              </div>
            </div>
            <dl className="details-grid">
              <div><dt>Employee ID</dt><dd>{selectedEmployee.id}</dd></div>
              <div><dt>Email</dt><dd>{selectedEmployee.email}</dd></div>
              <div><dt>Status</dt><dd>{selectedEmployee.status}</dd></div>
              <div><dt>Joined</dt><dd>{new Date(selectedEmployee.joinedAt).toLocaleDateString()}</dd></div>
            </dl>
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
                onView={(employee) => setSelectedEmployeeId(employee.id)}
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
    <EmployeesProvider>
      <EmployeeDashboard />
    </EmployeesProvider>
  );
}

export default App;
