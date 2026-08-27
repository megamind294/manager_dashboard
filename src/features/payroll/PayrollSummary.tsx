import React from 'react';
import { useActivity } from '../activity/ActivityProvider';
import { runAuditedMutation } from '../activity/auditedMutation';
import { usePayroll } from './PayrollProvider';

const money = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export default function PayrollSummary({ employeeId, employeeName, canManage, sessionEmployeeId }: { employeeId: string; employeeName: string; canManage: boolean; sessionEmployeeId: string }) {
  const { payroll, loading, error, updatePayroll, resetPayroll } = usePayroll();
  const { recordActivity } = useActivity();
  const records = payroll.filter((record) => record.employeeId === employeeId);

  if (!canManage && employeeId !== sessionEmployeeId) {
    return <section className="reviews-section"><p className="eyebrow">Compensation</p><h3>Payroll is private to this employee</h3><p className="muted-state">Employee sessions can view only their own compensation records.</p></section>;
  }

  async function markPaid(id: string, period: string) {
    const previous = records.find((record) => record.id === id);
    if (!previous) return;
    await runAuditedMutation({
      mutate: () => updatePayroll(id, { status: 'Paid', paidAt: new Date().toISOString().slice(0, 10) }),
      audit: () => recordActivity({ actor: 'Admin', action: 'Marked payroll paid', subject: `${employeeName} · ${period}` }),
      rollback: () => updatePayroll(id, { bonus: previous.bonus, deductions: previous.deductions, status: previous.status, paidAt: previous.paidAt }),
    });
  }

  async function recoverPayroll() {
    await recordActivity({ actor: 'Admin', action: 'Requested payroll data recovery', subject: employeeName });
    await resetPayroll();
  }

  return (
    <section className="reviews-section" aria-labelledby="compensation-heading">
      <div className="reviews-heading"><div><p className="eyebrow">Compensation</p><h3 id="compensation-heading">Compensation</h3></div><span>{records.length} pay periods</span></div>
      {loading ? <p className="muted-state">Loading payroll…</p> : error ? (
        <div className="reviews-error" role="alert"><p>{error}</p>{canManage && <button className="secondary-button" type="button" onClick={() => void recoverPayroll()}>Reset payroll data</button>}</div>
      ) : records.length === 0 ? <p className="muted-state">No payroll records available.</p> : (
        <div className="payroll-list">{records.map((record) => (
          <article className="payroll-card" key={record.id}>
            <div><strong>{record.period}</strong><span>{record.status}</span></div>
            <dl><div><dt>Base</dt><dd>PLN {money.format(record.baseSalary)}</dd></div><div><dt>Bonus</dt><dd>PLN {money.format(record.bonus)}</dd></div><div><dt>Net pay</dt><dd>PLN {money.format(record.netPay)}</dd></div></dl>
            {canManage && record.status === 'Scheduled' && <button className="primary-button" type="button" aria-label={`Mark ${record.period} payroll paid`} onClick={() => void markPaid(record.id, record.period)}>Mark paid</button>}
          </article>
        ))}</div>
      )}
    </section>
  );
}
