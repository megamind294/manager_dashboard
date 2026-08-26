import React from 'react';
import type { Employee, EmployeeStatus } from './types';

interface EmployeeTableProps {
  employees: Employee[];
  canManage?: boolean;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onStatusChange: (employee: Employee, status: EmployeeStatus) => void;
}

export default function EmployeeTable({
  employees,
  canManage = true,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: EmployeeTableProps) {
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
            <th>Actions</th>
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
                {canManage ? (
                  <select
                    className={`status-select status-${employee.status.toLowerCase().replace(' ', '-')}`}
                    aria-label={`Change status for ${employee.name}`}
                    value={employee.status}
                    onChange={(event) => onStatusChange(employee, event.target.value as EmployeeStatus)}
                  >
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Inactive</option>
                  </select>
                ) : (
                  <span className={`status status-${employee.status.toLowerCase().replace(' ', '-')}`}>
                    {employee.status}
                  </span>
                )}
              </td>
              <td>{new Date(employee.joinedAt).toLocaleDateString()}</td>
              <td>
                <div className="row-actions">
                  <button type="button" onClick={() => onView(employee)} aria-label={`View ${employee.name}`}>View</button>
                  {canManage && (
                    <>
                      <button type="button" onClick={() => onEdit(employee)} aria-label={`Edit ${employee.name}`}>Edit</button>
                      <button className="danger-link" type="button" onClick={() => onDelete(employee)} aria-label={`Delete ${employee.name}`}>Delete</button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
