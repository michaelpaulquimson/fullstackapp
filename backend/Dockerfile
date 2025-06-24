# syntax=docker/dockerfile:1.4

# --- Build Stage (Development) ---
FROM node:22.16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install  # Install ALL dependencies for dev, including types
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc

# --- Production Stage ---
FROM node:22.16-alpine AS prod
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir -p /app/dist && chown -R appuser:appgroup /app/dist
USER appuser
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

EXPOSE 3000
CMD ["node", "dist/app.js"]
