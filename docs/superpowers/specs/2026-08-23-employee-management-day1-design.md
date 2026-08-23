# Employee Management — Day 1 Design

## Goal
Turn the existing React manager dashboard into the first stage of a portfolio-ready employee management application.

## Scope
Day 1 is frontend-only and intentionally basic. It provides a responsive HR dashboard, employee summary metrics, employee search/filtering, a table of sample employees, and a local-state form for adding an employee. No authentication, API, database, payroll, permissions, or persistence is included yet.

## Architecture
Use React 18 with TypeScript. Employee-specific code lives under `src/features/employees` with typed models, seed data, pure filtering/statistics utilities, and UI components. `App.tsx` owns the Day 1 employee state and composes the feature components. Styling stays dependency-light in CSS so later days can evolve the UI without coupling to a component library.

## Data flow
`App.tsx` initializes local employee state from seed data. Search and department filters are controlled UI state. Derived employees and statistics are calculated from pure utilities. The add-employee form emits a typed employee payload to `App.tsx`, which appends it to local state.

## Error handling
The form validates required fields and email format before submission. Empty search/filter results render a clear empty state. Day 1 has no remote errors because it has no API calls.

## Testing
Pure employee utilities receive unit tests for filtering and summary counts. The app receives a smoke test proving the employee dashboard heading renders.

## Day 2 / Day 3 boundaries
Day 2 may add richer CRUD, persistence/API integration, routing, and improved filtering. Day 3 may add authentication/roles, analytics, advanced workflows, and production polish. Those capabilities are deliberately excluded from Day 1.