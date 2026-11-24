# PRD: Scope Lock

**Problem:** Job seekers track applications in scattered notes and lose follow-ups.
**Solution:** A web app with a stage board, notes and a dashboard.
**User:** One type, the job seeker. No admin in the MVP.

## Stages (exactly five)
Wishlist, Applied, Interview, Offer, Rejected

## MVP features
1. Register, login, logout (JWT)
2. Create, view, edit, delete an application
3. Move between stages (drag and drop, plus dropdown on detail page)
4. Notes on an application
5. Follow-up date and an upcoming follow-ups list
6. Search by company or role, filter by stage, paginate
7. Dashboard: counts per stage, recent activity

## Application fields
company, role, location, job URL, salary (optional), stage, applied date, follow-up date

## Out of scope (do not build or design)
AI features, chat, social/sharing, payments, email reminders, resume upload, admin panel, dark mode, mobile app, teams, separate company screen

## Stretch (only after MVP)
Resume upload, email reminders, refresh tokens, Docker, automated tests

## Definition of done
A stranger can register, add three applications, drag them across stages, search them, and see the dashboard update on the live URL.
