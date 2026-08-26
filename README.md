# Northstar HR — Employee Management Dashboard

A React + TypeScript employee-management project built as a staged portfolio project.

## Day 1 — Basic

Day 1 focuses on a clean frontend foundation:

- Employee dashboard with summary metrics
- Search by employee name, email, role, or department
- Department filtering
- Responsive employee directory table
- Employee status badges
- Add-employee form with required-field and email validation
- Local React state only — no backend yet
- Unit tests for employee filtering/statistics
- App smoke test

## Day 2 — Standard (complete)

Day 2 adds the application data boundary and standard HR safeguards:

- Promise-based LocalStorage employee service with typed recovery errors
- Provider-backed loading, reset, create, update, and delete state
- Persistent employee creation across reloads
- Search plus department and status filters
- Case-insensitive duplicate-email protection in the UI and service layer
- Reusable create/edit form that preserves employee IDs and join dates
- Employee detail view with back navigation
- URL-backed `/employees` and `/employees/:employeeId` navigation
- Browser back/forward support and recoverable not-found views
- Per-employee edit, status-change, and delete controls
- Confirmation before destructive deletion
- 31 automated tests covering utilities, persistence, recovery, provider mutations, forms, actions, details, and routing

## Tech stack

- React 18
- TypeScript
- Create React App
- React Testing Library / Jest
- Browser History API routing
- CSS

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Test

```bash
CI=true npm test -- --watchAll=false
```

## Production build

```bash
npm run build
```

## Roadmap

### Day 2 — Standard

Completed and merged to `main` through pull request #2 after tests and the production build passed in GitHub Actions.

### Day 3 — Advanced

In progress on `feature/employee-management-day3`:

- Typed Admin and Employee demo sessions
- Permission-aware employee management controls
- Read-only Employee directory and profile experience
- Guarded mutation entry points
- Explicit documentation that the role preview is not production authentication
- Typed LocalStorage performance-review service
- Seeded review records with employee lookup, create, and update operations
- Review rating and duplicate employee/period validation
- Explicit malformed-data recovery through reset

The suite now contains 44 tests. Next: connect performance reviews to the role-aware UI, then add payroll summaries, activity history, workforce analytics, and deployment readiness.

## Delivery

Day 1 and Day 2 are merged into `main`. Day 3 will continue on its own feature branch.
