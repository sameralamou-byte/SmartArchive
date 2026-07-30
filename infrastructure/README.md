# Infrastructure

Reverse proxy (nginx), TLS termination, and production infra config are not
part of Milestone 1 — the Docker Compose setup at the repo root talks to
each service directly (backend:8000, frontend:5173, minio:9000/9001) for
local development. `nginx/` is a placeholder for the later milestone that
introduces a unified edge/reverse-proxy layer.
