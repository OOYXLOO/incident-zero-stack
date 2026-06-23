# Slack Agent Handoff

Incident Zero Agent adds a Slack-facing response layer to the local incident cockpit. It turns deterministic incident records into a slash-command response with action buttons, evidence signals, and executive handoff metadata.

## What Is Included

- Shared API route: `GET /api/slack-agent` and `POST /api/slack-agent`
- Vercel function: `api/slack-agent.js`
- Slack response builder: `src/slackAgent.js`
- Submission pack export: `npm run export:slack-agent-pack -- --public-url <deployment-url>`
- Tests for response shape, manifest URL generation, slash-command text parsing, local HTTP routing, and the Vercel wrapper

## Slash Command Examples

```text
/incident-zero scenario=identity severity=critical
/incident-zero scenario=payments contained=false
/incident-zero scenario=data confidence=92 users=18
```

Slack form posts should send the command text as `text`. For local testing, post URL-encoded form data to:

```text
/api/slack-agent?contentType=form
```

## Manifest Draft

The generated manifest draft points the slash command and interactivity request URL at the deployed endpoint:

```bash
npm run export:slack-agent-pack -- --public-url https://your-deployment.example
```

Use the `manifest` field from the JSON output as the starting point for a Slack app in a sandbox workspace.

## Demo Flow

1. Open the browser cockpit and show one deterministic incident case.
2. Run `/incident-zero scenario=identity severity=critical` in the sandbox workspace.
3. Show the agent brief, top actions, evidence signals, and action buttons.
4. Open the executive handoff in the cockpit.
5. Explain that the repository stores no workspace credentials, signing secrets, private messages, customer data, or billing records.

## Account-Owner Steps

These steps are intentionally outside the repository:

- Create the Slack app in a sandbox workspace.
- Configure the slash command URL and interactivity request URL.
- Store the signing secret and bot token only in the platform environment.
- Deploy the endpoint to a public HTTPS host.
- Record the short demo and provide sandbox access through the challenge platform.

## Safety Boundary

This repository contains deterministic demo records and public review assets only. It does not store Slack tokens, signing secrets, cookies, customer messages, payment data, or private workspace exports.
