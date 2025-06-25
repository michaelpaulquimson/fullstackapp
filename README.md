# Monorepo for Koa Backend and Frontend (future)

## Structure

- `backend/` — Koa.js + TypeScript backend API ([see backend/README.md for details](./backend/README.md))
- `frontend/` — (to be added) Frontend app

## CI/CD: Docker Image Build & ECR Push

This repository includes a GitHub Actions workflow that automatically builds and pushes a Docker image to AWS ECR when the backend version is bumped on the `main` branch.

- **Trigger:**
  - Only runs on the `main` branch
  - Only runs when `backend/package.json` is changed
  - Only builds and pushes if the `version` field in `package.json` is updated
- **What it does:**
  1. Checks out the code
  2. Configures AWS credentials from repository secrets
  3. Logs in to ECR
  4. Compares the current and previous `version` in `backend/package.json`
  5. If the version changed, builds the Docker image and tags it with the new version
  6. Pushes the image to the ECR repository defined in the `ECR_REPOSITORY` secret

**To use this workflow:**
- Set the following GitHub repository secrets:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `ECR_REPOSITORY`
- Bump the `version` in `backend/package.json` and push to `main` to trigger the workflow.

## Quickstart

### Local Backend Development

See [`backend/README.md`](./backend/README.md) for full backend instructions, including:
- Database migrations and schema snapshotting
- API development and testing
- Docker and local workflows

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
