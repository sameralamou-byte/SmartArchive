# Known Issues — SmartArchive

A running backlog of confirmed-real problems that are deliberately deferred rather than chased individually as they're found. Each entry must be verified before it goes here.

## Priority — for later processing

### HSA Privacy & Control, Security, Pricing, About — fully removed from the software (2026-09-24)

**Founder decision:** these four pages, and the images used to build them, are not trusted and are removed entirely — not just unlinked from navigation. Routes deleted from both `/dev/founder-page-review/hsa-website` and `/hsa` in `frontend/src/routes/AppRoutes.tsx`; the pages are no longer reachable anywhere in the running software, including by direct URL.

**What's preserved, not deleted:** the component source files (`HsaWebsitePrivacyAndControl`, `HsaWebsiteSecurity`, `HsaWebsitePricing`, `HsaWebsiteAbout` in `HsaWebsitePages.tsx`) and their imports still exist in the codebase — only the route wiring was removed. This keeps the change reversible; nothing was destructively deleted.

**Background:** these four pages went through repeated design-reference cycles this session with real, confirmed problems along the way (a wrong reused hero photo on Security, missing section icons, content drift from frozen references, a nav restructure Cursor invented and had to be reverted). The Founder's trust in this specific content broke down over the course of that churn, independent of any single remaining technical defect — logged here as the reason for full removal rather than continued fixing.

**Next step, when revisited:** don't just re-add the routes. Start from a fresh, explicit re-scoping conversation with the Founder about what these pages should actually contain, rather than assuming the last frozen state is still wanted.
