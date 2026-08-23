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

Planned direction: richer employee CRUD, routing, persistence/API integration, improved forms and filters, and stronger component structure.

### Day 3 — Advanced

Planned direction: authentication/roles, analytics, advanced HR workflows, production-level polish, and deployment readiness.

## Branch

Day 1 work is developed on `feature/employee-management-day1` before merging into `main`.
