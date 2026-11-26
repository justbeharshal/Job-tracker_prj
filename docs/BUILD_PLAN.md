# Build Plan

| Day | Tasks | Done when | Post |
|---|---|---|---|
| 0 | Docs, design in design AI, poster, GitHub repo | Docs and design committed | Announcement poster + caption |
| 1 | Structure, MySQL connection, schema.sql, /health, .env.example | /health works, tables exist | DB diagram + schema reasoning |
| 2 | Register, login, bcrypt, JWT, auth middleware, /auth/me | Token returned, protected route works | Auth flow diagram |
| 3 | Applications CRUD, validation, ownership checks, error middleware | All CRUD passes in Postman; user B cannot touch user A data | Postman screenshot, middleware chain |
| 4 | Status change + history, notes, search, filter, pagination, /stats | Query params and stats correct | Pagination + indexes lesson |
| 5 | React setup, auth context, protected routes, login, register, list, form modal | Log in and create application from UI | UI vs design screenshot |
| 6 | Board drag and drop, dashboard charts, detail page, loading/error states | Dragging updates the DB | GIF of the board |
| 7 | Test checklist, deploy, README, screenshots | Live URL works for a new user | Launch post with links + 3 lessons |

## Tasks (tick as you go)
- [x] Day 0 docs written
- [x] Day 0 design generated and checked against the Lock block
- [ ] Day 0 poster posted
- [x] Day 1 backend skeleton and schema
- [x] Day 2 auth
- [x] Day 3 applications CRUD
- [x] Day 4 stats, search, pagination
- [ ] Day 5 frontend auth and list
- [ ] Day 6 board and dashboard
- [ ] Day 7 deploy and launch post

## Daily post template
1. Hook: what I built today
2. One image (screenshot, diagram or GIF)
3. One thing I learned or one bug I fixed
4. What comes tomorrow
5. #BuildInPublic #FullStack #NodeJS #React

Routine: build, 15 minutes updating BUILD_LOG.md, write the post from the log. One commit per feature (e.g. `feat: add JWT auth middleware`).
