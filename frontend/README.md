# AuthDesk frontend

Vite + React client for client registration. The FastAPI/Kong backend lives in the root of this repository: [https://github.com/deypurkayasthanaveen/NIC.git](https://github.com/deypurkayasthanaveen/NIC.git).

## Layout

```text
NIC/
  app/               FastAPI API
  kong/              Kong declarative config
  frontend/          Vite + React frontend
```

## Run with Docker

Create `.env` in the root with your Postgres URL (do not commit it):

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@host.docker.internal:5432/nic
```

From the repository root:

```bash
docker compose up --build
```

The frontend image uses Node.js 24 to install locked dependencies with `npm ci`
and run the production build. Nginx serves the resulting `dist/` files on port 80
inside the container, with a fallback to `index.html` for React routes such as
`/submit-form`.

Kong serves the frontend and API on the same origin. It forwards frontend
requests to `frontend:80` and `POST /api/v1/init` to the FastAPI service.

- Frontend: http://127.0.0.1/submit-form
- Kong: http://127.0.0.1 (`POST /api/v1/init`)
- FastAPI docs: http://127.0.0.1:8001/docs

To build only the frontend image from the repository root:

```bash
docker build -t nic-frontend ./frontend
```

## Local frontend development

Run these commands from `frontend/` while the backend stack is running:

```bash
npm ci
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

Vite proxies `/api` to Kong on port 80.
