# Incident Zero Agent - Slack Challenge Submission Pack

## Challenge

- Name: Slack Agent Builder Challenge
- URL: https://slackhack.devpost.com/
- Deadline: July 13, 2026 at 5:00pm PDT
- Recommended track: New Slack Agent

## Public Links

- Public app URL: pending user gate: public HTTPS deployment URL
- Source repository: https://github.com/OOYXLOO/incident-zero-stack
- Manifest draft: pending public deployment URL. Replace `<public-deployment-url>` with the deployed HTTPS base URL, then regenerate or import the manifest.
- Slash command URL: <public-deployment-url>/api/slack-agent
- Interactivity request URL: <public-deployment-url>/api/slack-agent


## Submission Checklist

- [x] Project track: ready - Use New Slack Agent unless a marketplace submission gate is completed.
- [x] Text description: ready - Summarize the Slack incident-response agent, deterministic case records, Block Kit brief, and executive handoff.
- [x] MCP server integration: ready - Run npm run start:mcp to expose incident_zero_brief, incident_zero_handoff, and incident_zero_storage_preview through the official MCP SDK.
- [ ] 3-minute demo video: user-gated - Requires a visible Slack sandbox or local-to-public walkthrough recording.
- [x] Architecture diagram: ready - Use the architecture notes in this pack for the diagram labels.
- [ ] Slack developer sandbox URL: user-gated - Requires user-owned Slack developer sandbox access and challenge tester invites.
- [ ] Public HTTPS endpoint: user-gated - Deploy first, then set slash command and interactivity URLs to /api/slack-agent.
- [x] Source repository: ready - https://github.com/OOYXLOO/incident-zero-stack

## Demo Script

1. Open the public cockpit and show the deterministic incident case.
2. Run the Slack command example in the sandbox workspace.
3. Point out the agent brief, top actions, evidence signals, and handoff buttons.
4. Open the executive handoff and explain that it is generated from case records, not copied from chat.
5. Close with the security boundary: no credentials or private workspace data are stored in the repository.

## Architecture Notes

- The slash command posts to /api/slack-agent.
- The Vercel handler calls the shared API core.
- The API core rebuilds a deterministic incident case from request inputs.
- The Slack response renders Block Kit fields, action buttons, evidence, and handoff metadata.
- The MCP server exposes the same incident engine as tools for agent workflows: incident_zero_brief, incident_zero_handoff, and incident_zero_storage_preview.
- Live workspace configuration stays outside the repository.

## Judging Fit

- Technological Implementation: shared incident API, Vercel handler, deterministic case model, Block Kit response, MCP server tools, and credential guards.
- Design: one slash command returns a compact executive brief with actions, evidence, and handoff entry points.
- Potential Impact: helps small teams coordinate incident response without exposing private Slack messages or credentials.
- Quality of Idea: turns incident response into an auditable Slack agent workflow rather than another generic chatbot.

## Slash Command Examples

- `/incident-zero scenario=identity severity=critical`
- `/incident-zero scenario=payments contained=false`
- `/incident-zero scenario=data confidence=92 users=18`

## Safety Boundary

- No Slack tokens, signing secrets, workspace cookies, private messages, customer data, billing records, or credentials are stored in this repository.
- The generated Slack manifest uses placeholder public URLs until the user configures a real sandbox workspace.
- Live deployment and Devpost submission remain account-owner gates.

## External Gates

- Create Slack app from the generated manifest.
- Set slash command and interactivity URLs to the deployed /api/slack-agent endpoint.
- Add the app to a Slack sandbox workspace.
- Record a short demo video under three minutes.
- Submit the public app URL, source repository, demo, architecture diagram, and Slack sandbox URL on the challenge platform.
