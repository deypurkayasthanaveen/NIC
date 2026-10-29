# AuthDesk frontend

Vite + React client for client registration. The FastAPI/Kong backend lives in `NIC/` in this same repository: [https://github.com/deypurkayasthanaveen/NIC.git](https://github.com/deypurkayasthanaveen/NIC.git).

## Layout

```text
frontend/          this Vite app
  NIC/             FastAPI API and Kong gateway
```

## Backend

Create `NIC/.env` with your Postgres URL (do not commit it):

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@host.docker.internal:5432/nic
```

```bash
cd NIC
docker compose up --build
```

- Kong: http://127.0.0.1 (`POST /api/v1/init`)
- FastAPI docs: http://127.0.0.1:8001/docs

## Frontend

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

Vite proxies `/api` to Kong on port 80.
