# Incident Zero Stack

Incident Zero Stack is a no-secret incident response cockpit for alert triage, containment planning, evidence ledgers, stakeholder updates, audit timelines, and executive handoff.

The prototype keeps incident state in deterministic DynamoDB-shaped records so reviewers can inspect how one case is represented as `CASE`, `ALERT`, `EVIDENCE`, `TASK`, `AUDIT`, `UPDATE`, `METRIC`, and `HANDOFF` entities.

## Current Build

- Multi-scenario cockpit for identity, payment, and data-export incidents.
- Local API for rebuilding an incident from adjustable risk inputs.
- Slack-facing agent response layer for slash-command incident briefs.
- MCP stdio server using the official SDK with incident brief, handoff, and storage-preview tools.
- Static review fallback for GitHub Pages when `/api/*` routes are not available.
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
Slack architecture diagram assets are maintained in [docs/slack-agent-architecture.svg](docs/slack-agent-architecture.svg) and [docs/slack_agent_architecture.md](docs/slack_agent_architecture.md).
Account-owner deployment notes are maintained in [docs/account-owner-deployment-runbook.md](docs/account-owner-deployment-runbook.md).
The Slack app manifest template is maintained in [docs/slack-app-manifest-template.json](docs/slack-app-manifest-template.json).
After deploying a public HTTPS API, generate an import-ready Slack manifest with:

```bash
npm run print:deployment-gates -- --public-url <public-url>
npm run export:slack-manifest -- --public-url <public-url>
```

## MCP Server

```bash
npm run start:mcp
```

The MCP server exposes three tools over stdio:

- `incident_zero_brief`
- `incident_zero_handoff`
- `incident_zero_storage_preview`

They reuse the same deterministic incident engine as the browser cockpit and Slack slash-command endpoint. No Slack tokens, signing secrets, workspace cookies, private messages, billing records, or customer data are stored in the repository.

## Static Review Demo

```bash
npm run export:static-demo
```

The static export writes `public/static-demo-data.js`. The browser cockpit uses live `/api/*` routes when they exist and falls back to this deterministic snapshot on static hosts such as GitHub Pages. The fallback is for review and walkthroughs only; Slack slash commands still require a public HTTPS API deployment.

The current static review URL is:

```text
https://ooyxloo.github.io/incident-zero-stack/
```

Slack agent judge-facing review page:

```text
https://ooyxloo.github.io/incident-zero-stack/slack-agent-review.html
```

Static Slack message preview:

```text
https://ooyxloo.github.io/incident-zero-stack/slack-message-preview.html
```

Verify it with:

```bash
npm run verify:static-review -- https://ooyxloo.github.io/incident-zero-stack/
```

Do not use the GitHub Pages URL as the Slack slash-command endpoint. It has no `/api/*` runtime.

GitHub Actions packages the `public/` directory as a static review artifact and includes a Pages deployment workflow for `public/`. Repository Pages may still need to be enabled for GitHub Actions in the repository settings before the Pages URL becomes live.

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
