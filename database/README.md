# Database

- `init/` — runs automatically, once, only on a brand-new Postgres data volume
  (Docker's `docker-entrypoint-initdb.d` mechanism). Extension bootstrap only.
- `seeds/` — run manually after `alembic upgrade head`, for baseline reference
  data (e.g. the permission catalogue).

All actual schema (tables, RLS policies) lives in `backend/alembic/versions/`
and is the single source of truth for the database structure. Never modify
the schema by hand against a running database — always add a new Alembic
revision.

## Applying migrations

```bash
docker compose exec backend alembic upgrade head
```

## Seeding baseline permissions

```bash
docker compose exec -T postgres psql -U smartarchive -d smartarchive < database/seeds/001_baseline_permissions.sql
```
