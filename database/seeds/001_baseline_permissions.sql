-- Baseline RBAC permission catalogue (global, not tenant-scoped).
-- Run manually after migrations: docker compose exec postgres psql -U smartarchive -d smartarchive -f /path/to/this/file
-- or via the backend's own seed script once one exists (Stage 2 concern).
INSERT INTO permissions (id, code, description) VALUES
    (gen_random_uuid(), 'document.read',   'View a document'),
    (gen_random_uuid(), 'document.create', 'Upload a document'),
    (gen_random_uuid(), 'document.update', 'Edit document metadata'),
    (gen_random_uuid(), 'document.delete', 'Delete a document'),
    (gen_random_uuid(), 'user.manage',     'Create/update/deactivate users'),
    (gen_random_uuid(), 'role.manage',     'Create/update roles and permission assignments')
ON CONFLICT (code) DO NOTHING;
