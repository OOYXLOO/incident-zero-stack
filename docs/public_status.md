# Public Status

Incident Zero Stack is ready for source review as a local-first incident response cockpit. The repository intentionally ships with deterministic demo data and no private customer material.

## What Is Ready

- Browser cockpit for incident triage, containment, evidence review, stakeholder updates, audit timeline, and executive handoff.
- Static GitHub Pages review build: `https://ooyxloo.github.io/incident-zero-stack/`
- Slack agent review page: `https://ooyxloo.github.io/incident-zero-stack/slack-agent-review.html`
- Public Vercel HTTPS runtime: `https://incident-zero-stack.vercel.app`
- Slack API endpoint: `https://incident-zero-stack.vercel.app/api/slack-agent`
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
npm run verify:public -- https://incident-zero-stack.vercel.app
npm run audit:slack-submission -- --public-url https://incident-zero-stack.vercel.app
npm run export:slack-manifest -- --public-url https://incident-zero-stack.vercel.app
```

The current Vercel deployment verified:

```text
home, health, scenarios, case, schema, handoff, storage-preview, and cloud-readiness all passed.
```

## Publication Boundary

The repository is safe to publish as source code. The public HTTPS runtime is live on Vercel. Optional DynamoDB provisioning, Slack sandbox installation, screenshots, demo video, tester invites, and final platform submission still depend on account-owner flows.

The GitHub Pages URL is a static review surface only. It must not be used as the Slack slash-command URL because it does not provide the `/api/*` runtime.
