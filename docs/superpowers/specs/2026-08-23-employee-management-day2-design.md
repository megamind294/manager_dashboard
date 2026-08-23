# Employee Management Dashboard — Day 2 Design

## Goal

Day 2 upgrades the Day 1 employee-management dashboard from a single-screen, in-memory demo into a standard portfolio-grade React + TypeScript application with navigation, full employee CRUD, persistent client-side data, richer filtering, and cleaner feature boundaries.

The goal is to improve architecture and product realism without introducing a real backend or authentication yet. Those remain Day 3 concerns.

## Scope

Day 2 includes:

- React Router based navigation
- Dashboard, Employees, and Employee Details screens
- Create, read, update, and delete employee flows
- Status changes for Active, On Leave, and Inactive
- One reusable employee form for both create and edit
- Search plus department and status filtering
- LocalStorage-backed persistence through a dedicated service layer
- Seed data only when no stored employee dataset exists
- Delete confirmation before destructive actions
- Loading and recoverable error states around employee data operations
- Expanded tests for CRUD, persistence, filters, and navigation
- Updated README and Day 2 documentation

## Non-goals

Day 2 will not add:

- Express, FastAPI, or another real backend
- Database persistence
- Authentication or authorization
- Role-based access control
- Payroll, leave approvals, attendance workflows, or advanced HR processes
- Production deployment infrastructure

These remain available for Day 3 so the project continues to show a realistic progression from basic to standard to advanced.

## Architecture

The application will move away from `App.tsx` owning all employee state directly.

`App.tsx` will become the application shell and routing entry point. Employee state and persistence will live behind an employee data layer so page components are responsible for presentation and user interaction rather than storage details.

Planned boundaries:

- `src/app/` — application shell, provider composition, and route configuration
- `src/pages/` — route-level pages
- `src/features/employees/` — employee domain components, types, utilities, and forms
- `src/features/employees/services/employeeService.ts` — storage abstraction for employee CRUD
- `src/features/employees/context/EmployeesProvider.tsx` — shared employee collection, loading/error state, and mutation actions
- `src/features/employees/hooks/useEmployees.ts` — typed hook for consuming `EmployeesProvider`

The service interface will be intentionally API-shaped so LocalStorage can be replaced by an HTTP implementation later without rewriting the UI.

## Routes

Day 2 will use the following routes:

- `/` — Dashboard
- `/employees` — Employee directory
- `/employees/:employeeId` — Employee details

Unknown routes will render a simple not-found view with navigation back to the dashboard.

## Dashboard

The dashboard will remain lightweight and focused on summary information.

It will show:

- Total employees
- Active employees
- Employees on leave
- Inactive employees
- Department count
- A recent-employees section linking to employee details
- A clear action to open the full employee directory

Recent employees will be derived by sorting by `joinedAt` descending and taking the first five records.

The existing Day 1 stats logic will be reused where appropriate rather than duplicated.

## Employee Directory

The Employees screen will contain the primary management experience.

It will support:

- Search by name, email, role, or department
- Department filter
- Status filter
- Add employee action
- Edit action
- Delete action
- Status-change action
- Navigation to employee details

The existing table will be extended with an Actions column rather than replaced with a completely different interaction model.

Search and filter matching will be case-insensitive. Department and status filters will default to `All`.

## Employee Details

The details screen will show one employee with:

- Name
- Email
- Role
- Department
- Status
- Join date
- Employee ID

It will provide Edit, Delete, and status-change actions and a route back to the directory.

If the employee ID does not exist, the page will render a clear employee-not-found state rather than failing silently.

## Reusable Employee Form

`EmployeeForm` will be refactored into a create/edit form.

It will accept an optional employee value. When no employee is supplied, it creates a new employee with status `Active` and the current date as `joinedAt`. When an employee is supplied, it edits that record while preserving the employee ID and original join date.

Editable fields will be:

- Full name
- Email
- Role
- Department

Status changes will remain a separate explicit action rather than being mixed into the general profile form.

Validation will include:

- Required name
- Required role
- Required department
- Valid email format
- Duplicate email prevention using case-insensitive comparison against all other employee records

The form will keep user-entered values visible when validation fails.

## Employee Service

The service layer will expose asynchronous methods even though LocalStorage itself is synchronous:

- `listEmployees()`
- `getEmployee(id)`
- `createEmployee(input)`
- `updateEmployee(id, updates)`
- `deleteEmployee(id)`

Using Promise-based methods gives the UI realistic loading/error behavior and keeps the contract compatible with a future backend.

Storage key: `northstar-hr-employees`.

On first load only, if the storage key is missing, the service will initialize it from the current Day 1 seed employees. After that point, stored data is authoritative.

If stored JSON is malformed or LocalStorage access throws, the service will return a typed data error. The UI will show an error panel with a `Reset employee data` action. Resetting explicitly replaces the stored dataset with the Day 1 seed employees and reloads employee state; malformed data will never be overwritten silently.

## State and Data Flow

`EmployeesProvider` will own the in-browser employee collection and expose:

- `employees`
- `loading`
- `error`
- `refresh()`
- `resetEmployeeData()`
- `createEmployee()`
- `updateEmployee()`
- `deleteEmployee()`

Status changes will call `updateEmployee()` with a new `status` value.

All route-level pages will consume this shared state through `useEmployees()`. Mutations will persist through `employeeService` first and update React state only after the service succeeds.

Filtering remains derived state and will not be persisted.

## Error Handling

Day 2 error behavior will be explicit but lightweight.

The UI will show:

- Initial loading state while employee data is read
- Recoverable storage error state with explicit reset action
- Inline validation errors in forms
- Employee-not-found state for invalid detail routes
- Confirmation dialog before deletion

A destructive delete will not happen from a single accidental click.

Service mutation failures will leave the current React collection unchanged and surface an error message instead of pretending the operation succeeded.

## Styling and UX

The existing Northstar HR visual direction will be preserved.

Day 2 will extend the current responsive layout rather than redesigning the whole application. Navigation will become functional, page spacing and actions will remain consistent, and tables/forms will continue to work on smaller screens.

Accessibility basics will be maintained:

- Labels for form controls
- Buttons instead of clickable non-interactive elements
- Meaningful dialog titles
- Clear focusable actions
- Descriptive empty and error states

## Testing Strategy

Day 2 will expand the existing Jest and React Testing Library coverage.

Tests will cover:

- Employee service initialization from seed data
- LocalStorage read/write behavior
- Malformed-storage error handling and explicit reset
- Create employee
- Update employee
- Status change through update
- Delete employee
- Case-insensitive duplicate email validation
- Search plus department/status filtering
- Route rendering
- Employee details lookup
- Employee-not-found state
- Key user flows for create and edit

The existing Day 1 utility tests will be retained unless a refactor makes a direct replacement more appropriate.

## Dependencies

Add `react-router-dom` for routing.

No additional state-management library will be introduced on Day 2. React context, state, and hooks are sufficient for this scope and avoid unnecessary complexity.

## Branch and Delivery

Development branch:

`feature/employee-management-day2`

Implementation will be completed with tests and a production build check before opening a pull request to `main`.

The README will be updated so Day 1 is marked complete, Day 2 describes the implemented standard feature set, and Day 3 remains the advanced roadmap.

## Day 3 Boundary

Day 3 can build on the Day 2 service contract by replacing or extending LocalStorage with a real backend and adding authentication, authorization, analytics, advanced HR workflows, and deployment readiness.

This keeps the three-day portfolio progression clear:

- Day 1: functional frontend foundation
- Day 2: standard application architecture and CRUD
- Day 3: production-oriented full-stack and advanced capabilities
