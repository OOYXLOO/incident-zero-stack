# Public Status

Incident Zero Stack is ready for source review as a local-first incident response cockpit. The repository intentionally ships with deterministic demo data and no private customer material.

## What Is Ready

- Browser cockpit for incident triage, containment, evidence review, stakeholder updates, audit timeline, and executive handoff.
- Static GitHub Pages review build: `https://ooyxloo.github.io/incident-zero-stack/`
- Slack agent review page: `https://ooyxloo.github.io/incident-zero-stack/slack-agent-review.html`
- Local API and Vercel-compatible serverless handlers share the same core incident model.
- Slack-facing agent endpoint returns deterministic incident briefs for slash command review.
- DynamoDB-shaped records are documented for `CASE`, `ALERT`, `EVIDENCE`, `TASK`, `AUDIT`, `UPDATE`, `METRIC`, and `HANDOFF` entities.
- Gallery assets and submission field notes are available under `docs/`.
- Local verification covers syntax checks, deterministic model tests, public wording checks, and launch readiness review.

## Verification Commands

```bash
npm test
npm run check
npm run audit:local
npm run verify:static-review -- https://ooyxloo.github.io/incident-zero-stack/
npm run export:slack-agent-pack -- --public-url <deployment-url>
```

For a deployed preview, run:

```bash
npm run verify:public -- --base-url <deployment-url>
```

## Publication Boundary

The repository is safe to publish as source code. Live cloud proof still depends on an account-owner deployment flow for hosting, optional DynamoDB provisioning, screenshots, and final platform submission.

The GitHub Pages URL is a static review surface only. It must not be used as the Slack slash-command URL because it does not provide the `/api/*` runtime.
