"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function usage() {
  return [
    "Usage:",
    "  node scripts/audit-h0-submission.js --public-url <https-url>",
    "",
    "This is an offline preflight for the H0 submission path."
  ].join("\n");
}

function argValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) return null;
  return process.argv[index + 1];
}

function pass(name, detail) {
  return { ok: true, name, detail };
}

function fail(name, detail) {
  return { ok: false, name, detail };
}

function readRel(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function existsRel(file) {
  return fs.existsSync(path.join(ROOT, file));
}

function checkPublicUrl(publicUrl) {
  if (!publicUrl) return fail("public-url", `missing --public-url\n${usage()}`);
  try {
    const url = new URL(publicUrl);
    if (url.protocol !== "https:") return fail("public-url", "must use https://");
    return pass("public-url", url.toString().replace(/\/$/, ""));
  } catch (error) {
    return fail("public-url", error.message);
  }
}

function checkRequiredFiles() {
  const files = [
    "docs/h0_submission_pack.md",
    "docs/aws-dynamodb-single-table-design.md",
    "docs/CLOUD_PROOF_REQUIRED.md",
    "docs/vercel_deployment_notes.md",
    "docs/public_status.md",
    "api/cloud-readiness.js",
    "api/storage-preview.js",
    "api/schema.js",
    "src/dynamoAdapter.js",
    "src/cloudReadiness.js",
    "scripts/verify-dynamodb-live.js"
  ];
  const missing = files.filter((file) => !existsRel(file));
  return missing.length ? fail("required-files", `missing: ${missing.join(", ")}`) : pass("required-files", `${files.length} files present`);
}

function checkSubmissionPack(publicUrl) {
  const pack = readRel("docs/h0_submission_pack.md");
  const required = [
    "H0 Hack the Zero Stack",
    "Incident Zero Stack",
    "Vercel runtime",
    publicUrl.replace(/\/$/, ""),
    "AWS DynamoDB",
    "DynamoDB-shaped records",
    "Account-Owner Cloud Gates",
    "Demo Video Outline",
    "Final Submission Boundary",
    "npm run audit:h0-submission"
  ];
  const missing = required.filter((item) => !pack.includes(item));
  return missing.length ? fail("submission-pack", `missing: ${missing.join(", ")}`) : pass("submission-pack", "H0 field copy and gates ready");
}

function checkCloudBoundary() {
  const files = [
    "docs/h0_submission_pack.md",
    "docs/CLOUD_PROOF_REQUIRED.md",
    "docs/vercel-env-template.md",
    "src/cloudReadiness.js",
    "scripts/verify-dynamodb-live.js"
  ];
  const text = files.map(readRel).join("\n");
  const required = [
    "Do not include AWS keys",
    "INCIDENT_ZERO_STORAGE=dynamodb",
    "INCIDENT_ZERO_DYNAMODB_TABLE",
    "AWS_REGION",
    "Refusing live DynamoDB write"
  ];
  const missing = required.filter((item) => !text.includes(item));
  return missing.length ? fail("cloud-boundary", `missing: ${missing.join(", ")}`) : pass("cloud-boundary", "secret boundary and live-write guard documented");
}

function checkApiCoverage() {
  const publicVerifier = readRel("scripts/verify-public.js");
  const required = [
    "checkCloudReadiness",
    "checkStoragePreview",
    "checkSchema",
    "aws-dynamodb"
  ];
  const missing = required.filter((item) => !publicVerifier.includes(item));
  return missing.length ? fail("api-coverage", `missing: ${missing.join(", ")}`) : pass("api-coverage", "schema, storage preview, and cloud readiness covered");
}

function run({ publicUrl }) {
  return [
    checkPublicUrl(publicUrl),
    checkRequiredFiles(),
    checkSubmissionPack(publicUrl || ""),
    checkCloudBoundary(),
    checkApiCoverage()
  ];
}

function main() {
  const results = run({ publicUrl: argValue("--public-url") });
  for (const result of results) {
    console.log(`${result.ok ? "PASS" : "FAIL"} ${result.name}: ${result.detail}`);
  }
  if (results.some((result) => !result.ok)) process.exitCode = 1;
}

if (require.main === module) {
  main();
}

module.exports = { run };
