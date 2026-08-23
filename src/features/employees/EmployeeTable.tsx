import React from 'react';
import type { Employee } from './types';

interface EmployeeTableProps {
  employees: Employee[];
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  if (employees.length === 0) {
    return <div className="empty-state">No employees match your filters.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Role</th>
            <th>Department</th>
            <th>Status</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <div className="employee-name">{employee.name}</div>
                <div className="employee-email">{employee.email}</div>
              </td>
              <td>{employee.role}</td>
              <td>{employee.department}</td>
              <td>
                <span className={`status status-${employee.status.toLowerCase().replace(' ', '-')}`}>
                  {employee.status}
                </span>
              </td>
              <td>{new Date(employee.joinedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
