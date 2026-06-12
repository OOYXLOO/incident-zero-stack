# Incident Zero Stack

Incident Zero Stack is a local no-secret prototype for H0: Hack the Zero Stack with Vercel v0 and AWS Databases.

It models a security incident-response application where alert intake, response ownership, evidence, audit events, and executive handoff are persisted as database records. The current package uses an in-memory/local adapter for review and includes a DynamoDB single-table design for the required AWS Database proof path.

## Current Status

- Local deterministic prototype only.
- No AWS keys, Vercel tokens, cookies, billing data, payout data, or cloud screenshots are stored.
- Real Vercel/v0 deployment, AWS Database creation, AWS usage screenshot, Devpost final submission, and prize payout/tax/KYC remain account-owner gates.

## Quick Start

```bash
npm test
npm run check
npm start
```

Then open `http://127.0.0.1:8794/`.

## Local Review

- `/api/case` returns a full incident case, database-shaped records, audit trail, and proof gates.
- `/api/schema` returns the DynamoDB single-table schema proposal.
- The browser UI shows triage queue, response plan, database records, audit timeline, and cloud proof gates.

## Honest Scope

This package does not claim live AWS Database usage, a Vercel deployment, or v0 generation. Those must be completed through official account-owner flows before a final H0 submission.
