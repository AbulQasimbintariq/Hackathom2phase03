Backend FastAPI service

Overview

- FastAPI + SQLModel
- Endpoints under `/api/tasks`
- Simple auth: expects `Authorization: Bearer <token>` header and treats token as `user_id` (for demo only)

Run locally

1. Create a `.env` file (or set env vars). See `.env.example` for `DATABASE_URL`.
2. Install dependencies: `pip install -r requirements.txt`
3. Create or run DB migrations:

   # from the repository root

   cd backend
   alembic -c alembic.ini upgrade head

   If you don't run migrations, the app will fall back to creating tables on startup using SQLModel (sqlite dev convenience), but running Alembic is recommended for reproducible schema management.

4. Run the server:

   uvicorn main:app --reload --port 8000

Docker-compose (full local dev)

You can run the entire stack (Postgres + backend + frontend) with Docker Compose:

1. Ensure Docker and docker-compose are installed.
2. From the repository root run:

   docker compose up --build

3. The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`.

Notes:

- The backend will run Alembic migrations automatically on startup.
- If you want to customize DB credentials or JWT secret, create `backend/.env` using `.env.example` and set `DATABASE_URL` and `JWT_SECRET` accordingly before running `docker compose up`.

Notes

- By default the app will use `sqlite:///./dev.db` if `DATABASE_URL` is not provided for convenience.
- Authentication: the app expects an `Authorization: Bearer <token>` header for all `/api/` endpoints. If you set `JWT_SECRET` in the environment, the app will validate and decode HS256 JWTs and expect the `sub` (or `user_id`) claim to be the user id. If `JWT_SECRET` is not set, the token string itself will be treated as the `user_id` for development convenience.
