Frontend skeleton created per `frontend/CLAUDE.md` guidelines.

What's included:

- Next.js 14 App Router structure (`/app`)
- TypeScript configuration
- Tailwind setup and global styles
- `lib/api.ts` - centralized API client
- `components/TaskList.tsx` and `components/TaskItem.tsx` - basic UI for tasks

Next steps:

1. Install dependencies in the `frontend` folder (npm/yarn).
2. Provide a backend `NEXT_PUBLIC_API_BASE` or run backend on `http://localhost:8000`.
3. Add auth token to `localStorage` under `token` key or adapt auth flow. (If backend has `JWT_SECRET` set, use a valid HS256 JWT where the `sub` claim is the user id; otherwise any token string will be treated as the user id for local dev.)

If you'd like, I can also wire up a simple create-task form, add tests, or run `npm install`.

E2E tests (Playwright)

- To install browsers: `npm run test:e2e:install`
- To run tests: `npm run test:e2e`

Notes:

- Ensure backend is running on `http://localhost:8000` and frontend on `http://localhost:3000` (or set `PLAYWRIGHT_BASE_URL`).
- Tests use localStorage token `e2e-user` by default; set your own if needed.
