# AWS DynamoDB Single-Table Design

Table: `IncidentZeroCases`

Primary key:

- `PK`: `CASE#<caseId>`
- `SK`: `<ENTITY>#<id-or-timestamp>`

Index:

- `GSI1PK`: `OPEN#<SEVERITY>`
- `GSI1SK`: detected or updated timestamp

Entities:

- `CASE`: metadata, owner, severity, risk score
- `ALERT`: original alert source and impacted system
- `EVIDENCE`: normalized evidence item
- `TASK`: response task and owner
- `AUDIT`: append-only audit event
- `HANDOFF`: executive summary and analyst next actions

Why this fits H0:

- DynamoDB is one of the allowed AWS Database options.
- The incident state is persisted as real operational records, not decorative storage.
- The access patterns are simple enough for a short demo: load one case, query open critical cases, append evidence/audit/task records.

Local adapter boundary:

- `src/incidentZero.js` generates database-shaped records for local review.
- A live version should replace the local adapter with AWS SDK calls at the boundary that writes/reads these records.
- Secrets must come from Vercel/AWS environment configuration, never from committed files.
