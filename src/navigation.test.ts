import { employeePath, parseRoute } from './navigation';

describe('employee routes', () => {
  test('parses the employee directory route', () => {
    expect(parseRoute('/employees')).toEqual({ name: 'directory' });
  });

  test('decodes an employee id from a details route', () => {
    expect(parseRoute('/employees/EMP%20001')).toEqual({
      name: 'employee',
      employeeId: 'EMP 001',
    });
  });

  test('treats unknown and incomplete paths as not found', () => {
    expect(parseRoute('/employees/')).toEqual({ name: 'not-found' });
    expect(parseRoute('/reports')).toEqual({ name: 'not-found' });
  });

  test('builds an encoded employee details path', () => {
    expect(employeePath('EMP 001')).toBe('/employees/EMP%20001');
  });
});
