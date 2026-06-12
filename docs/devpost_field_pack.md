# Devpost Field Pack

Use only after eligibility, Vercel/v0 deployment, AWS Database proof, and final submission gates are cleared.

## Project Name

Incident Zero Stack

## Tagline

A database-backed incident response workspace for evidence, ownership, audit trails, and executive handoff.

## Inspiration

The first hour of a security incident is often messy: alerts, evidence, decisions, and owners scatter across tools. Incident Zero Stack keeps the response state in one database-backed workflow that can be audited later.

## What It Does

The app turns a privileged-token alert into a response plan. It records the case, evidence, tasks, audit events, and executive handoff as database-shaped records, then exposes the same state through a review UI and API.

## How We Built It

The current package is a no-secret local prototype with a deterministic incident state machine, DynamoDB single-table design, browser UI, and cloud-proof checklist. A final H0 submission must deploy the frontend on Vercel/v0 and connect it to a real allowed AWS Database.

## Built With

JavaScript, Node.js, HTML, CSS, DynamoDB single-table design, Vercel deployment plan, AWS Database proof gate.

## Try It Out

Local until public hosting is authorized:

```bash
npm test
npm run check
npm start
```

Then open `http://127.0.0.1:8794/`.

## Gallery Assets

Upload order:

1. `docs/cover.png`
2. `docs/desktop-preview.png`
3. `docs/mobile-preview.png`

Caption:

Local no-secret review build. Live Vercel/v0 deployment, AWS Database usage, AWS proof screenshot, and Devpost final submit remain account-owner gates.

## Honest Gate Statement

This local package does not claim live AWS Database usage, Vercel deployment, or v0 generation. Those must be completed through official account-owner flows before final Devpost submission.
