# AuthDesk frontend

Vite + React client for client registration. The FastAPI/Kong backend lives in the root of this repository: [https://github.com/deypurkayasthanaveen/NIC.git](https://github.com/deypurkayasthanaveen/NIC.git).

## Layout

```text
NIC/
  app/               FastAPI API
  kong/              Kong declarative config
  frontend/          Vite + React frontend
```

## Backend

Create `.env` in the root with your Postgres URL (do not commit it):

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@host.docker.internal:5432/nic
```

```bash
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
