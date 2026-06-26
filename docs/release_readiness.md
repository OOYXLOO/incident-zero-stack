# Release Readiness

Use this checklist before creating a public repository, deployment, or public project page.

## Code

- [ ] `npm test` passes.
- [ ] `npm run check` passes.
- [ ] `npm run audit:local` passes before external account work.
- [ ] Browser smoke passes for dashboard, scenario switch, `Run demo`, storage plan, and handoff preview.
- [ ] `/api/cloud-readiness` reports local review ready and lists only missing account-owner gates.
- [x] `npm run verify:public -- https://incident-zero-stack.vercel.app` passes after deployment.
- [ ] `npm run verify:dynamodb` is run only with account-owner approval and `INCIDENT_ZERO_ALLOW_LIVE_WRITE=1`.
- [ ] Local public-wording scan has no planning-language hits inside this repository.

## Public Assets

- [ ] `docs/cover.png`
- [ ] `docs/desktop-preview.png`
- [ ] `docs/architecture.svg`
- [ ] `docs/mobile-preview.png`
- [ ] `docs/demo_video_script.md`

## Account-Owner Gates

- [ ] Public GitHub repository creation is approved by the account owner.
- [x] Vercel deployment is live at `https://incident-zero-stack.vercel.app`.
- [ ] AWS Database provisioning is approved by the account owner.
- [ ] Database proof screenshot contains no credentials, billing data, or private account details.
- [ ] Final public project submission is reviewed by the account owner before submission.

## Boundaries

- Do not commit credentials, cookies, tokens, billing data, identity documents, or private customer data.
- Live Vercel cloud deployment may be claimed for `https://incident-zero-stack.vercel.app`; do not claim live AWS Database usage until a real resource exists and proof has been reviewed.
- Do not claim live AWS Database usage until a real resource exists and proof has been reviewed.
