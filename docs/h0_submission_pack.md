# H0 Submission Pack

Use this pack for the H0 Hack the Zero Stack submission path after the account-owner cloud gates are complete.

Challenge:

```text
https://h01.devpost.com/
```

## Project Name

Incident Zero Stack

## Tagline

A Vercel-hosted incident cockpit that turns alerts into DynamoDB-shaped response records, evidence trails, and executive handoffs.

## Recommended Category

Vercel application with AWS DynamoDB-backed incident state.

## Inspiration

Incident response tools often show either a raw alert stream or a final ticket. The hard part is the middle: turning noisy signals into an auditable sequence of decisions, owners, evidence, and stakeholder updates. Incident Zero Stack focuses on that operational middle layer.

## What It Does

Incident Zero Stack turns a deterministic incident scenario into:

- A triage cockpit with severity, owner, next update timing, and containment steps.
- DynamoDB-shaped records for cases, alerts, evidence, tasks, audit entries, updates, metrics, and handoff notes.
- Public API routes for case reconstruction, schema review, storage preview, and executive handoff.
- A no-secret browser review surface for judges and collaborators.
- A Slack-ready agent layer that reuses the same incident model for slash-command style briefs.

The repository is intentionally safe to review publicly. It includes deterministic demo data, schema design, API handlers, review pages, and submission material only.

## How We Built It

The app uses Node.js, plain JavaScript, Vercel-compatible serverless functions, a static browser cockpit, and an AWS DynamoDB adapter. The same incident model powers local HTTP routes, Vercel API functions, static review exports, Slack response previews, and MCP tools.

The DynamoDB layer is modeled around a single-table design named `IncidentZeroCases`. It records case state transitions and evidence events rather than treating the database as a decorative add-on. The public review path can run without live credentials, while the cloud path documents exactly which account-owner settings must exist before making a live database claim.

## Built With

```text
JavaScript
Node.js
Vercel serverless functions
AWS DynamoDB single-table design
GitHub Pages static review build
Slack Block Kit response structure
MCP SDK
```

## Public Links

Vercel runtime:

```text
https://incident-zero-stack.vercel.app
```

Static cockpit:

```text
https://ooyxloo.github.io/incident-zero-stack/
```

Slack agent review:

```text
https://ooyxloo.github.io/incident-zero-stack/slack-agent-review.html
```

Source repository:

```text
https://github.com/OOYXLOO/incident-zero-stack
```

DynamoDB schema:

```text
https://raw.githubusercontent.com/OOYXLOO/incident-zero-stack/master/docs/aws-dynamodb-single-table-design.md
```

Cloud proof gate:

```text
https://raw.githubusercontent.com/OOYXLOO/incident-zero-stack/master/docs/CLOUD_PROOF_REQUIRED.md
```

v0 + AWS handoff pack:

```text
https://raw.githubusercontent.com/OOYXLOO/incident-zero-stack/master/docs/h0_v0_aws_handoff_pack.md
```

## API Review Paths

```text
https://incident-zero-stack.vercel.app/api/health
https://incident-zero-stack.vercel.app/api/scenarios
https://incident-zero-stack.vercel.app/api/case?scenario=identity
https://incident-zero-stack.vercel.app/api/schema
https://incident-zero-stack.vercel.app/api/storage-preview?scenario=identity
https://incident-zero-stack.vercel.app/api/handoff?scenario=identity
https://incident-zero-stack.vercel.app/api/cloud-readiness
```

## Verification Commands

```bash
npm test
npm run check
npm run audit:local
npm run audit:h0-submission -- --public-url https://incident-zero-stack.vercel.app
npm run verify:public -- https://incident-zero-stack.vercel.app
```

Use the v0 and AWS account-owner handoff pack before recording the final demo:

```text
docs/h0_v0_aws_handoff_pack.md
```

## Account-Owner Cloud Gates

Before claiming live cloud usage in a final submission, complete these outside the repository:

- Confirm challenge eligibility and submission account ownership.
- Confirm Vercel project deployment is under the account-owner workspace.
- Configure `INCIDENT_ZERO_PUBLIC_URL` for the deployed runtime.
- Provision the account-owner DynamoDB table.
- Configure `INCIDENT_ZERO_STORAGE=dynamodb`, `INCIDENT_ZERO_DYNAMODB_TABLE`, and `AWS_REGION`.
- Configure AWS credentials only in the hosting provider secret store.
- Run the live DynamoDB verification command from an account-owner terminal.
- Capture a redacted cloud proof image that shows resource identity without exposing secrets, billing pages, cookies, tokens, private email, or payment data.

## Demo Video Outline

1. Open the public Vercel runtime and show the incident cockpit.
2. Switch between identity, payments, and data-export scenarios.
3. Open `/api/schema` and show the DynamoDB single-table design.
4. Open `/api/storage-preview?scenario=identity` and show case/evidence/task records.
5. Open `/api/cloud-readiness` and explain the safety boundary.
6. Show the Slack review page as an optional agent-facing extension.
7. End on the repository and verification commands.

## Final Submission Boundary

Do not include AWS keys, Vercel tokens, Slack secrets, private workspace data, browser cookies, payment pages, account settings, tax/KYC material, or private customer records in the repository, demo video, screenshots, or submission text.
