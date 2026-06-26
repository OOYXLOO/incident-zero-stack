"use strict";

const { URL } = require("url");

const DEFAULT_TIMEOUT_MS = 12000;

function usage() {
  return [
    "Usage:",
    "  node scripts/verify-static-review.js <base-url>",
    "",
    "Example:",
    "  node scripts/verify-static-review.js https://ooyxloo.github.io/incident-zero-stack"
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

async function fetchWithTimeout(url, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function pass(name, detail) {
  return { ok: true, name, detail };
}

function fail(name, detail) {
  return { ok: false, name, detail };
}

async function readText(url) {
  const response = await fetchWithTimeout(url);
  const text = await response.text();
  return { response, text };
}

async function checkHome(baseUrl) {
  const url = `${baseUrl}/`;
  const { response, text } = await readText(url);
  if (!response.ok) return fail("home", `${response.status} ${response.statusText}`);
  if (!text.includes("Incident Zero Stack")) return fail("home", "missing product title");
  if (!text.includes("static-demo-data.js")) return fail("home", "missing static demo data reference");
  if (!text.includes("app.js")) return fail("home", "missing app bundle reference");
  return pass("home", url);
}

async function checkAppBundle(baseUrl) {
  const url = `${baseUrl}/app.js`;
  const { response, text } = await readText(url);
  if (!response.ok) return fail("app-bundle", `${response.status} ${response.statusText}`);
  if (!text.includes("staticDemoData") || !text.includes("fetchJsonWithFallback")) {
    return fail("app-bundle", "missing static fallback wiring");
  }
  return pass("app-bundle", url);
}

async function checkStaticData(baseUrl) {
  const url = `${baseUrl}/static-demo-data.js`;
  const { response, text } = await readText(url);
  if (!response.ok) return fail("static-demo-data", `${response.status} ${response.statusText}`);
  if (!text.includes("INCIDENT_ZERO_STATIC_DEMO")) return fail("static-demo-data", "missing global static demo object");
  if (!text.includes("identity") || !text.includes("payments") || !text.includes("data")) {
    return fail("static-demo-data", "missing expected demo scenarios");
  }
  if (/(AKIA[0-9A-Z]{16}|-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----|slack_signing_secret|xox[baprs]-)/i.test(text)) {
    return fail("static-demo-data", "secret-like value detected");
  }
  return pass("static-demo-data", url);
}

async function run(baseUrl) {
  const checks = [checkHome, checkAppBundle, checkStaticData];
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
  if (failed.length) process.exitCode = 1;
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
