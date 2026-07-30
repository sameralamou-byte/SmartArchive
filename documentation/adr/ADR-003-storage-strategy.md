# ADR-003 — Object storage strategy (MinIO, S3-compatible)

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-30 |
| Related | SA-ARCH-001 |

## Context
Documents (the core product artifact) need durable binary storage separate
from the relational database, with support for versioning, presigned
download URLs, and a migration path to any major cloud's object storage.

## Decision
MinIO in development/self-hosted deployments, accessed through the S3 API.
`app/services/storage_service.py` only uses S3-compatible operations
(put/get/remove/presigned URL) so swapping to AWS S3, Azure Blob (via its
S3-compatible gateway), or GCS is a configuration change, not a code
rewrite.

## Alternatives considered
- **Store files in PostgreSQL (bytea/large objects).** Rejected: bloats
  the database, complicates backups, and doesn't scale to the "millions of
  documents" performance target in the master project instructions.
- **Local filesystem storage.** Rejected: doesn't survive container
  restarts without careful volume management, no built-in versioning or
  presigned URLs, and doesn't map cleanly to cloud deployment later.
- **Committing directly to a specific cloud provider's SDK (e.g. `boto3`
  hardcoded to AWS).** Rejected for Phase 1: the master stack lists AWS,
  Azure, and GCP as all in scope, and MinIO's S3-compatible API keeps the
  door open without picking a cloud prematurely.

## Consequences
- File content validation (size, MIME sniffing, antivirus hook — Milestone
  1.5) happens in the application layer before the upload call, since MinIO
  itself does not validate content.
- Presigned URLs are time-limited (15 minutes by default) rather than
  permanent public links, consistent with the security-by-design principle.
