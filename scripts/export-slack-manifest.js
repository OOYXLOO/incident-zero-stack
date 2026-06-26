"use strict";

const { createSlackAppManifest } = require("../src/slackAgent");
const { findCredentialLikeValues } = require("../src/storage");

function usage() {
  return [
    "Usage:",
    "  node scripts/export-slack-manifest.js --public-url <https-url>",
    "",
    "Example:",
    "  node scripts/export-slack-manifest.js --public-url https://incident-zero.example"
  ].join("\n");
}

function argValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) return null;
  return process.argv[index + 1];
}

function normalizePublicUrl(value) {
  if (!value) throw new Error(`Missing --public-url.\n\n${usage()}`);
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("Slack manifest public URL must use https://");
  url.pathname = url.pathname.replace(/\/+$/, "");
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

function validateManifest(manifest) {
  const text = JSON.stringify(manifest);
  const placeholders = ["replace-with-public-deployment", "<public-deployment-url>", "example.com"];
  const matchedPlaceholder = placeholders.find((placeholder) => text.includes(placeholder));
  if (matchedPlaceholder) throw new Error(`Manifest still contains placeholder: ${matchedPlaceholder}`);

  const credentials = findCredentialLikeValues(manifest);
  if (credentials.length) throw new Error("Manifest contains credential-like values");

  const slashUrl = manifest?.features?.slash_commands?.[0]?.url;
  const interactivityUrl = manifest?.settings?.interactivity?.request_url;
  if (!slashUrl || !interactivityUrl) throw new Error("Manifest is missing Slack endpoint URLs");
  if (slashUrl !== interactivityUrl) throw new Error("Slash command and interactivity URLs must match");
  if (!slashUrl.endsWith("/api/slack-agent")) throw new Error("Slack endpoint URL must end with /api/slack-agent");
  return true;
}

function buildImportReadyManifest(publicUrl) {
  const normalizedUrl = normalizePublicUrl(publicUrl);
  const manifest = createSlackAppManifest({ publicUrl: normalizedUrl });
  validateManifest(manifest);
  return manifest;
}

function main() {
  const manifest = buildImportReadyManifest(argValue("--public-url"));
  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  buildImportReadyManifest,
  normalizePublicUrl,
  validateManifest
};
