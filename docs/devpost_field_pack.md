# Devpost Field Pack

Use only after eligibility, Vercel/v0 deployment, AWS Database proof, and final submission gates are cleared.

## Project Name

Incident Zero Stack

## Tagline

A database-first incident response cockpit for evidence, ownership, audit trails, stakeholder updates, and executive handoff.

## Track Fit

B2B application track. The app is designed for security, platform, and operations teams that need a structured first-hour response workflow.

## Inspiration

The first hour of a security incident is messy. Alerts, evidence, decisions, and owners often scatter across chat, ticketing, dashboards, and spreadsheets. Incident Zero Stack keeps that response state in one database-backed workflow so the team can triage quickly and audit the response later.

## What It Does

Incident Zero Stack turns an alert into a live response cockpit:

- Scenario-driven incident intake for identity, payment webhook, and data export cases.
- Risk scoring from severity, evidence confidence, affected scope, customer impact, exposure, and containment state.
- Response tasks with owners, due windows, and acceptance criteria.
- Evidence records with confidence and integrity hashes.
- Stakeholder update drafts and an executive handoff markdown export.
- DynamoDB-shaped records for `CASE`, `ALERT`, `EVIDENCE`, `TASK`, `AUDIT`, `UPDATE`, `METRIC`, and `HANDOFF`.
- Cloud readiness checks that clearly separate local review from live deployment requirements.

## How We Built It

The local build uses plain JavaScript, Node.js, static browser UI, and serverless-compatible API modules. The same API core powers the local server and Vercel serverless entrypoints.

The database model is designed around DynamoDB single-table access patterns:

- Load an incident packet by `PK = CASE#<caseId>`.
- Query active incidents by severity through `GSI1`.
- Query owner due work through `GSI2`.
- Export an executive handoff without reconstructing state from chat or screenshots.

The live deployment boundary is explicit: `src/dynamoAdapter.js` builds DynamoDB write requests and readiness checks, while account-owner environment configuration controls the live database gate.

## Built With

JavaScript, Node.js, HTML, CSS, Vercel serverless functions, DynamoDB single-table design.

## Try It Out

Local review:

```bash
npm test
npm run check
npm start
```

Then open:

```text
http://127.0.0.1:8794/
```

After public deployment:

```bash
npm run verify:public -- <public-url>
```

## Useful URLs After Deployment

Replace `<public-url>` with the deployed Vercel URL.

```text
<public-url>/
<public-url>/api/health
<public-url>/api/scenarios
<public-url>/api/case?scenario=payments
<public-url>/api/schema
<public-url>/api/handoff?scenario=data
<public-url>/api/storage-preview?scenario=identity
<public-url>/api/cloud-readiness
```

## Architecture Diagram

Use:

```text
docs/architecture.svg
```

## Demo Video Script

Use:

```text
docs/demo_video_script.md
```

Keep the video under 3 minutes. Show the working dashboard, `Run demo`, task board, storage adapter plan, DynamoDB-shaped records, architecture diagram, `/api/case`, and `/api/handoff`.

## Gallery Assets

Recommended order:

1. `docs/cover.png`
2. `docs/desktop-preview.png`
3. `docs/architecture.svg`
4. `docs/mobile-preview.png`

Suggested caption:

```text
Incident Zero Stack local review build. The app separates local review from live cloud readiness and requires account-owner confirmation before any public deployment or database proof is claimed.
```

## Submission Notes To Review Before Final Submit

- Text description should name DynamoDB as the selected AWS Database.
- Add the public Vercel URL only after `npm run verify:public -- <public-url>` passes.
- Add the architecture diagram from `docs/architecture.svg`.
- Add AWS Database proof only after the account owner confirms the screenshot contains no private account details.
- Do not include credentials, cookies, tokens, billing pages, tax forms, identity documents, or private customer data.
