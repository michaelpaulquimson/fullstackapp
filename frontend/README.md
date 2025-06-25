# Frontend (Next.js)

This is the frontend application for the project, built with Next.js 15.

## Development

To run locally:

```sh
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000) by default (or the port set in the `PORT` environment variable).

## Docker Usage

The frontend is containerized and can be run with Docker Compose:

```sh
docker-compose up --build
```

- The app runs on port 3000 inside the container.
- Docker maps host port 3001 to container port 3000.
- Access the app at [http://localhost:3001](http://localhost:3001) on your host.

## Scripts
- `npm run dev` — Start development server (default: http://localhost:3000)
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Lint the codebase

## Environment Variables
- `PORT` — Port for the Next.js server (default: 3000)
- `NODE_ENV` — Set to `production` in Docker

## Notes
- The logs inside the container will show port 3000, but you should access the app via the mapped host port (3001).
