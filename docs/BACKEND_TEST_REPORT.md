# Backend API Test & Verification Report

> **Date:** 2026-11-26  
> **Environment:** Express (`http://localhost:5000/api`) + MySQL (`job_tracker`)  
> **Result:** **19 / 19 integration checks PASSED (0 failed)** across all 13 API endpoints  
> **Postman:** Postman Desktop `12.38.5` installed at `/Applications/Postman.app` with importable collection at `docs/Job_Tracker_API.postman_collection.json`

---

## 1. Bug Caught & Fixed During Live Testing

| Component | Issue Discovered | Fix Applied |
|---|---|---|
| `server/src/validators/applicationValidator.js` | `Joi.string().isoDate()` coerced `"YYYY-MM-DD"` values (`appliedOn`, `followUpOn`) into full ISO timestamps (`2026-11-28T00:00:00.000Z`), causing MySQL `DATE` columns to fail with `500 Incorrect date value`. | Added `isoDateOnly()` helper in `applicationValidator.js` to validate ISO dates and normalize them to `YYYY-MM-DD`. Verified with live `POST` and `PUT` requests. |

---

## 2. Endpoint & Checklist Verification Matrix (19 / 19 Passed)

| # | Test Case | Endpoint | Expected | Observed | Status |
|---|---|---|---|---|---|
| 1 | Health check | `GET /api/health` | `200`, `{ success: true, message: "ok" }` | `HTTP 200`, `{"success":true,"message":"ok"}` | PASS |
| 2 | Register primary user | `POST /api/auth/register` | `201` + JWT + `user` | `HTTP 201`, `userId=1` | PASS |
| 3 | Duplicate email rejected | `POST /api/auth/register` | `409` | `HTTP 409`, `"An account with this email already exists"` | PASS |
| 4 | Wrong password rejected | `POST /api/auth/login` | `401` | `HTTP 401`, `"Invalid email or password"` | PASS |
| 5 | Valid login succeeds | `POST /api/auth/login` | `200` + JWT | `HTTP 200`, `harshal.demo@example.com` | PASS |
| 6 | Protected route without token | `GET /api/auth/me` | `401` | `HTTP 401`, `"No token provided"` | PASS |
| 7 | Protected route with valid JWT | `GET /api/auth/me` | `200` + user profile | `HTTP 200`, `name=Harshal Demo` | PASS |
| 8 | Validation error on missing `role` | `POST /api/applications` | `400` | `HTTP 400`, `"Role is required"` | PASS |
| 9 | Seed 6 apps + company reuse | `POST /api/applications` | `201`, reuses `company_id` for same company | `6/6` created; both `Linear` rows share `company_id=3` | PASS |
| 10 | Create temporary app for update/delete | `POST /api/applications` | `201` | `HTTP 201`, `tempId=7` | PASS |
| 11 | Full update (`PUT`) | `PUT /api/applications/:id` | `200`, updated fields | `HTTP 200`, `Temp Corp Updated` / `Senior QA Test Role` | PASS |
| 12 | Stage change writes `status_history` | `PATCH /api/applications/:id/status` | `200` + new `status_history` row | `HTTP 200`, `WISHLIST -> APPLIED`, `historyCount=2` | PASS |
| 13 | Add notes to applications | `POST /api/applications/:id/notes` | `201` | Created 3 notes (`ids: 1, 2, 3`) | PASS |
| 14 | Cross-user isolation (User B vs User A) | `GET`, `PUT`, `PATCH`, `DELETE` | `403` / `404` | `GET=404`, `PUT=403`, `PATCH=404`, `DELETE_APP=403`, `DELETE_NOTE=404` | PASS |
| 15 | Delete owned note | `DELETE /api/notes/:id` | `200` | `HTTP 200`, `"Note deleted"` | PASS |
| 16 | Delete app cascades notes & history | `DELETE /api/applications/:id` | `200`, subsequent `GET` is `404` | `DELETE=200`, subsequent `GET=404` | PASS |
| 17 | Search, filter, sort, pagination | `GET /api/applications?status=APPLIED&q=Linear&page=1&limit=5&sort=company_asc` | `200` + filtered rows & pagination metadata | `filteredCount=1`, `page1Len=2`, `total=6` | PASS |
| 18 | Dashboard stats accuracy | `GET /api/stats` | `countsByStatus`, `total`, `recentActivity`, `upcomingFollowUps` | `total=6`, `{WISHLIST:1, APPLIED:2, INTERVIEW:1, OFFER:1, REJECTED:1}`, `recent=7`, `followUps=4` | PASS |
| 19 | Unknown route 404 handler | `GET /api/unknown-route` | `404` JSON | `HTTP 404`, `"Route not found"` | PASS |

---

## 3. Seeded Database State (Ready for Postman & Frontend)

MySQL database `job_tracker` is populated with live sample data:

- **Demo Account:** `harshal.demo@example.com` / `Password123!` (plus isolation test user `userb.test@example.com`)
- **Row Counts:** `users: 2`, `companies: 7`, `applications: 6`, `status_history: 7`, `notes: 2`

| ID | Company | Role | Stage | Follow-up Date |
|---|---|---|---|---|
| 1 | Stripe | Backend Software Engineer | `WISHLIST` | `2026-11-28` |
| 2 | Vercel | Full Stack Engineer | `APPLIED` | `2026-11-30` |
| 3 | Linear | Product Engineer | `APPLIED` | `2026-11-27` |
| 4 | Linear | Platform Infrastructure Engineer | `INTERVIEW` | `2026-12-01` |
| 5 | Figma | API Platform Engineer | `OFFER` | `null` |
| 6 | Shopify | Node.js Developer | `REJECTED` | `null` |

---

## 4. Quick Re-Test in Postman

1. Ensure the backend is running (`cd server && npm run dev`).
2. Open **Postman** (`/Applications/Postman.app`) and import `docs/Job_Tracker_API.postman_collection.json`.
3. Run **Auth → Login** with `harshal.demo@example.com` / `Password123!` (`{{token}}` saves automatically) and execute any endpoint against the seeded records.
