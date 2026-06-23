"use strict";

const { createSlackAgentSubmissionPack } = require("../src/slackAgent");

function argValue(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) return fallback;
  return process.argv[index + 1];
}

function main() {
  const publicUrl = argValue("--public-url", "https://example.com");
  const pack = createSlackAgentSubmissionPack({ publicUrl });
  process.stdout.write(`${JSON.stringify(pack, null, 2)}\n`);
}

if (require.main === module) {
  main();
}
