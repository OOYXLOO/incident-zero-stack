# Release Readiness

Use this checklist before creating a public repository, deployment, or public project page.

## Code

- [ ] `npm test` passes.
- [ ] `npm run check` passes.
- [ ] Browser smoke passes for dashboard, scenario switch, `Run demo`, storage plan, and handoff preview.
- [ ] Local public-wording scan has no planning-language hits inside this repository.

## Public Assets

- [ ] `docs/cover.png`
- [ ] `docs/desktop-preview.png`
- [ ] `docs/architecture.svg`
- [ ] `docs/mobile-preview.png`
- [ ] `docs/demo_video_script.md`

## Account-Owner Gates

- [ ] Public GitHub repository creation is approved by the account owner.
- [ ] Vercel/v0 deployment is approved by the account owner.
- [ ] AWS Database provisioning is approved by the account owner.
- [ ] Database proof screenshot contains no credentials, billing data, or private account details.
- [ ] Final public project submission is reviewed by the account owner before submission.

## Boundaries

- Do not commit credentials, cookies, tokens, billing data, identity documents, or private customer data.
- Do not claim a live cloud deployment until the public URL exists.
- Do not claim live AWS Database usage until a real resource exists and proof has been reviewed.
