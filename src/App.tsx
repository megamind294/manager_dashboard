import React, { useMemo, useState } from 'react';
import './App.css';
import { seedEmployees } from './features/employees/data';
import EmployeeForm from './features/employees/EmployeeForm';
import EmployeeTable from './features/employees/EmployeeTable';
import StatsCards from './features/employees/StatsCards';
import { filterEmployees, getEmployeeStats } from './features/employees/employeeUtils';
import type { Employee } from './features/employees/types';

function App() {
  const [employees, setEmployees] = useState<Employee[]>(seedEmployees);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const departments = useMemo(
    () => ['All', ...Array.from(new Set(employees.map((employee) => employee.department)))],
    [employees],
  );

  const visibleEmployees = useMemo(
    () => filterEmployees(employees, search, department),
    [employees, search, department],
  );

  const stats = useMemo(() => getEmployeeStats(employees), [employees]);

  function addEmployee(employee: Employee) {
    setEmployees((current) => [employee, ...current]);
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
            <p className="page-subtitle">A simple Day 1 workspace for managing your team.</p>
          </div>
          <button className="primary-button" type="button" onClick={() => setIsFormOpen(true)}>
            + Add employee
          </button>
        </header>

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
            </div>
          </div>

          <EmployeeTable employees={visibleEmployees} />
        </section>
      </main>

      {isFormOpen && <EmployeeForm onAdd={addEmployee} onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}

export default App;
