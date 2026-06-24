"use strict";

const fs = require("fs");
const path = require("path");
const { buildCase, scenarioList } = require("../src/incidentZero");
const { cloudReadiness } = require("../src/cloudReadiness");

const ROOT = path.resolve(__dirname, "..");

function argValue(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) return fallback;
  return process.argv[index + 1];
}

function buildStaticDemoData() {
  const scenarios = scenarioList();
  const cases = Object.fromEntries(scenarios.map((scenario) => [
    scenario.id,
    buildCase({ scenarioId: scenario.id })
  ]));
  const demoSteps = [
    buildCase({ scenarioId: "identity", contained: false, evidenceConfidence: 58, impactedUsers: 12, revenueAtRiskUsd: 3200 }),
    buildCase({ scenarioId: "identity", contained: false, evidenceConfidence: 89, impactedUsers: 48, revenueAtRiskUsd: 12400, customerImpact: true }),
    buildCase({ scenarioId: "identity", contained: true, evidenceConfidence: 94, impactedUsers: 48, revenueAtRiskUsd: 12400, customerImpact: true })
  ];

  return {
    generatedAt: new Date().toISOString(),
    source: "local deterministic Incident Zero model",
    mode: "static-review-fallback",
    scenarios,
    cases,
    demoSteps,
    cloudReadiness: cloudReadiness({}),
    boundary: {
      storesCredentials: false,
      containsPrivateMessages: false,
      requiresLiveCloudForReview: false,
      liveDeploymentStillSupported: true
    }
  };
}

function main() {
  const outFile = path.resolve(ROOT, argValue("--out", "public/static-demo-data.js"));
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const data = buildStaticDemoData();
  fs.writeFileSync(outFile, `window.INCIDENT_ZERO_STATIC_DEMO = ${JSON.stringify(data, null, 2)};\n`, "utf8");
  process.stdout.write(`static demo written: ${path.relative(ROOT, outFile).replace(/\\/g, "/")}\n`);
  process.stdout.write(`scenarios: ${data.scenarios.length}\n`);
  process.stdout.write(`demo steps: ${data.demoSteps.length}\n`);
}

if (require.main === module) {
  main();
}

module.exports = {
  buildStaticDemoData
};
