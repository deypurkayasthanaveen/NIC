# NIC API

A FastAPI service for client registration and transaction management with PostgreSQL.

## Project structure

- `app/main.py` — FastAPI application and endpoints
- `app/database.py` — database engine and session setup
- `app/schemas.py` — request/response models
- `compose.yaml` — container configuration
- `Dockerfile` — image build setup
- `.env` — local environment variables

## Requirements

- Docker and Docker Compose
- Python 3.12+
- PostgreSQL database

## Local setup

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@host.docker.internal:5432/nic
```

Then run:

```bash
docker compose up --build
```

The API will be available at:

- http://127.0.0.1:8001
- Swagger UI: http://127.0.0.1:8001/docs

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
CREATE TABLE IF NOT EXISTS public.registration_transation (
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
- The app uses the `DATABASE_URL` environment variable from the environment.
- The service runs on port `8001`.

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
