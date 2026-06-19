# Vercel Deployment Notes

This repository is shaped for a Vercel deployment without changing local development.

## Runtime Shape

- Static browser app: `public/`
- Local development server: `src/server.js`
- Shared API logic: `src/apiCore.js`
- Vercel functions:
  - `api/case.js`
  - `api/handoff.js`
  - `api/health.js`
  - `api/scenarios.js`
  - `api/schema.js`
  - `api/storage-preview.js`
- Vercel config: `vercel.json`

## Pre-Deploy Checks

```bash
npm test
npm run check
```

## Post-Deploy Check

```bash
npm run verify:public -- https://<deployed-project>.vercel.app
```

## Expected Public Paths

```text
/
/api/health
/api/scenarios
/api/case
/api/schema
/api/handoff
/api/storage-preview
/api/cloud-readiness
```

## Database Boundary

The current deployment-ready code still uses the safe local adapter shape. The live AWS Database step must be completed by the account owner. The intended replacement boundary is `src/dynamoAdapter.js`: keep the record shape, then wire the document client through environment-managed configuration.

## Environment Contract

```text
INCIDENT_ZERO_STORAGE=dynamodb
INCIDENT_ZERO_DYNAMODB_TABLE=IncidentZeroCases
AWS_REGION=<account-owner-region>
INCIDENT_ZERO_PUBLIC_URL=<deployed-public-url>
```

The `/api/cloud-readiness` endpoint reports whether these values are present, but it does not return secret values.

## Account-Owner Live Database Proof

Run this only after the account owner approves a live database write:

```bash
INCIDENT_ZERO_ALLOW_LIVE_WRITE=1 npm run verify:dynamodb
```

The script writes one deterministic incident packet to the configured table and prints only a redacted proof summary.

Do not commit credentials or screenshots with private account information.
