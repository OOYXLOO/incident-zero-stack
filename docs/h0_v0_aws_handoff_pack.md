# H0 v0 + AWS Handoff Pack

Use this pack when preparing the H0 submission workflow in Vercel, v0, AWS, and Devpost. It does not contain credentials, account screenshots, billing data, tokens, cookies, or private workspace data.

## Goal

Turn Incident Zero Stack into a reviewable H0 entry with:

- a Vercel-hosted application,
- a v0-assisted UI iteration trail,
- an AWS DynamoDB-backed storage path,
- a redacted cloud proof bundle,
- a short demo video script,
- and a final Devpost field handoff.

## v0 Prompt

Paste this into v0 only if you want a visual iteration reference. Do not paste secrets, customer data, private logs, account screenshots, API keys, or billing pages.

```text
Design a clean incident-response operations cockpit for a project named Incident Zero Stack.

The app helps an on-call team turn a security alert into an auditable response record. The first viewport should show:

- incident title, severity, owner, current state, and next update time,
- a task board with containment, evidence, stakeholder update, and executive handoff steps,
- an evidence ledger with confidence and status,
- a DynamoDB single-table storage preview showing CASE, ALERT, EVIDENCE, TASK, AUDIT, UPDATE, METRIC, and HANDOFF records,
- a cloud readiness panel showing which account-owner deployment gates are complete.

Style: dense but readable SaaS operations UI, not a marketing landing page. Use restrained colors, crisp tables, clear status chips, and a professional incident-management feel. Avoid fake customer names, fake secrets, fake billing screenshots, decorative gradients, and fictional integrations that are not in the source repository.

Implementation target: Vercel-hosted JavaScript app with serverless API routes and an AWS DynamoDB single-table design.
```

## v0 Review Checklist

Accept a v0 iteration only if it helps the existing implementation. Do not replace the working app with a generated design unless it preserves the current data model and public review routes.

- The first viewport still says `Incident Zero Stack`.
- The UI still feels like an operations cockpit, not a landing page.
- The storage preview remains visibly tied to DynamoDB.
- The cloud readiness section does not claim live AWS usage until proof exists.
- No fake company data, secrets, keys, tokens, or billing text appears.
- The layout can be implemented with the current `public/index.html`, `public/app.js`, and `public/styles.css` structure.

## AWS DynamoDB Proof Checklist

Before final submission, capture a redacted proof bundle. The proof should show resource existence and configuration without exposing sensitive values.

Required proof signals:

- DynamoDB table exists for the project.
- Table name matches the environment variable used by Vercel.
- Region matches the app configuration.
- A successful live verification writes or reads a deterministic demo case.
- The app endpoint still passes public verification after configuration.

Never include:

- AWS access keys or secret access keys.
- Vercel tokens or project secrets.
- Browser cookies, local storage, private account pages, or private email.
- Billing, payment, tax, KYC, or identity-verification pages.
- Private customer records or production logs.

## Account-Owner Command Sequence

Run from the project root after the cloud resources and hosting environment variables are configured.

```bash
npm run verify:public -- https://incident-zero-stack.vercel.app
npm run audit:h0-submission -- --public-url https://incident-zero-stack.vercel.app
npm run verify:dynamodb
```

`npm run verify:dynamodb` intentionally refuses to run without explicit live-write approval environment variables. That guard should stay in place so no accidental account writes happen during local review.

## Demo Recording Script

Keep the demo under three minutes.

1. Open `https://incident-zero-stack.vercel.app`.
2. Show the incident summary, response tasks, evidence ledger, and audit timeline.
3. Open `/api/schema` and point out the `IncidentZeroCases` single-table design.
4. Open `/api/storage-preview?scenario=identity` and show the DynamoDB-shaped records.
5. Open `/api/cloud-readiness` and show the cloud safety boundary.
6. If live DynamoDB proof is complete, show the redacted proof image or proof note.
7. End on the repository, H0 submission pack, and verification commands.

## Devpost Field Addendum

Use this addendum with `docs/h0_submission_pack.md`.

```text
The H0-specific part of the project is the deployment and storage proof path: Incident Zero Stack is hosted on Vercel, exposes reviewable serverless routes, models incident response as DynamoDB single-table records, and includes an explicit cloud readiness endpoint so judges can distinguish public demo state from account-owner live cloud proof.

The repository avoids secrets by design. Credentials and cloud resources are configured only in the account-owner hosting environment, while public routes expose deterministic incident scenarios, schema previews, handoff exports, and readiness checks.
```

## Final Gate

Do not submit the final Devpost entry until the public app URL, source repository, demo video, and cloud proof bundle all match the claims in `docs/h0_submission_pack.md`.
