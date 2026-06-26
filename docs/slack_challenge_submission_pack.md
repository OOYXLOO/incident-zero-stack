# Incident Zero Agent - Slack Challenge Submission Pack

## Challenge

- Name: Slack Agent Builder Challenge
- URL: https://slackhack.devpost.com/
- Deadline: July 13, 2026 at 5:00pm PDT
- Recommended track: New Slack Agent
- Sandbox tester invites: slackhack@salesforce.com, testing@devpost.com

## Public Links

- Static review URL: https://ooyxloo.github.io/incident-zero-stack/
- Slack agent review page: https://ooyxloo.github.io/incident-zero-stack/slack-agent-review.html
- Public Slack API URL: https://incident-zero-stack.vercel.app/api/slack-agent
- Public Vercel runtime: https://incident-zero-stack.vercel.app
- Source repository: https://github.com/OOYXLOO/incident-zero-stack
- Account-owner deployment runbook: docs/account-owner-deployment-runbook.md
- Slack app manifest template: docs/slack-app-manifest-template.json
- Import-ready Vercel manifest: docs/slack-app-manifest-vercel-20260627.json
- Demo video production pack: docs/demo_video_production_pack.md
- Slash command URL: https://incident-zero-stack.vercel.app/api/slack-agent
- Interactivity request URL: https://incident-zero-stack.vercel.app/api/slack-agent


## Submission Checklist

- [x] Project track: ready - Use New Slack Agent unless a marketplace submission gate is completed.
- [x] Text description: ready - Summarize the Slack incident-response agent, deterministic case records, Block Kit brief, and executive handoff.
- [x] MCP server integration: ready - Run npm run start:mcp to expose incident_zero_brief, incident_zero_handoff, and incident_zero_storage_preview through the official MCP SDK.
- [ ] 3-minute demo video: user-gated - Requires a visible Slack sandbox or local-to-public walkthrough recording.
- [x] Architecture diagram: ready - Use docs/slack-agent-architecture.svg and docs/slack_agent_architecture.md.
- [ ] Slack developer sandbox URL: user-gated - Requires user-owned Slack developer sandbox access and challenge tester invites.
- [ ] Sandbox tester invites: user-gated - Invite slackhack@salesforce.com and testing@devpost.com to the Slack developer sandbox before final submission.
- [ ] Sandbox payment-method verification: user-gated - Slack sandbox creation requires account-owner payment-method verification; do not store payment data in this repository.
- [x] Public HTTPS endpoint: ready - https://incident-zero-stack.vercel.app/api/slack-agent verified with `npm run verify:public -- https://incident-zero-stack.vercel.app`.
- [x] Static review build: ready - https://ooyxloo.github.io/incident-zero-stack/ is for source/demo review only, not Slack slash-command runtime.
- [x] Source repository: ready - https://github.com/OOYXLOO/incident-zero-stack

## Demo Script

Use `docs/demo_video_script.md` for the narration and `docs/demo_video_production_pack.md` for the final recording checklist, timeline, captions, and sensitive-content boundary.

Recommended flow:

1. Open the Slack agent review page.
2. Show the static Slack message preview.
3. Open the public cockpit and run the deterministic incident demo.
4. Show handoff output and structured records.
5. Show the architecture diagram and MCP tool surface.
6. Insert a real Slack sandbox command clip after account-owner setup.
7. Close with the security boundary: no credentials or private workspace data are stored in the repository.

## Architecture Notes

- Submission diagram: docs/slack-agent-architecture.svg
- Diagram notes: docs/slack_agent_architecture.md
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
- The generated Vercel Slack manifest points slash command and interactivity URLs to `https://incident-zero-stack.vercel.app/api/slack-agent`.
- The GitHub Pages static review URL is not a Slack API endpoint.
- Slack sandbox installation, tester invites, demo recording, and Devpost submission remain account-owner gates.

## External Gates

- Create Slack app from the generated manifest.
- Set slash command and interactivity URLs to the deployed /api/slack-agent endpoint.
- Add the app to a Slack sandbox workspace.
- Complete Slack sandbox payment-method verification in the account-owner browser session.
- Invite slackhack@salesforce.com and testing@devpost.com to the Slack sandbox workspace.
- Record a short demo video under three minutes.
- Submit the public app URL, source repository, demo, architecture diagram, and Slack sandbox URL on the challenge platform.
