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

## Day 2 — Standard (in progress)

The current feature branch adds the application data boundary and standard HR safeguards:

- Promise-based LocalStorage employee service with typed recovery errors
- Provider-backed loading, reset, create, update, and delete state
- Persistent employee creation across reloads
- Search plus department and status filters
- Case-insensitive duplicate-email protection in the UI and service layer
- 20 automated tests covering utilities, persistence, recovery, provider mutations, and forms

## Tech stack

- React 18
- TypeScript
- Create React App
- React Testing Library / Jest
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

Remaining work: reusable create/edit UI, employee details routing, employee actions, delete confirmation, final documentation, and pull-request verification.

### Day 3 — Advanced

Planned direction: authentication/roles, analytics, advanced HR workflows, production-level polish, and deployment readiness.

## Branch

Day 2 work is developed on `feature/employee-management-day2` before merging into `main`.
