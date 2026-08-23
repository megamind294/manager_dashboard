# Employee Management Day 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a basic portfolio-ready employee-management dashboard using React 18 and TypeScript.

**Architecture:** Keep employee concerns isolated under `src/features/employees`, use typed local data and pure utility functions, and let `App.tsx` own Day 1 state. CSS remains dependency-light and the existing backend-free CRA setup stays intact.

**Tech Stack:** React 18, TypeScript, Create React App, Jest/React Testing Library, CSS.

**Spec:** `docs/superpowers/specs/2026-08-23-employee-management-day1-design.md`

## Global Constraints

- Frontend-only Day 1.
- No authentication, API, database, payroll, permissions, or persistence.
- React 18 + TypeScript.
- Search and department filtering must work from local state.
- Adding an employee must update local state after validation.

---

### Task 1: Employee domain utilities

**Files:**
- Create: `src/features/employees/types.ts`
- Create: `src/features/employees/data.ts`
- Create: `src/features/employees/employeeUtils.ts`
- Test: `src/features/employees/employeeUtils.test.ts`

**Interfaces:**
- Produces: `Employee`, `EmployeeStatus`, `filterEmployees()`, `getEmployeeStats()`, `seedEmployees`.

- [ ] Write failing tests for search, department filtering, and status summary counts.
- [ ] Run the targeted tests and confirm RED.
- [ ] Implement typed models, seed data, and the minimal utility functions.
- [ ] Run the targeted tests and confirm GREEN.
- [ ] Commit the feature utilities.

### Task 2: Dashboard UI and local add flow

**Files:**
- Create: `src/App.tsx`
- Create: `src/features/employees/EmployeeTable.tsx`
- Create: `src/features/employees/EmployeeForm.tsx`
- Create: `src/features/employees/StatsCards.tsx`
- Modify: `src/App.css`
- Modify: `src/index.css`
- Modify: `package.json`
- Test: `src/App.test.js`

**Interfaces:**
- Consumes: employee utilities and models from Task 1.
- Produces: searchable/filterable dashboard and local-state employee creation flow.

- [ ] Update the smoke test to expect the Day 1 dashboard heading.
- [ ] Run the smoke test and confirm RED.
- [ ] Add TypeScript dependencies/configuration and implement the dashboard components.
- [ ] Run tests and confirm GREEN.
- [ ] Run a production build and fix any TypeScript/build errors.
- [ ] Commit the Day 1 UI.

### Task 3: Documentation and review

**Files:**
- Modify: `README.md`

**Interfaces:**
- Produces: setup instructions, Day 1 feature list, and Day 2/Day 3 roadmap.

- [ ] Replace the default CRA README with project-specific documentation.
- [ ] Run the full test suite and production build again.
- [ ] Review the branch diff for accidental unrelated changes.
- [ ] Open a pull request into `main`.