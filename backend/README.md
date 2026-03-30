# Backend

Nest.js backend for the Film! project.

## Environment

Create `.env` from `.env.example` and configure PostgreSQL:

```env
DATABASE_DRIVER=postgres
DATABASE_URL=postgres://localhost:5432/prac
DATABASE_USERNAME=prac
DATABASE_PASSWORD=prac
DEBUG=*
```

## Database

SQL files for local test data are stored in `backend/test`:

- `prac.init.sql`
- `prac.films.sql`
- `prac.shedules.sql`

## Commands

```bash
npm install
npm run start:dev
npm run build
npm run lint
npm run test:e2e
```
