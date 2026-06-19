"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

const REQUIRED_FILES = [
  "README.md",
  "package.json",
  "package-lock.json",
  "vercel.json",
  ".gitignore",
  ".github/workflows/ci.yml",
  "api/case.js",
  "api/cloud-readiness.js",
  "api/handoff.js",
  "api/health.js",
  "api/scenarios.js",
  "api/schema.js",
  "api/storage-preview.js",
  "public/index.html",
  "public/app.js",
  "public/styles.css",
  "src/apiCore.js",
  "src/cloudReadiness.js",
  "src/dynamoAdapter.js",
  "src/incidentZero.js",
  "src/server.js",
  "src/storage.js",
  "scripts/verify-public.js",
  "scripts/verify-dynamodb-live.js",
  "docs/architecture.svg",
  "docs/demo_video_script.md",
  "docs/devpost_field_pack.md",
  "docs/release_readiness.md",
  "docs/vercel_deployment_notes.md"
];

const SYNTAX_CHECK_FILES = [
  "src/incidentZero.js",
  "src/storage.js",
  "src/dynamoAdapter.js",
  "src/cloudReadiness.js",
  "src/apiCore.js",
  "src/server.js",
  "public/app.js",
  "api/_handler.js",
  "api/case.js",
  "api/cloud-readiness.js",
  "api/handoff.js",
  "api/health.js",
  "api/scenarios.js",
  "api/schema.js",
  "api/storage-preview.js",
  "scripts/verify-public.js",
  "scripts/verify-dynamodb-live.js",
  "scripts/audit-local-readiness.js",
  "tests/incidentZero.test.js"
];

function rel(pathname) {
  return path.relative(ROOT, pathname).replace(/\\/g, "/");
}

function command(commandName, args) {
  const executable = process.platform === "win32" && commandName === "npm" ? "npm.cmd" : commandName;
  const result = spawnSync(executable, args, {
    cwd: ROOT,
    encoding: "utf8"
  });
  return {
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || ""
  };
}

function checkFiles() {
  const missing = REQUIRED_FILES.filter((file) => !fs.existsSync(path.join(ROOT, file)));
  return {
    ok: missing.length === 0,
    name: "required-files",
    detail: missing.length ? `missing: ${missing.join(", ")}` : `${REQUIRED_FILES.length} files present`
  };
}

function checkNoNodeModules() {
  const exists = fs.existsSync(path.join(ROOT, "node_modules"));
  return {
    ok: !exists,
    name: "no-node-modules",
    detail: exists ? "node_modules exists in repository root" : "node_modules absent"
  };
}

function checkPackageScripts() {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  const scripts = pkg.scripts || {};
  const required = ["test", "check", "verify:public", "verify:dynamodb"];
  const missing = required.filter((script) => !scripts[script]);
  return {
    ok: missing.length === 0,
    name: "package-scripts",
    detail: missing.length ? `missing: ${missing.join(", ")}` : required.join(", ")
  };
}

function checkPublicWording() {
  const terms = [
    "pri" + "ze",
    "pay" + "out",
    "money" + "-goal",
    "USD " + "200",
    "\u8d5a\u94b1",
    "\u5956\u91d1"
  ];
  const forbidden = new RegExp(terms.join("|"), "i");
  const hits = [];
  const ignore = new Set([
    ".git",
    "node_modules"
  ]);

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ignore.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (rel(fullPath) === ".github/workflows/ci.yml") continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (![".js", ".json", ".md", ".html", ".css", ".yml", ".yaml", ".txt"].includes(ext) && entry.name !== ".gitignore") continue;
      const text = fs.readFileSync(fullPath, "utf8");
      if (forbidden.test(text)) hits.push(rel(fullPath));
    }
  }

  walk(ROOT);
  return {
    ok: hits.length === 0,
    name: "public-wording",
    detail: hits.length ? `hits: ${hits.join(", ")}` : "no planning-language hits"
  };
}

function checkGitClean() {
  const result = command("git", ["status", "--short"]);
  const clean = result.status === 0 && result.stdout.trim() === "";
  return {
    ok: clean,
    name: "git-clean",
    detail: clean ? "working tree clean" : result.stdout.trim() || result.stderr.trim()
  };
}

function checkNodeTest() {
  const result = command(process.execPath, ["tests/incidentZero.test.js"]);
  return {
    ok: result.status === 0,
    name: "node-test",
    detail: result.status === 0 ? "passed" : (result.stderr || result.stdout).trim().split(/\r?\n/).slice(-2).join(" ")
  };
}

function checkNodeSyntax() {
  const failed = [];
  for (const file of SYNTAX_CHECK_FILES) {
    const result = command(process.execPath, ["--check", file]);
    if (result.status !== 0) failed.push(`${file}: ${(result.stderr || result.stdout).trim().split(/\r?\n/).slice(-1)[0]}`);
  }
  return {
    ok: failed.length === 0,
    name: "node-syntax",
    detail: failed.length ? failed.join("; ") : `${SYNTAX_CHECK_FILES.length} files passed`
  };
}

function checkLiveProofGuard() {
  const result = command(process.execPath, ["scripts/verify-dynamodb-live.js"]);
  const text = `${result.stdout}\n${result.stderr}`;
  const ok = result.status === 1 && text.includes("Refusing live DynamoDB write");
  return {
    ok,
    name: "live-proof-guard",
    detail: ok ? "refuses without explicit account-owner approval env" : text.trim().split(/\r?\n/).slice(-2).join(" ")
  };
}

async function main() {
  const results = [
    checkFiles(),
    checkNoNodeModules(),
    checkPackageScripts(),
    checkPublicWording(),
    checkGitClean(),
    checkNodeTest(),
    checkNodeSyntax(),
    checkLiveProofGuard()
  ];

  for (const result of results) {
    console.log(`${result.ok ? "PASS" : "FAIL"} ${result.name}: ${result.detail}`);
  }

  if (results.some((result) => !result.ok)) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
