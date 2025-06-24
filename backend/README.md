# Koa Backend (Docker-First, TypeScript)

This is the backend service for your project, built with Koa.js and TypeScript, and designed for Docker-first workflows.

## Features
- Koa.js server with TypeScript
- Multi-stage Docker build for minimal, secure images
- Hot-reloading in development with nodemon
- Runs as a non-root user in production for security

## Requirements
- Node.js 22.16 (for local development, use `nvm install 22.16`)
- Docker & Docker Compose

## Local Development
```sh
cd backend
npm install
npm run build   # Compile TypeScript
npm start       # Run compiled server
# or for hot-reload:
npm run dev
```

## Docker Development (with hot-reload)
From the project root (not inside backend!):
```sh
cd /path/to/project/root
# or if already in the root, just run:
docker compose up --build
```

## Production Docker Image
Builds a minimal, secure image:
```sh
cd backend
docker build -t koa-backend .
docker run -p 3000:3000 koa-backend
```

## Security Best Practices
- Runs as a non-root user in production
- Only production dependencies and compiled code are included in the final image

## Troubleshooting
- **Port already allocated:** Stop any process using port 3000 or change the port in `docker-compose.yml`.
- **Permission denied on /app/dist:** The Docker Compose setup auto-fixes this, but if you see issues, try removing and recreating the `dist` folder.
- **Frontend not found:** If you add a frontend, update `docker-compose.yml` and the root README.

---
Feel free to expand this backend with more routes, middleware, and features as needed.
