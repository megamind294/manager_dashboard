# Employee Management Day 2 Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a tested asynchronous LocalStorage persistence boundary for employee CRUD and recovery.

**Architecture:** Keep browser storage behind a factory-created service so tests can exercise the real serialization and mutation behavior with an in-memory Storage implementation. The service initializes missing storage from immutable seed data, rejects malformed data with a typed error, and only writes through explicit CRUD or reset operations.

**Tech Stack:** React 18, TypeScript 4.9, Jest, browser Storage API.

**Spec:** `docs/superpowers/specs/2026-08-23-employee-management-day2-design.md`

## Global Constraints

- Use storage key `northstar-hr-employees`.
- Keep all public service methods Promise-based.
- Missing storage initializes from Day 1 seed employees.
- Malformed data is never overwritten silently.
- Reset explicitly restores seed employees.
- Preserve employee IDs and join dates during updates.

---

### Task 1: Define the persistence contract with failing tests

**Files:**
- Create: `src/features/employees/employeeService.test.ts`
- Create: `src/features/employees/employeeService.ts`

**Interfaces:**
- Consumes: `Employee`, `seedEmployees`, browser-compatible `Storage`.
- Produces: `EmployeeDataError`, `createEmployeeService(storage)`, and `employeeService`.

- [ ] Write tests for seed initialization, authoritative saved data, malformed data, create, update, delete, and reset.
- [ ] Run `CI=true npm test -- --watchAll=false src/features/employees/employeeService.test.ts` and confirm RED because the service module is missing.

### Task 2: Implement the minimal LocalStorage service

**Files:**
- Create: `src/features/employees/employeeService.ts`

**Interfaces:**
- Produces: `listEmployees()`, `getEmployee(id)`, `createEmployee(input)`, `updateEmployee(id, updates)`, `deleteEmployee(id)`, and `resetEmployeeData()`.

- [ ] Parse and validate stored employee arrays without mutating storage on errors.
- [ ] Clone returned employee records so callers cannot mutate service state by reference.
- [ ] Persist successful CRUD mutations and reject unknown IDs with `EmployeeDataError`.
- [ ] Run the targeted test and confirm GREEN.

### Task 3: Verify and deliver

**Files:**
- Modify: `PROJECT_STATUS.md`

**Interfaces:**
- Produces: an accurate resume point for the next automated run.

- [ ] Run the complete test suite.
- [ ] Run `npm run build`.
- [ ] Review the diff for unrelated changes.
- [ ] Commit and push the verified milestone to `feature/employee-management-day2`.
