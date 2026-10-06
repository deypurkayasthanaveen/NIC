# NIC Admin Panel

A frontend-only admin panel built with React, TypeScript, and Vite. All data is local mock data: there is no backend, no API calls, and no real authentication.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
```

Log in with any non-empty username and password.

## Features

- Static login with a frontend route guard ("Remember me" keeps you signed in across browser restarts)
- Dashboard with summary cards, recent activity, and two charts
- Users: search, role/status filters, sorting, pagination, create / view / edit / delete
- Roles: CRUD with a permission checkbox grid (demonstration only)
- Data: generic records CRUD built from the same table, toolbar, and modal components
- Settings: profile, light/dark theme, preferences, static security UI
- Toast notifications, loading / empty / error states, responsive layout with a mobile drawer

## Project structure

```text
src/
  components/   common UI, layout, table, and form building blocks
  context/      Auth, Theme, Toast, and Layout providers
  data/         mock seed data
  hooks/        reusable hooks (useAsync, useTableState, useLocalStorage, ...)
  pages/        one folder per screen
  routes/       route table and auth guards
  services/     in-memory data access layer
  types/        shared TypeScript types
  utils/        formatting, validation, safe storage helpers
```

## Data and persistence

Pages never import mock data directly; they call `services/*Service.ts`, which keep an in-memory copy of the seed data and return Promises with a short simulated delay. CRUD changes therefore survive navigation but reset on page refresh. To connect a real backend later, replace the bodies of the service functions with HTTP calls; pages and hooks stay unchanged.

Only the auth flag, theme, sidebar state, preferences, and profile are stored in `localStorage` (or `sessionStorage` for logins without "Remember me").
