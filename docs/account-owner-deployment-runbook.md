# Account-Owner Deployment Runbook

This runbook is for the account owner who will connect Incident Zero Agent to a public HTTPS runtime and a Slack sandbox workspace.

It intentionally does not include Slack tokens, signing secrets, workspace cookies, payment details, customer data, or private messages.

## Current Public Review Links

- Static cockpit: https://ooyxloo.github.io/incident-zero-stack/
- Slack agent review page: https://ooyxloo.github.io/incident-zero-stack/slack-agent-review.html
- Source repository: https://github.com/OOYXLOO/incident-zero-stack
- Submission pack: https://raw.githubusercontent.com/OOYXLOO/incident-zero-stack/master/docs/slack_challenge_submission_pack.md
- Manifest template: https://raw.githubusercontent.com/OOYXLOO/incident-zero-stack/master/docs/slack-app-manifest-template.json

## Gate 1: Public HTTPS API Deployment

The GitHub Pages URL is a static review surface only. Slack slash commands require a public HTTPS runtime for:

```text
/api/slack-agent
```

Recommended deployment shape:

```text
npx vercel login
npx vercel --prod
```

After deployment, verify the public URL:

```text
npm run verify:public -- https://<public-deployment-url>
```

The verification should pass:

```text
PASS home
PASS health
PASS scenarios
PASS case
PASS schema
PASS handoff
PASS storage-preview
PASS cloud-readiness
```

Print the non-secret gate checklist for the same deployed URL:

```text
npm run print:deployment-gates -- --public-url https://<public-deployment-url>
```

## Gate 2: Slack App Manifest

After the public HTTPS API is deployed, generate an import-ready Slack manifest:

```text
npm run export:slack-manifest -- --public-url https://<public-deployment-url>
```

The command prints JSON with both Slack endpoint URLs set to:

```text
https://<public-deployment-url>/api/slack-agent
```

Copy the JSON output into Slack app manifest import.

Fallback: open the manifest template manually:

```text
docs/slack-app-manifest-template.json
```

and replace both placeholder URLs:

```text
https://replace-with-public-deployment.example.com/api/slack-agent
```

with:

```text
https://<public-deployment-url>/api/slack-agent
```

Then create the Slack app from the manifest in the sandbox workspace.

Do not paste tokens, signing secrets, app secrets, workspace cookies, payment pages, or private customer data into this repository.

## Gate 3: Slack Sandbox Test

Install the app into the sandbox workspace and test:

```text
/incident-zero scenario=identity severity=critical
/incident-zero scenario=payments contained=false
/incident-zero scenario=data confidence=92 users=18
```

The response should show:

- incident brief,
- severity,
- risk score,
- owner,
- top actions,
- evidence signals,
- action buttons,
- and no private data.

## Gate 4: Challenge Tester Invites

Invite these tester accounts to the sandbox workspace when the challenge requires it:

```text
slackhack@salesforce.com
testing@devpost.com
```

## Gate 5: Demo Video

Keep the video under three minutes:

1. Open the static cockpit.
2. Show the Slack command in the sandbox.
3. Show the Block Kit incident brief.
4. Show the executive handoff.
5. Close on the boundary: no Slack tokens, private messages, workspace cookies, customer records, or billing data in the repository.

## Gate 6: Final Submission

Use:

- public app URL,
- source repository,
- Slack sandbox URL,
- demo video,
- architecture diagram,
- submission pack,
- and the static review page.

Do not paste secrets, tokens, private workspace data, payment details, or private customer data into Devpost.
