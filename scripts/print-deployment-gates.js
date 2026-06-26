"use strict";

const { cloudReadiness } = require("../src/cloudReadiness");

function usage() {
  return [
    "Usage:",
    "  node scripts/print-deployment-gates.js [--public-url https://example.vercel.app]",
    "",
    "Prints account-owner deployment gates without reading or emitting secret values."
  ].join("\n");
}

function argValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) return null;
  return process.argv[index + 1];
}

function normalizePublicUrl(input) {
  if (!input) return null;
  const url = new URL(input);
  if (url.protocol !== "https:") throw new Error("Public URL must use https://");
  url.pathname = url.pathname.replace(/\/+$/, "");
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

function buildGateChecklist({ publicUrl = null, env = process.env } = {}) {
  const normalizedPublicUrl = normalizePublicUrl(publicUrl || env.INCIDENT_ZERO_PUBLIC_URL || null);
  const readiness = cloudReadiness({
    ...env,
    ...(normalizedPublicUrl ? { INCIDENT_ZERO_PUBLIC_URL: normalizedPublicUrl } : {})
  });

  return {
    product: "Incident Zero Agent",
    purpose: "Slack Agent Builder Challenge deployment readiness",
    publicUrl: normalizedPublicUrl || "pending account-owner deployment",
    secretPolicy: "Do not paste Slack tokens, signing secrets, AWS keys, cookies, payment data, or private workspace data into this repository.",
    requiredEnvironmentNames: [
      "INCIDENT_ZERO_PUBLIC_URL",
      "INCIDENT_ZERO_STORAGE=dynamodb",
      "INCIDENT_ZERO_DYNAMODB_TABLE",
      "AWS_REGION"
    ],
    optionalEnvironmentNames: [
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "AWS_SESSION_TOKEN"
    ],
    missingAccountOwnerGates: readiness.missingAccountOwnerGates,
    verificationCommands: normalizedPublicUrl ? [
      `npm run verify:public -- ${normalizedPublicUrl}`,
      `npm run audit:slack-submission -- --public-url ${normalizedPublicUrl}`,
      `npm run export:slack-manifest -- --public-url ${normalizedPublicUrl}`
    ] : [
      "npm run verify:public -- https://<public-deployment-url>",
      "npm run audit:slack-submission -- --public-url https://<public-deployment-url>",
      "npm run export:slack-manifest -- --public-url https://<public-deployment-url>"
    ],
    slackAppGates: [
      "Create or open a Slack sandbox workspace.",
      "Create a Slack app from the generated manifest.",
      "Install the app into the sandbox workspace.",
      "Test /incident-zero scenario=identity severity=critical.",
      "Invite slackhack@salesforce.com and testing@devpost.com if required by the challenge rules."
    ],
    finalSubmissionGates: [
      "Record a demo video under three minutes.",
      "Submit the public app URL, repository URL, demo video, and Slack sandbox URL on Devpost."
    ],
    readyForPublicCloudClaim: readiness.okForPublicCloudClaim
  };
}

function printMarkdown(checklist) {
  const lines = [
    `# ${checklist.product} Deployment Gates`,
    "",
    `Purpose: ${checklist.purpose}`,
    `Public URL: ${checklist.publicUrl}`,
    "",
    "## Secret Policy",
    "",
    checklist.secretPolicy,
    "",
    "## Required Environment Names",
    "",
    ...checklist.requiredEnvironmentNames.map((name) => `- ${name}`),
    "",
    "## Optional Credential Environment Names",
    "",
    ...checklist.optionalEnvironmentNames.map((name) => `- ${name}`),
    "",
    "## Missing Account-Owner Gates",
    "",
    ...(checklist.missingAccountOwnerGates.length ? checklist.missingAccountOwnerGates.map((gate) => `- ${gate}`) : ["- none"]),
    "",
    "## Verification Commands",
    "",
    ...checklist.verificationCommands.map((command) => `- \`${command}\``),
    "",
    "## Slack App Gates",
    "",
    ...checklist.slackAppGates.map((gate) => `- ${gate}`),
    "",
    "## Final Submission Gates",
    "",
    ...checklist.finalSubmissionGates.map((gate) => `- ${gate}`),
    "",
    `Ready for public cloud claim: ${checklist.readyForPublicCloudClaim ? "yes" : "no"}`
  ];
  return lines.join("\n");
}

function main() {
  if (process.argv.includes("--help")) {
    console.log(usage());
    return;
  }
  const checklist = buildGateChecklist({ publicUrl: argValue("--public-url") });
  console.log(printMarkdown(checklist));
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
  buildGateChecklist,
  normalizePublicUrl,
  printMarkdown
};
