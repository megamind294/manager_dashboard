import React, { FormEvent, useState } from 'react';
import type { Employee } from './types';

interface EmployeeFormProps {
  employee?: Employee;
  existingEmails?: string[];
  onAdd: (employee: Employee) => void | Promise<unknown>;
  onClose: () => void;
}

const initialForm = {
  name: '',
  email: '',
  role: '',
  department: 'Engineering',
};

export default function EmployeeForm({ employee, existingEmails = [], onAdd, onClose }: EmployeeFormProps) {
  const [form, setForm] = useState(() => employee ? {
    name: employee.name,
    email: employee.email,
    role: employee.role,
    department: employee.department,
  } : initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.values(form).map((value) => value.trim());

    if (values.some((value) => !value)) {
      setError('Please complete all fields.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Enter a valid email address.');
      return;
    }

    if (existingEmails.some((email) => email.trim().toLowerCase() === form.email.trim().toLowerCase())) {
      setError('An employee with this email already exists.');
      return;
    }

    setSubmitting(true);
    try {
      await onAdd({
        id: employee?.id ?? `EMP-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role.trim(),
        department: form.department,
        status: employee?.status ?? 'Active',
        joinedAt: employee?.joinedAt ?? new Date().toISOString().slice(0, 10),
      });
      setForm(initialForm);
      setError('');
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Employee could not be saved.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="employee-form-card" role="dialog" aria-modal="true" aria-labelledby="add-employee-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="form-heading">
          <div>
            <p className="eyebrow">{employee ? 'Employee profile' : 'New team member'}</p>
            <h2 id="add-employee-title">{employee ? 'Edit employee' : 'Add employee'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close form">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Full name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Priya Sharma" />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="priya@company.com" />
          </label>
          <label>
            Role
            <input value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="Frontend Engineer" />
          </label>
          <label>
            Department
            <select value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })}>
              <option>Engineering</option>
              <option>Design</option>
              <option>People</option>
              <option>Quality</option>
              <option>Product</option>
            </select>
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
            <button className="primary-button" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : employee ? 'Save changes' : 'Add employee'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
