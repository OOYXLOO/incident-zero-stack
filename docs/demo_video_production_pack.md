# Demo Video Production Pack - Slack Agent Builder Challenge

Target: a 2:30 to 2:55 demo for the Slack Agent Builder Challenge.

Use this pack when recording the final video. It is designed so the video can be recorded quickly after the Slack sandbox gate is complete, while still allowing a public-only rehearsal from GitHub Pages and Vercel.

## Final Video Rule

The final challenge video should show a real Slack sandbox slash-command result if the sandbox is available. If the sandbox is not available yet, use this pack only for rehearsal and reviewer preparation; do not claim live Slack installation proof until it exists.

## Recording Setup

Open these tabs before recording:

1. Slack agent review page:

```text
https://ooyxloo.github.io/incident-zero-stack/slack-agent-review.html
```

2. Static Slack message preview:

```text
https://ooyxloo.github.io/incident-zero-stack/slack-message-preview.html
```

3. Public cockpit:

```text
https://ooyxloo.github.io/incident-zero-stack/
```

4. Architecture diagram:

```text
https://raw.githubusercontent.com/OOYXLOO/incident-zero-stack/master/docs/slack-agent-architecture.svg
```

5. Submission pack:

```text
https://raw.githubusercontent.com/OOYXLOO/incident-zero-stack/master/docs/slack_challenge_submission_pack.md
```

6. Slack sandbox workspace after account-owner setup.

## Timeline

### 0:00 - 0:12: Hook

Screen:

```text
Slack agent review page
```

Voiceover:

```text
This is Incident Zero Agent: a Slack incident-response agent that turns one command into a structured brief, evidence signals, due actions, and executive handoff.
```

Show:

- project name,
- Slack agent path,
- public endpoint,
- source repository.

### 0:12 - 0:42: Slack command result

Preferred final screen:

```text
Real Slack sandbox
```

Command:

```text
/incident-zero scenario=identity severity=critical
```

Fallback rehearsal screen:

```text
https://ooyxloo.github.io/incident-zero-stack/slack-message-preview.html
```

Voiceover:

```text
The agent returns a compact Block Kit-style incident brief: severity, risk, owner, affected system, next update time, top actions, evidence signals, and handoff buttons.
```

Show:

- command text,
- risk and owner fields,
- evidence confidence,
- Open handoff / due tasks / evidence buttons.

### 0:42 - 1:20: Same engine in the cockpit

Screen:

```text
https://ooyxloo.github.io/incident-zero-stack/
```

Action:

```text
Run demo
```

Voiceover:

```text
The Slack response is generated from the same deterministic incident model used by the cockpit. Reviewers can inspect actions, SLA windows, evidence, stakeholder updates, and audit history without needing private workspace data.
```

Show:

- risk score,
- top actions,
- SLA window,
- evidence ledger.

### 1:20 - 1:55: Handoff and records

Screen:

```text
Cockpit handoff and storage preview sections
```

Voiceover:

```text
The handoff is generated from structured case state. Case, alert, evidence, task, audit, update, metric, and handoff records use one model, so the Slack agent and the review cockpit explain the same incident.
```

Show:

- executive handoff,
- DynamoDB-shaped records,
- evidence confidence and audit records.

### 1:55 - 2:25: Architecture and MCP path

Screen:

```text
https://raw.githubusercontent.com/OOYXLOO/incident-zero-stack/master/docs/slack-agent-architecture.svg
```

Voiceover:

```text
The slash command posts to a public HTTPS endpoint. The shared API core builds the case, renders the Slack response, and also exposes the same engine through MCP tools for agent workflows: brief, handoff, and storage preview.
```

Show:

- Slack command,
- Vercel endpoint,
- API core,
- MCP tools.

### 2:25 - 2:50: Safety and submission boundary

Screen:

```text
https://raw.githubusercontent.com/OOYXLOO/incident-zero-stack/master/docs/slack_challenge_submission_pack.md
```

Voiceover:

```text
The repository contains source code, deterministic demo records, public review pages, and submission materials only. Slack tokens, signing secrets, workspace cookies, payment pages, private messages, and customer records stay outside the repository.
```

Show:

- public links,
- submission checklist,
- external gates.

## Captions

Use these short captions if the video editor allows text overlays:

```text
One command -> structured incident brief
Same engine powers Slack, cockpit, and MCP tools
No workspace secrets or private messages in the repo
Public Vercel endpoint for slash-command runtime
GitHub Pages review surface for judges
```

## Must Hide

Do not show these in the video:

- Slack signing secret,
- bot token,
- app token,
- workspace cookies,
- payment-method pages,
- billing pages,
- private Slack messages,
- customer records,
- email inboxes,
- Devpost account settings,
- any password, OTP, API key, or session token.

## Final Upload Checklist

Before uploading the demo video:

- The video is under 3 minutes.
- The first 15 seconds state what the agent does.
- A slash-command result is visible, or the video clearly says the visible page is a public preview.
- The public Vercel endpoint is visible or referenced.
- The source repository is visible or referenced.
- The safety boundary is stated.
- No sensitive account, billing, token, cookie, customer, or private message content is visible.

## Rehearsal Command

Use this public API check before recording:

```bash
npm run verify:public -- https://incident-zero-stack.vercel.app
npm run audit:slack-submission -- --public-url https://incident-zero-stack.vercel.app
```

The final Slack sandbox clip remains an account-owner gate. This file prepares the recording path but does not replace the real sandbox proof.
