# Devpost Field Pack - Slack Agent Builder Challenge

Use this for the Slack Agent Builder Challenge after the account-owner gates are complete.

Challenge:

```text
https://slackhack.devpost.com/
```

## Project Name

Incident Zero Agent

## Tagline

A Slack incident-response agent that turns deterministic case records into briefs, evidence signals, due actions, and executive handoff.

## Recommended Track

New Slack Agent

## Inspiration

The first hour of an incident is noisy. Important context gets split across alerts, Slack messages, dashboards, tickets, and update drafts. Incident Zero Agent is designed to make the first Slack response structured: one command returns the case risk, owner, top actions, evidence signals, next update timing, and handoff entry points.

## What It Does

Incident Zero Agent accepts slash-command style scenario input and returns a Slack-ready incident brief:

- Risk, severity, owner, affected system, and next update window.
- Top response actions with owners and acceptance criteria.
- Evidence signals with status and confidence.
- Action buttons for handoff, due tasks, and evidence review.
- A static cockpit for reviewers to inspect the same underlying case model.
- MCP tools for the same incident engine: `incident_zero_brief`, `incident_zero_handoff`, and `incident_zero_storage_preview`.

The public review build is intentionally no-secret. It contains deterministic demo records, review pages, generated docs, and source code only.

## How We Built It

The project uses plain JavaScript, Node.js, serverless-compatible API handlers, a static browser cockpit, a Slack response builder, and an MCP stdio server using the official SDK.

The shared incident engine builds deterministic cases for identity, payment, and data-export scenarios. The browser cockpit, Slack endpoint, and MCP tools all reuse that engine so the same state can be reviewed visually, returned through Slack, or exposed to agent workflows.

The Slack app manifest template points slash commands and interactivity to a public HTTPS `/api/slack-agent` endpoint after deployment. Live workspace credentials stay outside the repository.

## Built With

```text
JavaScript
Node.js
Slack slash commands
Slack Block Kit response structure
MCP SDK
Vercel-compatible serverless API
GitHub Pages static review build
```

## Public Links

Static cockpit:

```text
https://ooyxloo.github.io/incident-zero-stack/
```

Slack agent review:

```text
https://ooyxloo.github.io/incident-zero-stack/slack-agent-review.html
```

Slack message preview:

```text
https://ooyxloo.github.io/incident-zero-stack/slack-message-preview.html
```

Source repository:

```text
https://github.com/OOYXLOO/incident-zero-stack
```

Submission pack:

```text
https://raw.githubusercontent.com/OOYXLOO/incident-zero-stack/master/docs/slack_challenge_submission_pack.md
```

## Try It Locally

```bash
npm test
npm run check
npm start
```

Then open:

```text
http://127.0.0.1:8794/
```

Useful endpoints after public deployment:

```text
<public-url>/api/health
<public-url>/api/scenarios
<public-url>/api/slack-agent
<public-url>/api/handoff?scenario=identity
<public-url>/api/storage-preview?scenario=identity
```

## Demo Video

Use:

```text
docs/demo_video_script.md
```

Keep the video under three minutes. Start with the public Slack review page, show the Slack message preview, show the cockpit, show the architecture, and insert a real sandbox slash-command clip after the Slack app is created.

## Architecture Diagram

Use:

```text
docs/slack-agent-architecture.svg
```

## Gallery Assets

Recommended order:

1. `docs/cover.png`
2. `docs/slack-agent-architecture.svg`
3. `docs/desktop-preview.png`
4. `docs/mobile-preview.png`

## Final Submission Notes

- Add the public HTTPS API URL only after deployment is complete.
- Add the Slack sandbox URL only after the app is created and tester access is configured.
- Invite `slackhack@salesforce.com` and `testing@devpost.com` as required by the challenge.
- Do not include Slack tokens, signing secrets, workspace cookies, payment-method pages, private messages, customer records, billing data, tax/KYC data, or account-owner screenshots with sensitive details.
