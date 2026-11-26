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
