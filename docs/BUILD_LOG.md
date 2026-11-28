# Build Log

Copy this block for each day.

## Day 0
- Built: Full planning docs — PRD, API spec, Architecture, Build Plan, Design, Backend Readiness Report. Scaffolded folder structure.
- Broke / bugs: Identified schema gap — `applications` table missing `location` column (fixed in schema.sql).
- Learned: `companies` table needs a lookup-or-create pattern since there's no company management UI.
- Tomorrow: Bootstrap server, DB connection, auth routes.
- Post link:

## Day 1
- Built: All 25 backend files across all 4 phases. Full backend implementation complete.
  - Phase 1: package.json, app.js, server.js, src/config/db.js, src/utils/response.js, src/middleware/errorHandler.js, src/routes/index.js
  - Phase 2: auth validator, validate middleware, JWT auth middleware, authService, auth controller, auth routes
  - Phase 3: application validator, applicationService (with lookup-or-create company), noteService, application controller, notes controller, application routes, notes routes
  - Phase 4: statsService (counts, recent activity, upcoming follow-ups), stats controller, stats routes
- Broke / bugs: None — all modules pass syntax check.
- Learned: Separating lookup-or-create company logic into a private service helper keeps controllers clean.
- Tomorrow: Set up MySQL, run schema.sql, start server, test all 12 endpoints in Postman.
- Post link:

## Day 2 — 27 November 2026

- Built / Completed:
  - Installed backend dependencies and configured the local MySQL database.
  - Created the `job_tracker` database and executed `schema.sql`.
  - Configured server environment variables in `server/.env` (excluded from Git).
  - Started the backend successfully on http://localhost:5000.
  - Verified database connectivity and the health endpoint.
  - Tested registration, login, JWT authentication and protected routes.
  - Tested application creation, retrieval, updating, status changes and deletion.
  - Tested notes creation, retrieval and deletion.
  - Verified dashboard statistics and user-specific data isolation.
  - Tested validation, search, filtering, pagination and application deletion cascades.
  - Ran `npm audit fix`; the final audit reported zero vulnerabilities.

- Issues / Bugs Encountered:
  - Application creation initially failed because MySQL DATE columns received ISO timestamp values instead of YYYY-MM-DD.
  - Joi's `.isoDate()` validation converted date-only strings into ISO timestamps.

- Resolutions:
  - Added strict YYYY-MM-DD validation and real calendar-date checking in `applicationValidator.js`.
  - Verified valid dates, leap years, invalid dates and API responses.
  - Confirmed ON DELETE CASCADE removes associated notes and status history when an application is deleted.

- Learnings:
  - MySQL DATE fields and JavaScript date serialization need careful handling.
  - User ownership must be enforced across application, notes and dashboard queries.
  - Foreign-key cascade rules simplify dependent-record cleanup.
  - API testing should cover successful requests and unauthorized or invalid requests.

- Remaining:
  - Frontend implementation and integration.
  - Frontend authentication persistence and logout testing.
  - Deployment and production environment/CORS verification.

- Post link:

## Day 4 — 28 November 2026

- Built / Completed:
  - Started building the React frontend in `client/` (Vite, React Router v6, Tailwind CSS, Axios).
  - Configured the Axios API client (`client/src/api/axios.js`) with JWT Bearer token injection and 401 session cleanup, plus auth helpers (`client/src/api/auth.js`).
  - Implemented `AuthContext` (`client/src/context/AuthContext.jsx`) and `ProtectedRoute` (`client/src/components/ProtectedRoute.jsx`) for session persistence and route guarding via `/api/auth/me`.
  - Completed the **Login** (`client/src/pages/Login.jsx`) and **Register** (`client/src/pages/Register.jsx`) pages matching the Neo-Brutalist design system, plus an authenticated placeholder **Dashboard** page (`client/src/pages/Dashboard.jsx`) with logout support.
  - Integrated and tested Login, Register, and auth session flows end-to-end with the backend API (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).

- Remaining:
  - Full Dashboard stats view (`/api/stats`).
  - Kanban Board with drag-and-drop stage updates (`PATCH /api/applications/:id/status`).
  - Applications List (search, stage filter, pagination), Add/Edit Application modal, and Application Detail + Notes page.
  - Deployment and production environment/CORS verification.

- Post link:
