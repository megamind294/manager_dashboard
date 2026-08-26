import React from 'react';
import type { Employee } from '../employees/types';
import { usePayroll } from '../payroll/PayrollProvider';
import { useReviews } from '../reviews/ReviewsProvider';
import { getWorkforceAnalytics } from './workforceAnalytics';
import { useActivity } from '../activity/ActivityProvider';

const money = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export default function WorkforceInsights({ employees }: { employees: Employee[] }) {
  const { reviews, loading: reviewsLoading, error: reviewsError, resetReviews } = useReviews();
  const { payroll, loading: payrollLoading, error: payrollError, resetPayroll } = usePayroll();
  const { recordActivity } = useActivity();
  async function recoverInsights() {
    const failingSources = [reviewsError ? 'reviews' : null, payrollError ? 'payroll' : null].filter(Boolean);
    await recordActivity({ actor: 'Admin', action: 'Requested insight data recovery', subject: failingSources.join(' and ') });
    const recoveries: Promise<void>[] = [];
    if (reviewsError) recoveries.push(resetReviews());
    if (payrollError) recoveries.push(resetPayroll());
    await Promise.all(recoveries);
  }
  if (reviewsLoading || payrollLoading) {
    return <section className="insight-panel"><p className="muted-state">Calculating workforce insights…</p></section>;
  }
  if (reviewsError || payrollError) {
    return (
      <section className="insight-panel" role="alert">
        <div className="section-heading"><div><p className="eyebrow">Live state</p><h2>Workforce insights unavailable</h2></div></div>
        <p>{reviewsError || payrollError}</p>
        <button className="secondary-button" type="button" onClick={() => { void recoverInsights().catch(() => undefined); }}>Recover insight data</button>
      </section>
    );
  }
  const metrics = getWorkforceAnalytics(employees, reviews, payroll);
  return (
    <section className="insight-panel" aria-labelledby="workforce-insights-heading">
      <div className="section-heading"><div><p className="eyebrow">Live state</p><h2 id="workforce-insights-heading">Workforce insights</h2></div><span>Derived, not hard-coded</span></div>
      <div className="insight-grid">
        <article><span>Published review coverage</span><strong>{metrics.publishedReviewRate}%</strong></article>
        <article><span>Current payroll total</span><strong>{metrics.payrollCurrency} {money.format(metrics.currentPayrollTotal)}</strong></article>
        <article><span>Active workforce</span><strong>{metrics.activeEmployees} / {metrics.headcount}</strong></article>
        <article><span>On leave</span><strong>{metrics.employeesOnLeave}</strong></article>
      </div>
    </section>
  );
}
