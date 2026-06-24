# Slack Agent Architecture

Use `docs/slack-agent-architecture.svg` as the architecture diagram for the Slack Agent Builder Challenge submission.

## Flow

1. A reviewer or operator runs `/incident-zero scenario=identity severity=critical` in a Slack sandbox.
2. Slack sends a signed form post to the public HTTPS endpoint at `/api/slack-agent`.
3. The Vercel handler calls the shared API core used by the browser cockpit.
4. The API core parses command text, rebuilds a deterministic incident case, and derives risk, evidence, tasks, audit notes, and handoff metadata.
5. The Slack response builder returns a Block Kit incident brief with actions and handoff links.
6. The MCP stdio server exposes the same incident engine as `incident_zero_brief`, `incident_zero_handoff`, and `incident_zero_storage_preview`.

## Review Points

- One command returns a compact incident brief instead of a generic chatbot transcript.
- Browser cockpit, Slack endpoint, and MCP tools all reuse the same deterministic incident model.
- DynamoDB-shaped records make the case auditable even when the public demo runs without a live database.
- The static GitHub Pages demo remains useful for reviewers while public slash commands require a deployed HTTPS API.

## Safety Boundary

Slack tokens, signing secrets, private messages, workspace cookies, billing data, and customer records stay in account-owner systems. The repository contains deterministic demo records, source code, generated submission notes, and review assets only.
