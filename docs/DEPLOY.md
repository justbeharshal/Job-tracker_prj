# Deployment

| Part | Host | URL | Env set? |
|---|---|---|---|
| MySQL | Railway or Aiven | | [ ] |
| API | Render | | [ ] |
| Client | Vercel | | [ ] |

## Steps
1. Create the cloud MySQL database, run `server/schema.sql`
2. Deploy `server/` to Render; set PORT, DB_*, JWT_SECRET, JWT_EXPIRES_IN, CLIENT_URL (the Vercel URL)
3. Deploy `client/` to Vercel; set VITE_API_URL to the Render URL + /api
4. Update CLIENT_URL on Render if the Vercel URL changed
5. Run the full TEST_CHECKLIST on the live site
6. Put the live link in README.md
