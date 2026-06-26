"use strict";

const fs = require("fs");
const path = require("path");
const { buildImportReadyManifest } = require("./export-slack-manifest");

const ROOT = path.resolve(__dirname, "..");

function usage() {
  return [
    "Usage:",
    "  node scripts/audit-slack-submission.js --public-url <https-url>",
    "",
    "This is an offline preflight for the Slack Agent Builder submission path."
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

function checkSlackManifest(publicUrl) {
  try {
    const manifest = buildImportReadyManifest(publicUrl);
    const endpoint = manifest.features.slash_commands[0].url;
    return pass("slack-manifest", endpoint);
  } catch (error) {
    return fail("slack-manifest", error.message);
  }
}

function checkStaticReviewLinks() {
  const review = readRel("public/slack-agent-review.html");
  const preview = readRel("public/slack-message-preview.html");
  const storyboard = readRel("public/demo-storyboard.html");
  const requiredReviewText = [
    "slack-message-preview.html",
    "demo-storyboard.html",
    "Slack AI and MCP requirements",
    "GitHub Pages is static review only"
  ];
  const requiredPreviewText = [
    "/incident-zero scenario=identity severity=critical",
    "Open handoff",
    "Public prototype boundary"
  ];
  const requiredStoryboardText = [
    "Record the Slack Agent Builder demo",
    "/incident-zero scenario=identity severity=critical",
    "Final upload checklist",
    "No sensitive screens"
  ];
  const missing = [
    ...requiredReviewText.filter((item) => !review.includes(item)),
    ...requiredPreviewText.filter((item) => !preview.includes(item)),
    ...requiredStoryboardText.filter((item) => !storyboard.includes(item))
  ];
  return missing.length ? fail("static-review-links", `missing: ${missing.join(", ")}`) : pass("static-review-links", "review, storyboard, and Slack preview linked");
}

function checkSubmissionMaterials() {
  const files = [
    "docs/slack_challenge_submission_pack.md",
    "docs/devpost_field_pack.md",
    "docs/demo_video_script.md",
    "docs/demo_video_production_pack.md",
    "docs/slack-agent-architecture.svg",
    "docs/account-owner-deployment-runbook.md"
  ];
  const missingFiles = files.filter((file) => !fs.existsSync(path.join(ROOT, file)));
  if (missingFiles.length) return fail("submission-materials", `missing files: ${missingFiles.join(", ")}`);

  const text = files.filter((file) => file.endsWith(".md")).map(readRel).join("\n");
  const required = [
    "Slack Agent Builder Challenge",
    "Incident Zero Agent",
    "slack-message-preview.html",
    "Demo Video Production Pack",
    "Final Upload Checklist",
    "slackhack@salesforce.com",
    "testing@devpost.com",
    "No Slack tokens"
  ];
  const missing = required.filter((item) => !text.includes(item));
  return missing.length ? fail("submission-materials", `missing: ${missing.join(", ")}`) : pass("submission-materials", `${files.length} files ready`);
}

function checkAccountOwnerGates() {
  const runbook = readRel("docs/account-owner-deployment-runbook.md");
  const gates = [
    "Public HTTPS API Deployment",
    "Slack App Manifest",
    "Slack Sandbox Test",
    "Challenge Tester Invites",
    "slackhack@salesforce.com",
    "testing@devpost.com",
    "Demo Video",
    "Final Submission"
  ];
  const missing = gates.filter((gate) => !runbook.includes(gate));
  return missing.length ? fail("account-owner-gates", `missing: ${missing.join(", ")}`) : pass("account-owner-gates", gates.join(", "));
}

function run({ publicUrl }) {
  return [
    checkPublicUrl(publicUrl),
    checkSlackManifest(publicUrl),
    checkStaticReviewLinks(),
    checkSubmissionMaterials(),
    checkAccountOwnerGates()
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
