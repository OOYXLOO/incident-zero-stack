# Incident Zero Stack

Incident Zero Stack is a no-secret incident response cockpit for alert triage, containment planning, evidence ledgers, stakeholder updates, audit timelines, and executive handoff.

The prototype keeps incident state in deterministic DynamoDB-shaped records so reviewers can inspect how one case is represented as `CASE`, `ALERT`, `EVIDENCE`, `TASK`, `AUDIT`, `UPDATE`, `METRIC`, and `HANDOFF` entities.

## Current Build

- Multi-scenario cockpit for identity, payment, and data-export incidents.
- Local API for rebuilding an incident from adjustable risk inputs.
- Slack-facing agent response layer for slash-command incident briefs.
- Browser UI with action board, SLA windows, evidence ledger, database records, access patterns, stakeholder updates, audit timeline, and cloud proof gates.
- No credentials, tokens, cookies, billing data, account-owner documents, or private customer data.
- CI-ready checks for syntax, deterministic tests, and public wording guard.
- Public status notes are maintained in [docs/public_status.md](docs/public_status.md).

## Quick Start

```bash
npm test
npm run check
npm start
```

Then open:

```text
http://127.0.0.1:8794/
```

Useful local endpoints:

```text
GET  /api/health
GET  /api/scenarios
GET  /api/case
POST /api/case
GET  /api/schema
GET  /api/slack-agent
POST /api/slack-agent
```

Slack agent handoff notes are maintained in [docs/slack_agent_handoff.md](docs/slack_agent_handoff.md).
Slack challenge submission notes are maintained in [docs/slack_challenge_submission_pack.md](docs/slack_challenge_submission_pack.md).

## Project Shape

```text
api/      Vercel serverless API entrypoints
public/   Browser cockpit
src/      Incident model and local server
tests/    Deterministic model and HTTP checks
docs/     Review assets and deployment notes
```

The same API logic powers local `src/server.js` and Vercel functions under `api/`.

## Cloud Boundary

This repository is local-first. A production or challenge submission path should be completed only through account-owner flows for hosting, database provisioning, screenshots, and final publication.
