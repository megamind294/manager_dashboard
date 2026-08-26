# Employee Management Dashboard — Day 3 Design

## Goal

Day 3 turns Northstar HR into an advanced portfolio case study with distinct admin and employee experiences, performance workflows, payroll visibility, activity history, analytics, and deployment-ready documentation.

The work remains honest about its architecture. The current role switcher demonstrates authorization-aware UI behavior; it is not production authentication. Real identity verification requires a backend or external identity provider and is outside the client-only milestone.

## Delivery milestones

### 1. Role-aware workspace

- Add a typed demo session provider with Admin and Employee roles.
- Keep employee-management mutations available only in the Admin interface.
- Render status and directory data read-only for Employee sessions.
- Protect mutation handlers as well as hiding unavailable controls.
- Cover role and permission behavior with component tests.

### 2. Performance reviews

- Add typed review records with rating, period, goals, feedback, and status.
- Let Admin create and update reviews.
- Let Employee sessions view published review information without management controls.
- Persist review data behind an asynchronous LocalStorage service matching the employee-service pattern.

### 3. Payroll and activity history

- Add employee compensation summaries and pay-period records using portfolio-safe sample data.
- Restrict full payroll visibility to Admin; Employee sessions see only the selected demo employee.
- Record meaningful employee, review, and payroll mutations in an immutable activity feed.

### 4. Analytics and delivery

- Add derived workforce metrics for headcount, status distribution, review completion, and payroll totals.
- Add accessible empty, error, and permission-denied states.
- Expand tests and CI coverage, complete the README, and merge Day 3 only after tests and the production build pass.

## Data and permissions

Employee, review, payroll, and activity records remain separate domain models with dedicated asynchronous service boundaries. React providers expose loading, error, and mutation state. Permission checks happen at the interface boundary and inside mutation entry points so read-only sessions cannot trigger management behavior through rendered controls.

Admin can manage employees, reviews, payroll records, and activity. Employee is read-only and limited to employee-safe views. The first milestone uses a visible role preview control so reviewers can inspect both experiences without credentials.

## Testing strategy

Each behavior follows a red-green-refactor cycle. Tests cover session state, permission decisions, hidden and read-only controls, protected mutation handlers, service persistence, role-specific views, analytics derivation, and recovery paths. The complete Jest suite and production build must pass before every Day 3 pull request is merged.

## Completion criteria

- Admin and Employee experiences are visibly distinct and tested.
- Performance reviews and payroll summaries use typed, persistent data boundaries.
- Activity history records meaningful mutations.
- Advanced workforce metrics are derived from real application state.
- Documentation accurately distinguishes demo authorization from production authentication.
- Full tests and the production build pass in GitHub Actions.
- The Day 3 pull request is merged into `main`.
