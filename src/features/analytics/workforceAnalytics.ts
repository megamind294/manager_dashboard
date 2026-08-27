import type { Employee } from '../employees/types';
import type { PayrollRecord } from '../payroll/payrollService';
import type { PerformanceReview } from '../reviews/reviewService';

export interface WorkforceAnalytics {
  headcount: number;
  activeEmployees: number;
  employeesOnLeave: number;
  publishedReviewRate: number;
  currentPayrollTotal: number;
  payrollCurrency: 'PLN';
}

export function getWorkforceAnalytics(
  employees: Employee[],
  reviews: PerformanceReview[],
  payroll: PayrollRecord[],
): WorkforceAnalytics {
  const employeeIds = new Set(employees.map((employee) => employee.id));
  const publishedEmployeeIds = new Set(
    reviews
      .filter((review) => review.status === 'Published' && employeeIds.has(review.employeeId))
      .map((review) => review.employeeId),
  );
  const employeePayroll = payroll.filter((record) => employeeIds.has(record.employeeId));
  const currentPeriod = employeePayroll.reduce(
    (latest, record) => (record.period > latest ? record.period : latest),
    '',
  );

  return {
    headcount: employees.length,
    activeEmployees: employees.filter((employee) => employee.status === 'Active').length,
    employeesOnLeave: employees.filter((employee) => employee.status === 'On Leave').length,
    publishedReviewRate: employees.length === 0
      ? 0
      : Math.round((publishedEmployeeIds.size / employees.length) * 100),
    currentPayrollTotal: employeePayroll
      .filter((record) => record.period === currentPeriod)
      .reduce((total, record) => total + record.netPay, 0),
    payrollCurrency: 'PLN',
  };
}
