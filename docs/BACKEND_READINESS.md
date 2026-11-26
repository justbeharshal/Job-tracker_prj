# Backend Readiness Report

> Generated: Day 0 → Day 1 transition  
> Purpose: Verify everything needed to start backend development is in place, and flag anything missing or ambiguous before writing a single line of code.

---

## 1. Database Schema — Status: ✅ Ready

**File:** `server/schema.sql`

### Tables

| Table | Columns | Key Constraints |
|---|---|---|
| `users` | id, name, email, password_hash, created_at | UNIQUE email |
| `companies` | id, user_id, name, website, location | UNIQUE(user_id, name); FK → users CASCADE |
| `applications` | id, user_id, company_id, role, status, salary, job_url, applied_on, follow_up_on, created_at, updated_at | FK → users CASCADE; FK → companies CASCADE |
| `status_history` | id, application_id, from_status, to_status, changed_at | FK → applications CASCADE |
| `notes` | id, application_id, content, created_at | FK → applications CASCADE |

### Performance Indexes
- `idx_user_status (user_id, status)` — covers filtered list queries
- `idx_followup (user_id, follow_up_on)` — covers upcoming follow-ups in `/stats`

### Schema Gaps / Issues to Resolve

| # | Issue | Severity | Decision needed |
|---|---|---|---|
| 1 | `applications` has no `location` column, but `POST /applications` accepts `location` as a field (per API.md and PRD). Location is currently only on `companies`. | ⚠️ Medium | Add `location VARCHAR(150)` to `applications` OR always derive it from the linked company. The PRD lists location as an application field, not a company field. **Recommendation: add it to `applications`.** |
| 2 | `companies.website` is nullable and free-text. API spec sends `jobUrl` per application. These are different concepts — `jobUrl` belongs on `applications` (already there as `job_url`). No issue, just confirm. | ℹ️ Info | No change needed. |
| 3 | `status_history` stores `from_status`/`to_status` as `VARCHAR(20)` but `applications.status` is an ENUM. Inconsistency could cause silent mismatches. | ⚠️ Low | Change `status_history.from_status` and `to_status` to `ENUM('WISHLIST','APPLIED','INTERVIEW','OFFER','REJECTED')`, or document it as intentionally flexible. |
| 4 | No `updated_at` on `notes` table. Fine for MVP since notes are immutable (add/delete only). | ℹ️ Info | No change needed unless edit-note is added later. |
| 5 | `companies` table stores `location` — but the PRD says "no separate company screen." The service layer must silently create/reuse a company row when an application is created. This is an implicit behavior with no API surface. | ⚠️ Medium | Document the lookup-or-create logic clearly in the service layer. See Section 4. |

---

## 2. API Endpoints — Status: ✅ Specified, ❌ Not Implemented

**File:** `docs/API.md`  
**Base path:** `/api`  
**Auth header:** `Authorization: Bearer <token>` (all protected routes)

### Auth Routes

| # | Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|---|
| 1 | POST | `/auth/register` | No | `{ name, email, password }` | `201 { success, data: { token, user } }` |
| 2 | POST | `/auth/login` | No | `{ email, password }` | `200 { success, data: { token, user } }` |
| 3 | GET | `/auth/me` | Yes | — | `200 { success, data: { user } }` |

### Application Routes

| # | Method | Endpoint | Auth | Query / Body | Response |
|---|---|---|---|---|---|
| 4 | GET | `/applications` | Yes | `?status, q, page, limit, sort` | `200 { success, data: { applications[], pagination } }` |
| 5 | POST | `/applications` | Yes | `{ company, role, location, jobUrl, salary, status, appliedOn, followUpOn }` | `201 { success, data: { application } }` |
| 6 | GET | `/applications/:id` | Yes | — | `200 { success, data: { application, notes[], statusHistory[] } }` |
| 7 | PUT | `/applications/:id` | Yes | Same fields as POST | `200 { success, data: { application } }` |
| 8 | PATCH | `/applications/:id/status` | Yes | `{ status }` | `200 { success, data: { application } }` |
| 9 | DELETE | `/applications/:id` | Yes | — | `200 { success, message }` |

### Notes Routes

| # | Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|---|
| 10 | POST | `/applications/:id/notes` | Yes | `{ content }` | `201 { success, data: { note } }` |
| 11 | DELETE | `/notes/:id` | Yes | — | `200 { success, message }` |

### Stats Route

| # | Method | Endpoint | Auth | Response |
|---|---|---|---|---|
| 12 | GET | `/stats` | Yes | `200 { success, data: { countsByStatus, total, recentActivity[], upcomingFollowUps[] } }` |

### API Gaps / Issues to Resolve

| # | Issue | Severity | Decision needed |
|---|---|---|---|
| 1 | `GET /applications` — `sort` query param is listed but no sort fields or direction are defined. | ⚠️ Medium | Define valid sort values: e.g. `sort=applied_on_desc`, `sort=company_asc`, `sort=updated_at_desc`. **Recommendation: default `updated_at DESC`.** |
| 2 | `DELETE /notes/:id` — the controller must verify the note belongs to an application owned by the requesting user. There is no direct `user_id` on `notes`, so it requires a JOIN through `applications`. Must be implemented carefully. | ⚠️ Medium | Ownership check: `SELECT n.id FROM notes n JOIN applications a ON n.application_id = a.id WHERE n.id = ? AND a.user_id = ?` |
| 3 | `GET /stats` — `recentActivity` is not defined. What constitutes "recent"? Last 7 days? Last 10 rows? | ⚠️ Medium | **Recommendation: last 10 status_history rows for the user, ordered by `changed_at DESC`.** |
| 4 | `GET /stats` — `upcomingFollowUps` cutoff is not defined. Next 7 days? Next 30? | ⚠️ Medium | **Recommendation: applications where `follow_up_on BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)`.** |
| 5 | `POST /applications` body sends `company` as a name string, but the DB stores `company_id`. No API endpoint exists to create a company directly. | ⚠️ High | Service must do lookup-or-create: find company by `(user_id, name)`, insert if not found, return `company_id`. See Section 4. |
| 6 | No `PUT /applications/:id` spec for what happens to `company` name change — does it update the company row or create a new one? | ⚠️ Medium | **Recommendation: treat it as lookup-or-create on the new name. Do not update the old company row (other applications may reference it).** |
| 7 | Logout is in the PRD feature list but there is no `POST /auth/logout` endpoint in API.md. JWT is stateless, so logout is client-side token deletion. | ℹ️ Info | Acceptable for MVP. Document this explicitly so the frontend knows. |
| 8 | `GET /applications` — `q` search parameter: which fields does it search? API.md says "search by company or role" (PRD). | ℹ️ Info | Search on `companies.name` and `applications.role` using `LIKE %q%`. Confirm this is the intended behavior. |

---

## 3. Project Structure — Status: ✅ Scaffolded, ❌ No Code

```
server/
├── .env.example          ✅  7 env vars defined
├── schema.sql            ✅  Complete
└── src/
    ├── config/           📁  Empty (.gitkeep)   — needs: db.js
    ├── controllers/      📁  Empty (.gitkeep)   — needs: auth.js, applications.js, notes.js, stats.js
    ├── db/               📁  Empty (.gitkeep)   — needs: pool connection or moved to config/db.js
    ├── middleware/        📁  Empty (.gitkeep)   — needs: auth.js, errorHandler.js, validate.js
    ├── routes/           📁  Empty (.gitkeep)   — needs: auth.js, applications.js, notes.js, stats.js
    ├── services/         📁  Empty (.gitkeep)   — needs: authService.js, applicationService.js, noteService.js, statsService.js
    ├── utils/            📁  Empty (.gitkeep)   — needs: response.js (standard shape helper)
    └── validators/       📁  Empty (.gitkeep)   — needs: authValidator.js, applicationValidator.js
```

**Missing at root level:**
- `server/package.json` — not created yet
- `server/app.js` or `server/server.js` — no entry point exists

---

## 4. Files to Create — Prioritised Build Order

### Phase 1 — Project Bootstrap (Day 1)

| File | Purpose |
|---|---|
| `server/package.json` | Dependencies: express, mysql2, bcryptjs, jsonwebtoken, dotenv, cors, helmet, express-rate-limit, joi (or zod) |
| `server/app.js` | Express app: CORS, Helmet, rate limiter, routes, error handler |
| `server/server.js` | HTTP listen only (separates app from server for testability) |
| `server/src/config/db.js` | mysql2 connection pool using env vars |
| `server/src/routes/index.js` | Mount all route files under `/api` |
| `server/src/middleware/errorHandler.js` | Catches errors, returns `{ success: false, message }` |

**Verification:** `GET /api/health` returns `200 { success: true, message: "ok" }`.

### Phase 2 — Auth (Day 2)

| File | Purpose |
|---|---|
| `server/src/validators/authValidator.js` | Joi/Zod schemas: register (name, email, password min 8), login (email, password) |
| `server/src/middleware/validate.js` | Generic middleware that runs a Joi/Zod schema and returns 400 on failure |
| `server/src/middleware/auth.js` | Verifies JWT, attaches `req.user = { id, email }`, returns 401 if invalid |
| `server/src/services/authService.js` | register(), login(), getMe() — bcrypt + jwt logic lives here |
| `server/src/controllers/auth.js` | Thin: call service, send response |
| `server/src/routes/auth.js` | POST /register, POST /login, GET /me |

**Verification:** Register returns token, login returns token, `/auth/me` with token returns user, `/auth/me` without token returns 401.

### Phase 3 — Applications CRUD (Day 3)

| File | Purpose |
|---|---|
| `server/src/validators/applicationValidator.js` | Joi/Zod: create/update body, status patch body, notes body |
| `server/src/services/applicationService.js` | CRUD + `_lookupOrCreateCompany()` private helper |
| `server/src/controllers/applications.js` | list, create, getById, update, updateStatus, remove |
| `server/src/controllers/notes.js` | addNote, deleteNote (with ownership JOIN check) |
| `server/src/routes/applications.js` | All /applications routes |
| `server/src/routes/notes.js` | DELETE /notes/:id |

**Verification:** All CRUD passes; user B gets 403 on user A's data; DELETE /notes/:id checks ownership.

### Phase 4 — Stats, Search, Pagination (Day 4)

| File | Purpose |
|---|---|
| `server/src/services/statsService.js` | countsByStatus, total, recentActivity (last 10), upcomingFollowUps (7 days) |
| `server/src/controllers/stats.js` | Thin: call service, send response |
| `server/src/routes/stats.js` | GET /stats |
| `server/src/utils/response.js` | `sendSuccess(res, data, status)` / `sendError(res, message, status)` helpers |

Extend `applicationService.js` with:
- Filtering by `status` query param
- Full-text search on `companies.name` and `applications.role` via `LIKE`
- Pagination: `LIMIT` and `OFFSET` from `page` and `limit` params
- Sort: `ORDER BY updated_at DESC` by default

**Verification:** Query params work; stats endpoint returns all four fields; search finds by company and role.

---

## 5. Environment Variables — Status: ✅ Defined

**File:** `server/.env.example`

| Variable | Value (example) | Used by |
|---|---|---|
| `PORT` | `5000` | `server.js` |
| `DB_HOST` | `localhost` | `config/db.js` |
| `DB_USER` | `root` | `config/db.js` |
| `DB_PASSWORD` | _(empty)_ | `config/db.js` |
| `DB_NAME` | `job_tracker` | `config/db.js` |
| `JWT_SECRET` | `change_me_to_a_long_random_string` | `middleware/auth.js`, `services/authService.js` |
| `JWT_EXPIRES_IN` | `7d` | `services/authService.js` |
| `CLIENT_URL` | `http://localhost:5173` | `app.js` CORS config |

**Action required before starting:** Copy `.env.example` to `.env` and fill in real values. The `.env` file is already in `.gitignore`.

---

## 6. Dependencies to Install

```json
{
  "dependencies": {
    "express": "^4.18",
    "mysql2": "^3.6",
    "bcryptjs": "^2.4",
    "jsonwebtoken": "^9.0",
    "dotenv": "^16.0",
    "cors": "^2.8",
    "helmet": "^7.0",
    "express-rate-limit": "^7.0",
    "joi": "^17.0"
  },
  "devDependencies": {
    "nodemon": "^3.0"
  }
}
```

**Note:** The architecture doc says "Zod/Joi" — pick one. Joi is simpler for plain JS; Zod is better if TypeScript is added later. This plan uses Joi as the default.

---

## 7. Response Shape Contract

All API responses follow this shape (from `ARCHITECTURE.md`):

```json
// Success
{ "success": true, "data": { ... }, "message": "optional" }

// Error
{ "success": false, "message": "Human readable error" }
```

The `utils/response.js` helper should enforce this uniformly.

---

## 8. Key Business Logic — Lookup-or-Create Company

This is the single most important implicit rule in the data model.

When `POST /applications` or `PUT /applications/:id` is called with a `company` name:

```
1. SELECT id FROM companies WHERE user_id = ? AND name = ?
2. If found  → use that company_id
3. If not found → INSERT INTO companies (user_id, name, location) VALUES (?, ?, ?)
                  use the new insert id as company_id
4. Proceed with INSERT/UPDATE on applications using company_id
```

`location` on the company row can be omitted (nullable) — the application row stores the location that matters for display.

---

## 9. Pre-Start Checklist

Before writing the first line of code, confirm all of the following:

- [ ] `server/.env` file created from `.env.example` with real DB credentials
- [ ] MySQL running locally with `job_tracker` database created (`mysql -u root < server/schema.sql`)
- [ ] Decision made: add `location` column to `applications` table (recommended — see Section 1, Issue #1)
- [ ] Decision made: `status_history` ENUM alignment (see Section 1, Issue #3)
- [ ] Decision made: `sort` query param values defined (see Section 2, Issue #1)
- [ ] Decision made: `recentActivity` = last 10 status_history rows (see Section 2, Issue #3)
- [ ] Decision made: `upcomingFollowUps` = next 7 days (see Section 2, Issue #4)
- [ ] `server/package.json` initialized (`npm init -y` inside `server/`)
- [ ] Node.js v18+ confirmed (`node -v`)

---

## 10. What Is NOT Needed (Scope Lock)

Per `docs/PRD.md`, do not build any of these in the backend:

- Email reminders or any email service
- Resume upload or file storage
- Admin routes or admin middleware
- Refresh token endpoint (single JWT, 7-day expiry is sufficient for MVP)
- Separate company management endpoints (companies are created silently)
- Social/sharing features
- Any AI integration

---

## Summary

| Area | Status | Blocking? |
|---|---|---|
| Database schema | ✅ Written, needs 1 column addition (`applications.location`) | Yes — fix before running schema |
| API specification | ✅ 12 endpoints defined, 8 clarifications needed | No — can proceed, clarifications are implementation details |
| Folder structure | ✅ Scaffolded | No |
| Entry point (app.js, package.json) | ❌ Missing | Yes — Day 1 task |
| DB connection module | ❌ Missing | Yes — Day 1 task |
| Auth implementation | ❌ Missing | Yes — Day 2 task |
| Applications CRUD | ❌ Missing | Yes — Day 3 task |
| Stats + search | ❌ Missing | Yes — Day 4 task |
| Environment file | ⚠️ `.env.example` exists, `.env` not created | Yes — needed before first run |
