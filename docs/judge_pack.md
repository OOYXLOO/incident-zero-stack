# Incident Zero Stack Judge Pack

## One-Line Summary

Incident Zero Stack is a database-backed security incident response workspace for triage, evidence, audit events, and executive handoff.

## Demo Path

1. Run `npm test` and `npm run check`.
2. Run `npm start`.
3. Open `http://127.0.0.1:8794/`.
4. Inspect the case panel, response tasks, database records, audit timeline, and cloud proof gates.
5. Open `http://127.0.0.1:8794/api/case`.
6. Open `http://127.0.0.1:8794/api/schema`.

## Gallery Assets

- `docs/cover.png`
- `docs/desktop-preview.png`
- `docs/mobile-preview.png`
- Upload order and captions: `docs/devpost_gallery_assets.md`

## What Is Real Now

- Deterministic incident workflow.
- DynamoDB-shaped records for case, alert, evidence, task, audit, and handoff entities.
- Local review UI.
- No-secret proof gates for AWS and Vercel.

## What Requires Account-Owner Action

- Vercel/v0 project creation and deployment.
- AWS Database creation and proof screenshot.
- Any cloud credentials, billing controls, or credits.
- Devpost final submission.
- Prize claim, payout, tax, and KYC.

## H0 Positioning

This project uses a real database-shaped workflow: incident state transitions and evidence records are central to the app. The AWS database is not a decorative backend; it is the source of truth for the response timeline and audit handoff.
