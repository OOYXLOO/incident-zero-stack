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

## Expected Public Paths

```text
/
/api/health
/api/scenarios
/api/case
/api/schema
/api/handoff
/api/storage-preview
```

## Database Boundary

The current deployment-ready code still uses the safe local adapter shape. The live AWS Database step must be completed by the account owner. The intended replacement boundary is `src/storage.js`: keep the record shape, replace only the storage implementation with official AWS SDK calls and environment-managed configuration.

Do not commit credentials or screenshots with private account information.
