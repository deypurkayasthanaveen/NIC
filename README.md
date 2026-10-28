# NIC API

A FastAPI service for client registration and transaction management with PostgreSQL, exposed through Kong as an API gateway.

## Architecture

- `app/` — FastAPI application code
- `kong/kong.yml` — Kong declarative route configuration
- `compose.yaml` — Docker services for API and Kong
- `Dockerfile` — application image
- `.env` — local environment variables

## Services

### FastAPI API
- Internal port: `8001`
- Public access: through Kong at `http://127.0.0.1`

### Kong Gateway
- Public port: `80`
- Route: `/api/v1/init`
- Backend target: `http://api:8001`

## Requirements

- Docker and Docker Compose
- Python 3.12+
- PostgreSQL database

## Local setup

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@host.docker.internal:5432/nic
```

Then start the stack:

```bash
docker compose up --build
```

## Access points

- Kong public endpoint: http://127.0.0.1
- Swagger UI (direct app): http://127.0.0.1:8001/docs
- API route through Kong: http://127.0.0.1/api/v1/init

## Kong routing

The gateway is configured in [kong/kong.yml](kong/kong.yml) and forwards requests to the FastAPI service:

```yaml
services:
  - name: nic-api
    url: http://api:8001
    routes:
      - name: nic-init-route
        paths:
          - /api/v1/init
        methods:
          - POST
        strip_path: false
```

## Database setup

Connect to PostgreSQL and create the database if needed:

```sql
CREATE DATABASE nic;
```

Then connect to it:

```sql
\c nic
```

Create the required tables:

```sql
CREATE TABLE IF NOT EXISTS public.registration_transaction (
    transaction_id UUID NOT NULL DEFAULT gen_random_uuid(),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    CONSTRAINT registration_transation_pkey PRIMARY KEY (transaction_id),
    CONSTRAINT valid_status CHECK (status IN ('PENDING', 'COMPLETED'))
);

CREATE TABLE IF NOT EXISTS public.client_request (
    client_id VARCHAR(100) NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    redirect_urls TEXT NOT NULL,
    client_secret VARCHAR(100) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT client_request_pkey PRIMARY KEY (client_id)
);
```

## Notes

- Keep `.env` out of version control.
- The app reads `DATABASE_URL` from the environment.
- Kong is serving the public API entrypoint on port `80`.
- The FastAPI app itself still runs internally on port `8001`.

## Useful checks

```bash
docker compose config
```

```bash
docker compose ps
```

```bash
docker compose logs -f api
```

```bash
docker compose logs -f kong
```
