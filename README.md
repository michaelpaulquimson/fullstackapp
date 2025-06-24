# Monorepo for Koa Backend and Frontend (future)

## Structure

- `backend/` — Koa.js + TypeScript backend API
- `frontend/` — (to be added) Frontend app

## Quickstart

### Local Backend Development

See `backend/README.md` for full backend instructions.

### Docker Compose (Recommended for Multi-Service)

From the project root:

```sh
docker compose up --build
```

This will build and run all services defined in `docker-compose.yml` (currently just the backend).

### Adding a Frontend

1. Create your frontend app in the `frontend/` folder (e.g., with Next.js, React, or Vue).
2. Add a `Dockerfile` and update `docker-compose.yml` to include the frontend service.
3. Add a `README.md` in the `frontend/` folder with setup instructions.

---

This structure is ready for Docker-first, multi-service development. Add your frontend in the `frontend/` folder when ready.
