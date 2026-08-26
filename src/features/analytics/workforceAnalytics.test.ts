import { seedEmployees } from '../employees/data';
import { seedPayrollRecords } from '../payroll/payrollService';
import { seedReviews } from '../reviews/reviewService';
import { getWorkforceAnalytics } from './workforceAnalytics';

test('derives workforce metrics from employee, review, and payroll state', () => {
  const metrics = getWorkforceAnalytics(seedEmployees, seedReviews, seedPayrollRecords);

  expect(metrics).toEqual({
    headcount: 5,
    activeEmployees: 3,
    employeesOnLeave: 1,
    publishedReviewRate: 40,
    currentPayrollTotal: 32150,
    payrollCurrency: 'PLN',
  });
});

test('returns zero-safe metrics for empty application state', () => {
  expect(getWorkforceAnalytics([], [], [])).toEqual({
    headcount: 0,
    activeEmployees: 0,
    employeesOnLeave: 0,
    publishedReviewRate: 0,
    currentPayrollTotal: 0,
    payrollCurrency: 'PLN',
  });
});

test('excludes reviews and payroll belonging to employees no longer in state', () => {
  const metrics = getWorkforceAnalytics(
    seedEmployees.filter((employee) => employee.id === 'EMP-001'),
    seedReviews,
    seedPayrollRecords,
  );

  expect(metrics.publishedReviewRate).toBe(100);
  expect(metrics.currentPayrollTotal).toBe(10500);
});
