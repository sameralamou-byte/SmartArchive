"""
Slice 1 fail-closed detector for legacy User/Organization rows.

Does not merge, delete, move documents, or change organization_id.
Used by the Slice 1 migration before users.account_id becomes NOT NULL.
"""
from sqlalchemy import text
from sqlalchemy.engine import Connection


class Slice1LegacyMappingError(RuntimeError):
    """Raised when legacy rows cannot be mapped deterministically."""


def collect_slice1_mapping_ambiguities(conn: Connection) -> list[str]:
    """Return human-readable issue lines. Empty list means 1:1 bootstrap (or no users)."""
    issues: list[str] = []

    duplicate_emails = conn.execute(
        text(
            """
            SELECT email,
                   COUNT(DISTINCT organization_id) AS org_count,
                   array_agg(id::text ORDER BY id) AS user_ids,
                   array_agg(organization_id::text ORDER BY organization_id) AS org_ids
            FROM users
            GROUP BY email
            HAVING COUNT(DISTINCT organization_id) > 1
            """
        )
    )
    for row in duplicate_emails:
        issues.append(
            "duplicate email across organizations: "
            f"email={row.email} user_ids={row.user_ids} organization_ids={row.org_ids}"
        )

    multi_user_orgs = conn.execute(
        text(
            """
            SELECT organization_id::text AS organization_id,
                   COUNT(*) AS user_count,
                   array_agg(id::text ORDER BY id) AS user_ids
            FROM users
            GROUP BY organization_id
            HAVING COUNT(*) > 1
            """
        )
    )
    for row in multi_user_orgs:
        issues.append(
            "organization has multiple users: "
            f"organization_id={row.organization_id} user_ids={row.user_ids}"
        )

    zero_user_orgs = conn.execute(
        text(
            """
            SELECT o.id::text AS organization_id
            FROM organizations o
            LEFT JOIN users u ON u.organization_id = o.id
            WHERE u.id IS NULL
            """
        )
    )
    for row in zero_user_orgs:
        issues.append(f"organization has zero users: organization_id={row.organization_id}")

    orphan_users = conn.execute(
        text(
            """
            SELECT u.id::text AS user_id, u.organization_id::text AS organization_id
            FROM users u
            LEFT JOIN organizations o ON o.id = u.organization_id
            WHERE o.id IS NULL
            """
        )
    )
    for row in orphan_users:
        issues.append(
            "user has invalid/missing organization: "
            f"user_id={row.user_id} organization_id={row.organization_id}"
        )

    duplicate_in_org = conn.execute(
        text(
            """
            SELECT organization_id::text AS organization_id,
                   email,
                   COUNT(*) AS n,
                   array_agg(id::text ORDER BY id) AS user_ids
            FROM users
            GROUP BY organization_id, email
            HAVING COUNT(*) > 1
            """
        )
    )
    for row in duplicate_in_org:
        issues.append(
            "duplicate email inside one organization: "
            f"organization_id={row.organization_id} email={row.email} user_ids={row.user_ids}"
        )

    return issues


def assert_slice1_legacy_mapping_is_deterministic(conn: Connection) -> None:
    issues = collect_slice1_mapping_ambiguities(conn)
    if issues:
        report = "\n".join(f"- {line}" for line in issues)
        raise Slice1LegacyMappingError(
            "Slice 1 migration fail-closed: ambiguous legacy mapping. "
            "STOP. Do not merge, delete, move documents, or change organization_id. "
            "Founder decision required.\n"
            f"{report}"
        )
