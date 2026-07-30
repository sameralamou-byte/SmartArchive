-- Runs once, automatically, only against a brand-new Postgres data volume
-- (docker-entrypoint-initdb.d). Table creation and RLS policies live in
-- backend/alembic/versions -- this file only bootstraps extensions that
-- migrations depend on.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
