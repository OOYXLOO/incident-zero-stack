"use strict";

const fs = require("fs");
const path = require("path");
const { createSlackAgentSubmissionPack, formatSlackAgentSubmissionMarkdown } = require("../src/slackAgent");

function argValue(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) return fallback;
  return process.argv[index + 1];
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function main() {
  const pendingPublicUrl = hasFlag("--allow-pending-public-url");
  const publicUrl = argValue("--public-url", pendingPublicUrl ? "" : "https://example.com");
  const sourceRepoUrl = argValue("--source-repo-url", "https://github.com/OOYXLOO/incident-zero-stack");
  const markdownOutput = argValue("--markdown-output", null);
  const pack = createSlackAgentSubmissionPack({ publicUrl, sourceRepoUrl, pendingPublicUrl });
  if (markdownOutput) {
    fs.mkdirSync(path.dirname(path.resolve(markdownOutput)), { recursive: true });
    fs.writeFileSync(markdownOutput, formatSlackAgentSubmissionMarkdown(pack), "utf8");
  }
  process.stdout.write(`${JSON.stringify(pack, null, 2)}\n`);
}

if (require.main === module) {
  main();
}
