# Architecture

```
React Client (Vercel) --HTTPS/JSON + JWT--> Express API (Render) --> MySQL
```

## Request pipeline
```
Request -> CORS + Helmet -> Rate limiter -> Auth (verify JWT)
        -> Validation (Zod/Joi) -> Controller -> Service -> DB query
        -> Error middleware -> JSON response
```

## Layers
- Routes: URL + method to controller
- Middleware: auth, validation, errors
- Controllers: read request, call service, send response
- Services: business logic (stage change also writes history)
- DB: SQL only, parameterised queries (mysql2)

## Security
bcrypt for passwords, JWT with expiry, every query filtered by user_id, parameterised SQL, CORS limited to CLIENT_URL, secrets only in env.

## Response shape
`{ success, data, message }`
