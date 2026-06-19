# Demo Script

1. Start on the dashboard and point out `No secrets stored`, the cloud proof gates, and the three incident scenarios.
2. Click `Run demo` to show the case moving from weak evidence to confirmed containment.
3. Show the risk score, affected scope, and exposure changing as evidence confidence rises.
4. Show response tasks and explain owner mapping plus SLA due times.
5. Show the storage adapter plan and explain why the records are designed for DynamoDB rather than decorative storage.
6. Show database records and explain the single-table shape: `CASE`, `ALERT`, `EVIDENCE`, `TASK`, `AUDIT`, `UPDATE`, `METRIC`, and `HANDOFF`.
7. Show the architecture panel, then use `docs/architecture.svg` as the project architecture diagram.
8. Open `/api/case` to show the same state as JSON.
9. Open `/api/handoff` to show the generated executive handoff markdown.
10. End on the cloud proof gate: live Vercel/v0 deployment and AWS Database screenshot are required before final public submission.
