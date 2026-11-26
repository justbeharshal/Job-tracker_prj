# Knowledge Transfer (KT) Notes — Job Application Tracker (`Job-tracker_prj`)

> **Audience:** 2 New Developers joining the project  
> **Session Duration:** ~60–75 minutes (Walkthrough + Live Setup + Task Split)  
> **Current Project Status:** Planning, UI Designs, and Backend API (`server/`) are implemented; Frontend (`client/`) is scaffolded and ready to build (Days 5–7 of `docs/BUILD_PLAN.md`).

---

## 1. How to Run This KT Session (Facilitator Guide)

Run the KT in **4 focused blocks** rather than reading every file line-by-line:

| Block | Time | Goal | Reference Files |
|---|---|---|---|
| **1. Product & Scope Lock** | 10 min | Align on what we are building and what is **out of scope** | `docs/PRD.md`, `docs/DESIGN.md`, `docs/design/` |
| **2. Architecture & DB** | 15 min | Explain request flow, layers, and 5-table MySQL schema | `docs/ARCHITECTURE.md`, `server/schema.sql`, `server/app.js` |
| **3. Backend Walkthrough & Gotchas** | 20 min | Show routes, Joi validators, auth, ownership, and service patterns | `docs/API.md`, `server/src/` |
| **4. Live Setup & Work Split** | 20 min | Get both devs running `/api/health` locally + assign Dev 1 & Dev 2 tasks | `server/.env.example`, `docs/BUILD_PLAN.md`, `docs/TEST_CHECKLIST.md` |

### Suggested Work Split for 2 Developers
Since the backend code is written and the React frontend (`client/`) is next:

- **Developer 1 (Backend Verification + Auth & Core App Shell):**
  - Verify MySQL setup, run `server/schema.sql`, and test all 12 endpoints against `docs/TEST_CHECKLIST.md` (Postman/Thunder Client).
  - Bootstrap Vite + React + Tailwind in `client/`, Axios client + JWT interceptor (`client/src/api`), `AuthContext`, protected routes, **Login**, **Register**, and **Layout/Sidebar**.
- **Developer 2 (UI Screens & Interactive Flows):**
  - Build **Dashboard** (`/stats`), **Kanban Board** (drag-and-drop across 5 stages calling `PATCH /api/applications/:id/status`), **Applications List** (search, stage filter, sort, pagination), **Add/Edit Modal**, and **Application Detail + Notes** page using the Stitch screens in `docs/design/stitch_job_application_tracker_ui/`.

*(Alternative split if both are full-stack: Dev 1 owns Auth + Dashboard + List + Deploy; Dev 2 owns Board + Detail/Notes + Backend bug fixes & end-to-end QA.)*

---

## 2. Product Overview & Scope Lock

- **Problem:** Job seekers track applications in scattered notes and miss follow-ups.
- **Solution:** A Trello-style job application tracker with 5 fixed pipeline stages, notes, follow-up dates, search/filtering, and a dashboard.
- **User Role:** Single user type (the job seeker). No admin role in MVP.
- **5 Fixed Stages (uppercase ENUM in DB & API):**
  1. `WISHLIST` (slate)
  2. `APPLIED` (blue)
  3. `INTERVIEW` (amber)
  4. `OFFER` (green)
  5. `REJECTED` (red)
- **7 Exact Screens (`docs/DESIGN.md`):**
  1. Login
  2. Register
  3. Dashboard
  4. Board (Kanban)
  5. Applications List
  6. Add/Edit Application (Modal)
  7. Application Detail (with notes & status history)
- **Strict Out of Scope (Do NOT build for MVP):** AI features, chat, social/sharing, payments, email reminders, resume upload, admin panel, dark mode, mobile app, teams, separate company management screen.

---

## 3. Repository Map & Current State

```text
Job-tracker_prj/
├── README.md
├── docs/
│   ├── PRD.md                  # Scope lock & MVP definition of done
│   ├── ARCHITECTURE.md         # Layers, pipeline, security rules
│   ├── API.md                  # Endpoint summary (12 endpoints)
│   ├── DESIGN.md               # 7 screens, color tokens, Inter font, light theme
│   ├── BACKEND_READINESS.md    # Schema/API decisions & edge-case notes
│   ├── BUILD_PLAN.md           # 7-day plan (Days 0-4 backend checked off)
│   ├── BUILD_LOG.md            # Daily progress log
│   ├── TEST_CHECKLIST.md       # 11 manual QA cases before launch
│   ├── DEPLOY.md               # Railway/Aiven (MySQL) + Render (API) + Vercel (Client)
│   └── design/stitch_job_application_tracker_ui/  # Visual reference per screen
├── server/                     # IMPLEMENTED (Node.js + Express + MySQL)
│   ├── server.js               # HTTP listener only
│   ├── app.js                  # Express middleware, /api mount, 404, errorHandler
│   ├── schema.sql              # Full MySQL DDL (5 tables + indexes)
│   ├── package.json            # Node >= 18, express, mysql2, joi, bcryptjs, jsonwebtoken
│   ├── .env.example            # Template env vars (NEVER commit .env)
│   └── src/
│       ├── config/db.js        # mysql2 connection pool
│       ├── middleware/         # auth.js, validate.js, errorHandler.js
│       ├── validators/         # authValidator.js, applicationValidator.js
│       ├── routes/             # index.js, auth.js, applications.js, notes.js, stats.js
│       ├── controllers/        # auth.js, applications.js, notes.js, stats.js
│       ├── services/           # authService.js, applicationService.js, noteService.js, statsService.js
│       └── utils/response.js   # sendSuccess / sendError envelope helpers
└── client/                     # SCAFFOLDED ONLY (no package.json yet; Days 5-6)
    ├── .env.example            # VITE_API_URL=http://localhost:5000/api
    └── src/                    # Empty folders: api, components, context, hooks, pages, utils
```

---

## 4. Architecture & Request Lifecycle

### Request Pipeline (`server/app.js`)
```text
HTTP Request
  -> helmet()               # Security headers
  -> cors()                 # Restricted to CLIENT_URL (default http://localhost:5173)
  -> express-rate-limit     # 100 requests / 15 min per IP
  -> express.json()         # Body parsing
  -> /api routes
       -> authMiddleware    # Verifies Bearer JWT -> sets req.user = { id, email, name }
       -> validate(schema)  # Joi (abortEarly: false, stripUnknown: true) -> 400 on error
       -> controller        # Extracts req params/body/user, calls service
       -> service           # Business logic + parameterized mysql2 queries (pool.query)
  -> 404 handler            # Unmatched routes -> 404 JSON
  -> errorHandler           # Global catch-all -> uses err.statusCode or 500
```

### Standard Response Shape (`server/src/utils/response.js`)
Every API response uses one envelope:
- **Success:** `{ "success": true, "data": { ... }, "message": "..." }` (`data` and `message` omitted if empty/null)
- **Error:** `{ "success": false, "message": "..." }`

---

## 5. Database Schema (`server/schema.sql`)

Database name: `job_tracker`

1. **`users`**: `id`, `name`, `email` (UNIQUE), `password_hash`, `created_at`
2. **`companies`**: `id`, `user_id` (FK -> `users` CASCADE), `name`, `website`, `location`, `UNIQUE(user_id, name)`
3. **`applications`**: `id`, `user_id` (FK -> `users` CASCADE), `company_id` (FK -> `companies` CASCADE), `role`, `location`, `status` (ENUM of 5 stages, default `'WISHLIST'`), `salary`, `job_url`, `applied_on`, `follow_up_on`, `created_at`, `updated_at`
   - Indexes: `idx_user_status (user_id, status)`, `idx_followup (user_id, follow_up_on)`
4. **`status_history`**: `id`, `application_id` (FK -> `applications` CASCADE), `from_status`, `to_status`, `changed_at`
5. **`notes`**: `id`, `application_id` (FK -> `applications` CASCADE), `content`, `created_at`

---

## 6. API Endpoints & Key Implementation Gotchas

Base URL: `http://localhost:5000/api`

| Area | Method & Path | Auth | Notes / Contract |
|---|---|---|---|
| Health | `GET /api/health` | No | Returns `{ success: true, message: "ok" }` (no DB check) |
| Auth | `POST /api/auth/register` | No | `name` (min 2), `email`, `password` (min 8) -> `201` `{ token, user }` |
| Auth | `POST /api/auth/login` | No | `email`, `password` -> `200` `{ token, user }` |
| Auth | `GET /api/auth/me` | Yes | Returns current `user` from JWT |
| Apps | `GET /api/applications` | Yes | Query: `status`, `q`, `page` (def 1), `limit` (def 10, max 100), `sort` |
| Apps | `POST /api/applications` | Yes | Required: `company`, `role`. Optional: `location`, `jobUrl`, `salary`, `status`, `appliedOn`, `followUpOn` |
| Apps | `GET /api/applications/:id` | Yes | Returns `{ application, notes, statusHistory }` |
| Apps | `PUT /api/applications/:id` | Yes | Full update of application fields |
| Apps | `PATCH /api/applications/:id/status` | Yes | `{ status }` -> updates stage and appends `status_history` |
| Apps | `DELETE /api/applications/:id` | Yes | Cascades to `notes` and `status_history` |
| Notes | `POST /api/applications/:id/notes` | Yes | `{ content }` (1–5000 chars) |
| Notes | `DELETE /api/notes/:id` | Yes | Checks ownership via `notes JOIN applications` |
| Stats | `GET /api/stats` | Yes | Returns `countsByStatus`, `total`, `recentActivity` (last 10), `upcomingFollowUps` (next 7 days) |

### Critical Gotchas to Point Out During KT
1. **Use `PATCH /applications/:id/status` for stage changes (not `PUT`):**
   - `applicationService.updateStatus()` writes a row to `status_history` whenever `fromStatus !== newStatus`.
   - `applicationService.update()` (`PUT /applications/:id`) updates `status` directly **without** writing a `status_history` row. Always use `PATCH` for board drag-and-drop and detail-page stage dropdowns.
2. **Implicit Company Lookup-or-Create:**
   - There is no `/companies` endpoint. Both `create()` and `update()` in `applicationService.js` take `company` as a string and run `_lookupOrCreateCompany(userId, companyName)`.
3. **Allowed `sort` values on `GET /api/applications`:**
   - Only `updated_at_desc` (default), `applied_on_desc`, `applied_on_asc`, and `company_asc` are accepted by `listQuerySchema`. Any other value returns `400`.
4. **Validation strips unknown fields:**
   - `validate.js` sets `stripUnknown: true` and `abortEarly: false`. Frontend must send exact camelCase keys (`jobUrl`, `appliedOn`, `followUpOn`)—note that DB responses return snake_case (`job_url`, `applied_on`, `follow_up_on`, `company_id`). Keep this mapping clear in the frontend API layer!
5. **Stateless Logout:**
   - There is no `POST /auth/logout` endpoint; frontend logout just clears the stored JWT and resets `AuthContext`.
6. **403 vs 404 Ownership Behavior:**
   - `applicationService` (`update`, `remove`) throws `403` when an application exists for another user and `404` when missing. `getById`, `updateStatus`, and `noteService` filter by `user_id` directly and return `404` if not owned/found.

---

## 7. Local Developer Setup Checklist (Do Live in KT)

1. **Prerequisites:** Node.js `>= 18`, MySQL running locally, Git.
2. **Database:**
   ```bash
   mysql -u root -p < server/schema.sql
   ```
3. **Backend (`server/`):**
   ```bash
   cd server
   cp .env.example .env   # Fill DB_PASSWORD and a strong JWT_SECRET
   npm install
   npm run dev            # Runs nodemon server.js on PORT 5000
   ```
4. **Smoke Test:**
   ```bash
   curl http://localhost:5000/api/health
   # Expected: {"success":true,"message":"ok"}
   ```
5. **Verify Backend Before Building Frontend:**
   - Run through items 1–9 in `docs/TEST_CHECKLIST.md` using Postman/Thunder Client (note: `docs/BUILD_LOG.md` says Day 1 syntax passed, Postman testing is the next step).
6. **Frontend Setup (`client/` — Dev 1 / Dev 2 Day 5 kickoff):**
   - Initialize Vite React app inside `client/` (preserve existing `client/.env.example`), install `react-router-dom`, `axios`, Tailwind CSS, and drag-and-drop library if desired.
   - Set `VITE_API_URL=http://localhost:5000/api` in `client/.env`.

---

## 8. Working Agreements & Definition of Done

- **Commits:** One feature per commit (e.g., `feat: add auth context and login page`).
- **Secrets:** Never commit `.env` files (`server/.env` or `client/.env`).
- **Logs:** Update `docs/BUILD_LOG.md` and tick `docs/BUILD_PLAN.md` as milestones complete.
- **Definition of Done (`docs/PRD.md`):**
  > A stranger can register, add three applications, drag them across stages, search them, and see the dashboard update on the live URL (`docs/DEPLOY.md` + all 11 items in `docs/TEST_CHECKLIST.md` passing).
