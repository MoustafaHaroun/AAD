# Trade2 — Backend

REST API for the Trade2 platform. Built with NestJS, PostgreSQL, and MinIO.

## Tech Stack

- **Runtime** — Node.js 20, NestJS
- **Database** — PostgreSQL 15 + TypeORM (migrations)
- **Storage** — MinIO (S3-compatible object storage)
- **Auth** — JWT (Bearer)
- **Docs** — Swagger (`/documentation`)
- **Monitoring** — Prometheus metrics + Grafana Loki logs

---

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Docker](https://www.docker.com/) & Docker Compose

---

## Installation

### 1. install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
NODE_ENV=development
SWAGGER_ENABLED=true

JWT_SECRET=your-secret-here

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_NAME=trade2db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password-here

PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=your-pgadmin-password-here

MINIO_BUCKET=trade2
MINIO_ROOT_USER=minio
MINIO_ROOT_PASSWORD=your-minio-password-here
```

### 3. Start infrastructure

```bash
# from the project root (AAD/)
docker compose up -d
```

This starts PostgreSQL, MinIO, and pgAdmin.

### 4. Run migrations

```bash
npm run migration:run
```

### 5. Start the API

```bash
# development (watch mode)
npm run start:dev

# or production build
npm start
```

The API is available at `http://localhost:3000`.
Swagger docs are at `http://localhost:3000/documentation`.

---

## Creating the first admin account

The `POST /users` endpoint is public. To create an admin account, send:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "YourPassword123!",
    "firstname": "Your",
    "surname": "Name",
    "role": "admin"
  }'
```

> **Note:** Save the returned user `id` — you will need it to authenticate and manage the platform.

---

## Docker (full stack)

The `docker-compose.yml` in `backend/` runs the full stack including the API:

```bash
docker compose up -d
```

| Service  | URL                          |
|----------|------------------------------|
| API      | http://localhost:80           |
| Swagger  | http://localhost:80/documentation |
| pgAdmin  | http://localhost:5050         |
| MinIO    | http://localhost:9001         |

Migrations run automatically on startup via `migrationsRun: true`.

---

## Database Migrations

Migration files live in `src/database/migrations/`. Each file has an `up` and `down` method.

When the app starts in production, all pending migrations are applied automatically. In development, `synchronize` is disabled — use `npm run migration:run` instead.

To generate a new migration after modifying a TypeORM model:

```bash
npm run migration:generate src/database/migrations/DescriptiveName
```
