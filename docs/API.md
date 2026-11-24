# API Specification

Base path `/api`. All routes except register and login need `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | /auth/register | No | Create user (name, email, password) |
| POST | /auth/login | No | Returns token and user |
| GET | /auth/me | Yes | Current user |
| GET | /applications | Yes | List. Query: status, q, page, limit, sort |
| POST | /applications | Yes | Create (company, role, location, jobUrl, salary, status, appliedOn, followUpOn) |
| GET | /applications/:id | Yes | Detail with notes and status history |
| PUT | /applications/:id | Yes | Update fields |
| PATCH | /applications/:id/status | Yes | Change stage, write status_history |
| DELETE | /applications/:id | Yes | Delete |
| POST | /applications/:id/notes | Yes | Add note |
| DELETE | /notes/:id | Yes | Delete note |
| GET | /stats | Yes | Counts per stage, total, recent activity, upcoming follow-ups |

Status codes: 200, 201, 400 validation, 401 no/bad token, 403 not your data, 404, 409 duplicate email, 500.
