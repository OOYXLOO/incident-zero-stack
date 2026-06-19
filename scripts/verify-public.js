"use strict";

const { URL } = require("url");

const DEFAULT_TIMEOUT_MS = 12000;

function usage() {
  return [
    "Usage:",
    "  node scripts/verify-public.js <base-url>",
    "",
    "Example:",
    "  node scripts/verify-public.js https://incident-zero-stack.vercel.app"
  ].join("\n");
}

function normalizeBaseUrl(input) {
  if (!input) throw new Error(`Missing base URL.\n\n${usage()}`);
  const url = new URL(input);
  if (!/^https?:$/.test(url.protocol)) throw new Error("Base URL must start with http:// or https://");
  url.pathname = url.pathname.replace(/\/+$/, "");
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || DEFAULT_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function readText(url) {
  const response = await fetchWithTimeout(url);
  const text = await response.text();
  return { response, text };
}

async function readJson(url) {
  const { response, text } = await readText(url);
  try {
    return { response, json: JSON.parse(text), text };
  } catch (error) {
    throw new Error(`${url} returned non-JSON response: ${error.message}`);
  }
}

function pass(name, detail) {
  return { ok: true, name, detail };
}

function fail(name, detail) {
  return { ok: false, name, detail };
}

async function checkHome(baseUrl) {
  const url = `${baseUrl}/`;
  const { response, text } = await readText(url);
  if (!response.ok) return fail("home", `${response.status} ${response.statusText}`);
  if (!text.includes("Incident Zero Stack")) return fail("home", "missing product title");
  if (!text.includes("app.js")) return fail("home", "missing app bundle reference");
  return pass("home", url);
}

async function checkHealth(baseUrl) {
  const url = `${baseUrl}/api/health`;
  const { response, json } = await readJson(url);
  if (!response.ok) return fail("health", `${response.status} ${response.statusText}`);
  if (json.ok !== true || json.noSecretsStored !== true) return fail("health", "unexpected health payload");
  return pass("health", "ok and noSecretsStored");
}

async function checkScenarios(baseUrl) {
  const url = `${baseUrl}/api/scenarios`;
  const { response, json } = await readJson(url);
  if (!response.ok) return fail("scenarios", `${response.status} ${response.statusText}`);
  const ids = (json.scenarios || []).map((scenario) => scenario.id).sort();
  if (ids.join(",") !== "data,identity,payments") return fail("scenarios", `unexpected scenarios: ${ids.join(",")}`);
  return pass("scenarios", ids.join(","));
}

async function checkCase(baseUrl) {
  const url = `${baseUrl}/api/case?scenario=payments`;
  const { response, json } = await readJson(url);
  if (!response.ok) return fail("case", `${response.status} ${response.statusText}`);
  if (json.alert?.scenarioId !== "payments") return fail("case", "payments scenario did not load");
  if (!Array.isArray(json.records) || json.records.length < 15) return fail("case", "records are missing or too small");
  if (!json.storagePlan || json.storagePlan.liveAdapterTarget !== "aws-dynamodb") return fail("case", "missing aws-dynamodb storage target");
  return pass("case", `${json.records.length} records`);
}

async function checkSchema(baseUrl) {
  const url = `${baseUrl}/api/schema`;
  const { response, json } = await readJson(url);
  if (!response.ok) return fail("schema", `${response.status} ${response.statusText}`);
  if (json.tableName !== "IncidentZeroCases") return fail("schema", "unexpected table name");
  if (!Array.isArray(json.indexes) || json.indexes.length < 2) return fail("schema", "missing GSI definitions");
  return pass("schema", `${json.indexes.length} indexes`);
}

async function checkHandoff(baseUrl) {
  const url = `${baseUrl}/api/handoff?scenario=data`;
  const { response, text } = await readText(url);
  if (!response.ok) return fail("handoff", `${response.status} ${response.statusText}`);
  if (!text.includes("Executive Handoff")) return fail("handoff", "missing handoff heading");
  if (!text.includes("Unusual data export")) return fail("handoff", "missing selected scenario");
  return pass("handoff", "markdown export");
}

async function checkStoragePreview(baseUrl) {
  const url = `${baseUrl}/api/storage-preview?scenario=identity`;
  const { response, json } = await readJson(url);
  if (!response.ok) return fail("storage-preview", `${response.status} ${response.statusText}`);
  if (json.storagePlan?.liveAdapterTarget !== "aws-dynamodb") return fail("storage-preview", "missing aws-dynamodb target");
  if (!Array.isArray(json.sampleRecords) || json.sampleRecords.length === 0) return fail("storage-preview", "missing sample records");
  return pass("storage-preview", `${json.sampleRecords.length} sample records`);
}

async function checkCloudReadiness(baseUrl) {
  const url = `${baseUrl}/api/cloud-readiness`;
  const { response, json, text } = await readJson(url);
  if (!response.ok) return fail("cloud-readiness", `${response.status} ${response.statusText}`);
  if (json.okForLocalReview !== true) return fail("cloud-readiness", "local review is not ready");
  if (json.safety?.returnsSecretValues !== false) return fail("cloud-readiness", "secret-return safety flag is not false");
  const secretValuePattern = /AKIA[0-9A-Z]{16}|ASIA[0-9A-Z]{16}|-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----|(?:aws_secret_access_key|vercel_token)\s*[:=]\s*["'][^"']{8,}/i;
  if (secretValuePattern.test(text)) return fail("cloud-readiness", "response appears to include secret-like value");
  return pass("cloud-readiness", json.okForPublicCloudClaim ? "public cloud ready" : "account-owner gates still missing");
}

async function run(baseUrl) {
  const checks = [
    checkHome,
    checkHealth,
    checkScenarios,
    checkCase,
    checkSchema,
    checkHandoff,
    checkStoragePreview,
    checkCloudReadiness
  ];
  const results = [];
  for (const check of checks) {
    try {
      results.push(await check(baseUrl));
    } catch (error) {
      results.push(fail(check.name.replace(/^check/, "").toLowerCase(), error.message));
    }
  }
  return results;
}

async function main() {
  const baseUrl = normalizeBaseUrl(process.argv[2]);
  const results = await run(baseUrl);
  const failed = results.filter((result) => !result.ok);
  for (const result of results) {
    console.log(`${result.ok ? "PASS" : "FAIL"} ${result.name}: ${result.detail}`);
  }
  if (failed.length) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  normalizeBaseUrl,
  run
};
