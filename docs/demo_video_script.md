# Slack Challenge Demo Video Script

Target length: 2:30 to 2:55.

Use this for the Slack Agent Builder Challenge demo. The script works even before the final Slack sandbox recording is available because it starts from public review pages, then leaves a clean slot for the real Slack command clip once the account-owner gate is complete.

## 0:00 - 0:15: Open

Show:

```text
https://ooyxloo.github.io/incident-zero-stack/slack-agent-review.html
```

Voiceover:

```text
Incident Zero Agent turns incident records into a Slack-ready response brief, evidence summary, and executive handoff. The public review page shows the agent path without exposing workspace credentials or private Slack data.
```

Point at:

- New Slack Agent path
- MCP integration path
- Judge-safe proof path

## 0:15 - 0:45: Slash Command Result

Show:

```text
https://ooyxloo.github.io/incident-zero-stack/slack-message-preview.html
```

Voiceover:

```text
One slash command, such as incident-zero scenario identity severity critical, returns a compact Block Kit-style brief. It includes case severity, risk, owner, affected system, next update time, top actions, evidence signals, and action buttons.
```

Point at:

- Command card
- Risk and owner fields
- Open handoff / List due tasks / Show evidence buttons
- Safety boundary

## 0:45 - 1:20: Working Cockpit

Show:

```text
https://ooyxloo.github.io/incident-zero-stack/
```

Click:

```text
Run demo
```

Voiceover:

```text
The Slack response is not a separate mockup. It is generated from the same deterministic case model used by the incident cockpit. The cockpit tracks risk, owners, due windows, evidence confidence, stakeholder updates, and audit history.
```

Point at:

- Risk score
- Action board
- SLA windows
- Evidence ledger

## 1:20 - 1:55: Handoff And Records

Show:

```text
Executive handoff panel
DynamoDB-shaped records panel
```

Voiceover:

```text
The agent can summarize what happened because the response state is structured. Case, alert, evidence, task, audit, update, metric, and handoff records all use the same model. The executive handoff is generated from case state, not copied from chat screenshots.
```

Point at:

- HANDOFF output
- Record entities
- Evidence confidence

## 1:55 - 2:25: Architecture And MCP

Show:

```text
https://raw.githubusercontent.com/OOYXLOO/incident-zero-stack/master/docs/slack-agent-architecture.svg
```

Voiceover:

```text
The slash command posts to a public HTTPS endpoint. The API core rebuilds the incident case, renders a Slack response, and exposes the same engine through MCP tools for agent workflows: incident zero brief, incident zero handoff, and storage preview.
```

Point at:

- Slack command
- API core
- shared incident engine
- MCP tool surface

## 2:25 - 2:50: Submission Boundary

Show:

```text
https://raw.githubusercontent.com/OOYXLOO/incident-zero-stack/master/docs/slack_challenge_submission_pack.md
```

Voiceover:

```text
The public repository contains source, deterministic demo data, and review assets only. Live Slack tokens, signing secrets, workspace cookies, private messages, customer records, billing data, and final Devpost submission stay in the account-owner flow.
```

Point at:

- Public links
- Submission checklist
- External gates

## Optional 10-second Slack sandbox insert

After the Slack app is created, replace part of the 0:15 to 0:45 segment with a real sandbox clip:

```text
/incident-zero scenario=identity severity=critical
```

Show the same fields and buttons in the real Slack workspace.

Do not show:

- signing secret
- bot token
- app token
- workspace cookies
- billing or payment-method pages
- private messages
- customer data
