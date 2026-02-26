# Web App (React 19 + Vite)

## Scripts

- `npm run dev` or `npm start` - start local dev server
- `npm run build` - production build to `web/build`
- `npm run preview` - preview production build locally
- `npm test` - run tests once with Vitest
- `npm run test:watch` - run tests in watch mode

## Environment variables

Use Vite-prefixed env vars:

- `VITE_AUTH_BASE_URL`
- `VITE_GOOGLE_CLIENTID`
- `VITE_ALLOWED_EMAILS`

Backward compatibility for existing `REACT_APP_*` values is kept in runtime env resolution.
