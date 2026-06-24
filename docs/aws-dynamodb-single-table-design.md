# AWS DynamoDB Single-Table Design

Table: `IncidentZeroCases`

Primary key:

- `PK`: `CASE#<caseId>`
- `SK`: `<ENTITY>#<id-or-timestamp>`

Indexes:

- `GSI1PK`: `OPEN#<SEVERITY>`
- `GSI1SK`: detected or updated timestamp
- `GSI2PK`: `OWNER#<owner>`
- `GSI2SK`: due time or risk ordering

Entities:

- `CASE`: metadata, owner, severity, risk score
- `ALERT`: original alert source and impacted system
- `EVIDENCE`: normalized evidence item
- `TASK`: response task and owner
- `AUDIT`: append-only audit event
- `UPDATE`: stakeholder-safe update draft
- `METRIC`: current risk, confidence, exposure, and scope
- `HANDOFF`: executive summary and analyst next actions

Access patterns:

- Load an incident packet with one `PK = CASE#<caseId>` query.
- List active incidents by severity with `GSI1PK = OPEN#<SEVERITY>`.
- List owner due work with `GSI2PK = OWNER#<owner>`.
- Export executive handoff without scanning chat history or reconstructing state from UI.

Why this fits:

- The incident state is persisted as real operational records, not decorative storage.
- The access patterns are simple enough for a short demo: load one case, query open critical cases, append evidence/audit/task records.

Local adapter boundary:

- `src/incidentZero.js` generates database-shaped records for local review.
- `src/storage.js` provides a local adapter, storage preview, and credential-like value guard.
- A live version should replace the local adapter with AWS SDK calls at the boundary that writes/reads these records.
- Secrets must come from Vercel/AWS environment configuration, never from committed files.
