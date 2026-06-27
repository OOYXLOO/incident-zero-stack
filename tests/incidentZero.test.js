"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { cloudReadiness } = require("../src/cloudReadiness");
const { buildBatchWriteChunks, buildPutRequests, dynamoReadinessFromEnv } = require("../src/dynamoAdapter");
const {
  DYNAMODB_SCHEMA,
  buildCase,
  databaseRecords,
  handoffPacket,
  normalizeAlert,
  responseTasks,
  riskScore,
  scenarioList,
  storageAdapterPlan
} = require("../src/incidentZero");
const serverModule = require("../src/server");
const { handleRequest, safePublicPath } = serverModule;
const caseFunction = require("../api/case");
const cloudReadinessFunction = require("../api/cloud-readiness");
const handoffFunction = require("../api/handoff");
const slackAgentFunction = require("../api/slack-agent");
const storagePreviewFunction = require("../api/storage-preview");
const {
  buildImportReadyManifest,
  normalizePublicUrl: normalizeSlackManifestUrl,
  validateManifest: validateSlackManifest
} = require("../scripts/export-slack-manifest");
const {
  createSlackAgentResponse,
  createSlackAgentSubmissionPack,
  createSlackAppManifest,
  formatSlackAgentSubmissionMarkdown,
  parseSlackText
} = require("../src/slackAgent");
const {
  callIncidentTool,
  createMcpToolDefinitions
} = require("../src/mcpTools");
const { LocalIncidentStore, createStoragePreview, findCredentialLikeValues } = require("../src/storage");
const { normalizeBaseUrl, run: runPublicVerification } = require("../scripts/verify-public");
const { redact, requireLiveWriteApproval } = require("../scripts/verify-dynamodb-live");
const {
  buildGateChecklist,
  printMarkdown: printDeploymentGateMarkdown
} = require("../scripts/print-deployment-gates");
const {
  buildStoryboard,
  renderSlideSvg,
  safeSegmentName
} = require("../scripts/render-demo-storyboard-video");

function hasInternalStrategyWording(text) {
  const internalTerms = ["money" + "-goal", "USD " + "200", "\u8d5a\u94b1"];
  return internalTerms.some((term) => String(text).toLowerCase().includes(term.toLowerCase()));
}

function testDemoStoryboardVideoPlan() {
  const storyboard = buildStoryboard({ publicUrl: "https://incident-zero-stack.vercel.app" });
  assert.equal(storyboard.length, 6);
  assert.ok(storyboard.every((slide) => slide.durationSeconds > 0));
  assert.ok(storyboard.some((slide) => slide.title.includes("Slack-ready")));
  assert.ok(storyboard.some((slide) => slide.url === "https://incident-zero-stack.vercel.app/api/slack-agent"));
  assert.equal(hasInternalStrategyWording(JSON.stringify(storyboard)), false);

  const svg = renderSlideSvg(storyboard[0], { width: 1920, height: 1080, index: 0, total: storyboard.length });
  assert.ok(svg.includes("<svg"));
  assert.ok(svg.includes("Incident Zero Agent"));
  assert.ok(svg.includes("No tokens"));
  assert.equal(hasInternalStrategyWording(svg), false);

  assert.equal(safeSegmentName("Slack command result"), "slack-command-result");
  assert.equal(safeSegmentName("API / MCP + Records"), "api-mcp-records");
}

function testDefaultCase() {
  const result = buildCase();
  assert.equal(result.caseId, "CASE-2026-0612-01");
  assert.equal(result.alert.severity, "critical");
  assert.equal(result.risk, 100);
  assert.equal(result.evidence.length, 3);
  assert.equal(result.tasks.length, 5);
  assert.equal(result.audit.length, 5);
  assert.equal(result.updates.length, 3);
  assert.equal(result.architectureQueries.length, 3);
  assert.equal(result.storagePlan.liveAdapterTarget, "aws-dynamodb");
  assert.ok(result.handoff.markdown.includes("## Executive Summary"));
  assert.equal(result.gates.noSecretsStored, true);
  assert.equal(result.gates.localPrototypeReady, true);
  assert.equal(result.gates.liveAwsDatabaseClaimed, false);
  assert.equal(result.gates.vercelDeploymentClaimed, false);
}

function testScenarioLibrary() {
  const scenarios = scenarioList();
  assert.equal(scenarios.length, 3);
  assert.ok(scenarios.some((scenario) => scenario.id === "payments"));
  const paymentCase = buildCase({ scenarioId: "payments" });
  assert.equal(paymentCase.alert.title, "Duplicate payment webhook replay");
  assert.equal(paymentCase.alert.contained, true);
  assert.ok(paymentCase.risk < buildCase({ scenarioId: "payments", contained: false }).risk);
}

function testDynamoRecords() {
  const records = databaseRecords();
  assert.ok(records.length >= 15);
  assert.ok(records.every((record) => record.PK === "CASE#CASE-2026-0612-01"));
  assert.ok(records.some((record) => record.entity === "EVIDENCE"));
  assert.ok(records.some((record) => record.entity === "UPDATE"));
  assert.ok(records.some((record) => record.entity === "HANDOFF"));
  assert.equal(DYNAMODB_SCHEMA.partitionKey, "PK");
  assert.equal(DYNAMODB_SCHEMA.sortKey, "SK");
  assert.equal(DYNAMODB_SCHEMA.indexes.length, 2);
}

function testHandoffAndStoragePlan() {
  const handoff = handoffPacket({ scenarioId: "payments" });
  assert.equal(handoff.filename, "case-2026-0619-02-handoff.md");
  assert.ok(handoff.markdown.includes("Duplicate payment webhook replay"));

  const plan = storageAdapterPlan({ scenarioId: "payments" });
  assert.equal(plan.tableName, "IncidentZeroCases");
  assert.ok(plan.recordCount >= 15);
  assert.equal(plan.safety.noCredentialsInCode, true);

  const preview = createStoragePreview({ scenarioId: "data" });
  assert.equal(preview.write.tableName, "IncidentZeroCases");
  assert.ok(preview.sampleRecords.length > 0);

  const store = new LocalIncidentStore();
  const fakeAccessKey = ["AKIA", "1234567890ABCDEF"].join("");
  assert.throws(() => store.putCase({
    caseId: "CASE-BAD",
    records: [{ PK: "CASE#CASE-BAD", SK: "CASE#META", entity: "CASE", token: fakeAccessKey }]
  }), /credential-like/);
  assert.deepEqual(findCredentialLikeValues({ ok: "public-value" }), []);
}

function testDynamoAdapterAndCloudReadiness() {
  const caseData = buildCase({ scenarioId: "identity" });
  const putRequests = buildPutRequests(caseData.records, "IncidentZeroCases");
  assert.equal(putRequests.length, caseData.records.length);
  assert.equal(putRequests[0].TableName, "IncidentZeroCases");
  assert.ok(putRequests[0].ConditionExpression.includes("attribute_not_exists"));

  const chunks = buildBatchWriteChunks(caseData.records, "IncidentZeroCases");
  assert.equal(chunks.length, 1);
  assert.equal(chunks[0].RequestItems.IncidentZeroCases.length, caseData.records.length);

  const missing = dynamoReadinessFromEnv({ INCIDENT_ZERO_STORAGE: "dynamodb" });
  assert.equal(missing.liveWriteEnabled, false);
  assert.ok(missing.missing.includes("INCIDENT_ZERO_DYNAMODB_TABLE"));
  assert.ok(missing.missing.includes("AWS_REGION"));

  const ready = dynamoReadinessFromEnv({
    INCIDENT_ZERO_STORAGE: "dynamodb",
    INCIDENT_ZERO_DYNAMODB_TABLE: "IncidentZeroCases",
    AWS_REGION: "us-east-1"
  });
  assert.equal(ready.liveWriteEnabled, true);
  assert.deepEqual(ready.missing, []);

  const cloud = cloudReadiness({
    INCIDENT_ZERO_STORAGE: "dynamodb",
    INCIDENT_ZERO_DYNAMODB_TABLE: "IncidentZeroCases",
    AWS_REGION: "us-east-1",
    INCIDENT_ZERO_PUBLIC_URL: "https://example.invalid"
  });
  assert.equal(cloud.okForPublicCloudClaim, true);
  assert.equal(cloud.safety.returnsSecretValues, false);
  assert.ok(cloud.iamPolicyTemplate.Statement[0].Action.includes("dynamodb:Query"));

  const localCloud = cloudReadiness({});
  assert.equal(localCloud.okForPublicCloudClaim, false);
  assert.ok(localCloud.missingAccountOwnerGates.includes("INCIDENT_ZERO_STORAGE=dynamodb"));
  assert.ok(localCloud.missingAccountOwnerGates.includes("INCIDENT_ZERO_DYNAMODB_TABLE"));
  assert.ok(localCloud.missingAccountOwnerGates.includes("AWS_REGION"));
}

function testNormalizationAndRisk() {
  const alert = normalizeAlert({
    severity: "unexpected",
    signals: "First signal\nSecond signal",
    impactedUsers: "44",
    evidenceConfidence: "71",
    customerImpact: "true"
  });
  assert.equal(alert.severity, "medium");
  assert.equal(alert.signals.length, 2);
  assert.equal(alert.impactedUsers, 44);
  assert.equal(alert.customerImpact, true);
  assert.ok(riskScore({ severity: "low", title: "Routine notice", signals: ["Benign event"], evidenceConfidence: 10 }) >= 1);
}

function testTaskShape() {
  const tasks = responseTasks({ severity: "critical", contained: true });
  assert.ok(tasks.every((task) => task.id && task.owner && task.dueAt && task.acceptance));
  assert.ok(tasks.some((task) => task.status === "complete"));
}

function testSlackAgentPack() {
  const response = createSlackAgentResponse({ scenarioId: "payments", severity: "high" });
  assert.equal(response.response_type, "ephemeral");
  assert.ok(response.text.includes("Incident Zero brief"));
  assert.ok(response.blocks.some((block) => block.type === "actions"));
  assert.equal(response.metadata.scenarioId, "payments");
  assert.equal(response.metadata.noSecretsStored, true);
  assert.ok(response.metadata.accountOwnerGates.includes("Slack signing secret"));

  const manifest = createSlackAppManifest({ publicUrl: "https://incident-zero.example/app/" });
  assert.equal(manifest.features.slash_commands[0].url, "https://incident-zero.example/app/api/slack-agent");
  assert.equal(manifest.settings.interactivity.request_url, "https://incident-zero.example/app/api/slack-agent");
  assert.ok(manifest.oauth_config.scopes.bot.includes("commands"));

  const parsed = parseSlackText("scenario=data severity=critical confidence=92 users=18 contained=false customerImpact=true ignored");
  assert.deepEqual(parsed, {
    scenarioId: "data",
    severity: "critical",
    evidenceConfidence: "92",
    impactedUsers: "18",
    contained: "false",
    customerImpact: "true"
  });

  const pack = createSlackAgentSubmissionPack({
    publicUrl: "https://incident-zero.example",
    sourceRepoUrl: "https://github.com/OOYXLOO/incident-zero-stack"
  });
  assert.equal(pack.examples.length, scenarioList().length);
  assert.ok(pack.architectureNotes.some((note) => note.includes("/api/slack-agent")));
  assert.ok(pack.architectureNotes.some((note) => note.includes("docs/slack-agent-architecture.svg")));
  assert.ok(pack.architectureNotes.some((note) => note.includes("MCP server")));
  assert.ok(pack.judgingFit.some((item) => item.includes("MCP")));
  assert.ok(pack.submissionChecklist.some((item) => item.label === "MCP server integration" && item.status === "ready"));
  assert.ok(pack.nextExternalGates.includes("Create Slack app from the generated manifest."));
  assert.equal(pack.challenge.name, "Slack Agent Builder Challenge");
  assert.equal(pack.challenge.url, "https://slackhack.devpost.com/");
  assert.ok(pack.challenge.deadline.includes("July 13, 2026"));
  assert.deepEqual(pack.challenge.sandboxTesterEmails, ["slackhack@salesforce.com", "testing@devpost.com"]);
  assert.ok(pack.submissionChecklist.some((item) => item.label === "3-minute demo video" && item.status === "user-gated"));
  assert.ok(pack.submissionChecklist.some((item) => item.label === "Architecture diagram" && item.status === "ready"));
  assert.ok(pack.submissionChecklist.some((item) => item.label === "Architecture diagram" && item.detail.includes("docs/slack-agent-architecture.svg")));
  assert.ok(pack.submissionChecklist.some((item) => item.label === "Slack developer sandbox URL" && item.status === "user-gated"));
  assert.ok(pack.submissionChecklist.some((item) => item.label === "Sandbox tester invites" && item.detail.includes("slackhack@salesforce.com")));
  assert.ok(pack.submissionChecklist.some((item) => item.label === "Sandbox payment-method verification" && item.status === "user-gated"));
  assert.ok(pack.submissionChecklist.some((item) => item.label === "Source repository" && item.status === "ready"));
  assert.ok(pack.safetyBoundary.some((item) => item.includes("No Slack tokens")));

  const markdown = formatSlackAgentSubmissionMarkdown(pack);
  assert.match(markdown, /# Incident Zero Agent - Slack Challenge Submission Pack/);
  assert.match(markdown, /Slack Agent Builder Challenge/);
  assert.match(markdown, /slackhack@salesforce\.com/);
  assert.match(markdown, /payment-method verification/);
  assert.match(markdown, /MCP server integration/);
  assert.match(markdown, /3-minute demo video/);
  assert.match(markdown, /No Slack tokens/);
  assert.equal(hasInternalStrategyWording(markdown), false);
}

function testMcpToolDefinitionsAndCalls() {
  const tools = createMcpToolDefinitions();
  assert.ok(tools.length >= 3);
  assert.ok(tools.some((tool) => tool.name === "incident_zero_brief"));
  assert.ok(tools.some((tool) => tool.name === "incident_zero_handoff"));
  assert.ok(tools.some((tool) => tool.name === "incident_zero_storage_preview"));
  assert.ok(tools.every((tool) => tool.inputSchema && tool.inputSchema.type === "object"));

  const brief = callIncidentTool("incident_zero_brief", {
    scenarioId: "payments",
    severity: "high",
    contained: false
  });
  assert.equal(brief.content[0].type, "text");
  assert.equal(brief.structuredContent.caseId, "CASE-2026-0619-02");
  assert.equal(brief.structuredContent.scenarioId, "payments");
  assert.ok(brief.structuredContent.risk > 0);
  assert.ok(brief.structuredContent.topActions.length > 0);

  const handoff = callIncidentTool("incident_zero_handoff", { scenarioId: "data" });
  assert.ok(handoff.structuredContent.markdown.includes("Unusual data export"));
  assert.ok(handoff.content[0].text.includes("Executive Handoff"));

  const storage = callIncidentTool("incident_zero_storage_preview", { scenarioId: "identity" });
  assert.equal(storage.structuredContent.storagePlan.liveAdapterTarget, "aws-dynamodb");
  assert.ok(storage.structuredContent.sampleRecords.length > 0);

  assert.throws(() => callIncidentTool("unknown_tool", {}), /Unknown MCP tool/);
}

function testSlackAgentPackExporter() {
  const tmpDir = path.join(os.tmpdir(), "incident-zero-stack-tests");
  fs.mkdirSync(tmpDir, { recursive: true });
  const outputFile = path.join(tmpDir, "slack-challenge-pack.md");
  fs.rmSync(outputFile, { force: true });

  const result = childProcess.spawnSync(process.execPath, [
    "scripts/export-slack-agent-pack.js",
    "--public-url",
    "https://incident-zero.example",
    "--source-repo-url",
    "https://github.com/OOYXLOO/incident-zero-stack",
    "--markdown-output",
    outputFile
  ], {
    cwd: path.resolve(__dirname, ".."),
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr);
  const json = JSON.parse(result.stdout);
  assert.equal(json.sourceRepoUrl, "https://github.com/OOYXLOO/incident-zero-stack");
  assert.equal(json.challenge.name, "Slack Agent Builder Challenge");
  assert.equal(fs.existsSync(outputFile), true);
  const markdown = fs.readFileSync(outputFile, "utf8");
  assert.ok(markdown.includes("Incident Zero Agent - Slack Challenge Submission Pack"));
  assert.ok(markdown.includes("Slack developer sandbox URL"));
  assert.equal(hasInternalStrategyWording(markdown), false);

  const preGateOutput = path.join(tmpDir, "slack-challenge-pre-gate-pack.md");
  fs.rmSync(preGateOutput, { force: true });
  const preGate = childProcess.spawnSync(process.execPath, [
    "scripts/export-slack-agent-pack.js",
    "--allow-pending-public-url",
    "--source-repo-url",
    "https://github.com/OOYXLOO/incident-zero-stack",
    "--markdown-output",
    preGateOutput
  ], {
    cwd: path.resolve(__dirname, ".."),
    encoding: "utf8"
  });

  assert.equal(preGate.status, 0, preGate.stderr);
  const preGateJson = JSON.parse(preGate.stdout);
  assert.equal(preGateJson.publicUrl, "pending user gate: public HTTPS deployment URL");
  assert.equal(preGateJson.manifest.status, "pending-public-url");
  assert.equal(fs.existsSync(preGateOutput), true);
  const preGateMarkdown = fs.readFileSync(preGateOutput, "utf8");
  assert.ok(preGateMarkdown.includes("Public app URL: pending user gate"));
  assert.ok(preGateMarkdown.includes("Manifest draft: pending public deployment URL"));
  assert.ok(preGateMarkdown.includes("<public-deployment-url>/api/slack-agent"));
  assert.equal(hasInternalStrategyWording(preGateMarkdown), false);
}

function testSlackManifestExporter() {
  assert.equal(normalizeSlackManifestUrl("https://incident-zero.example/demo/"), "https://incident-zero.example/demo");
  assert.throws(() => normalizeSlackManifestUrl("http://incident-zero.example"), /https/);
  assert.throws(() => validateSlackManifest(createSlackAppManifest({ publicUrl: "https://example.com" })), /placeholder/);

  const manifest = buildImportReadyManifest("https://incident-zero.example");
  assert.equal(manifest.features.slash_commands[0].url, "https://incident-zero.example/api/slack-agent");
  assert.equal(manifest.settings.interactivity.request_url, "https://incident-zero.example/api/slack-agent");
  assert.equal(validateSlackManifest(manifest), true);
  assert.equal(hasInternalStrategyWording(JSON.stringify(manifest)), false);

  const cli = childProcess.spawnSync(process.execPath, [
    "scripts/export-slack-manifest.js",
    "--public-url",
    "https://incident-zero.example"
  ], {
    cwd: path.resolve(__dirname, ".."),
    encoding: "utf8"
  });
  assert.equal(cli.status, 0, cli.stderr);
  const cliManifest = JSON.parse(cli.stdout);
  assert.equal(cliManifest.features.slash_commands[0].url, "https://incident-zero.example/api/slack-agent");
  assert.equal(hasInternalStrategyWording(cli.stdout), false);
}

function testSlackSubmissionAudit() {
  const result = childProcess.spawnSync(process.execPath, [
    "scripts/audit-slack-submission.js",
    "--public-url",
    "https://incident-zero.example"
  ], {
    cwd: path.resolve(__dirname, ".."),
    encoding: "utf8"
  });
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes("PASS public-url"));
  assert.ok(result.stdout.includes("PASS slack-manifest"));
  assert.ok(result.stdout.includes("PASS static-review-links"));
  assert.ok(result.stdout.includes("PASS demo-video-assets"));
  assert.ok(result.stdout.includes("PASS account-owner-gates"));
  assert.equal(hasInternalStrategyWording(result.stdout), false);
}

function testDeploymentGatePrinter() {
  const checklist = buildGateChecklist({
    publicUrl: "https://incident-zero.example/app/",
    env: {
      INCIDENT_ZERO_STORAGE: "dynamodb",
      INCIDENT_ZERO_DYNAMODB_TABLE: "IncidentZeroCases",
      AWS_REGION: "us-east-1"
    }
  });
  assert.equal(checklist.publicUrl, "https://incident-zero.example/app");
  assert.equal(checklist.readyForPublicCloudClaim, true);
  assert.deepEqual(checklist.missingAccountOwnerGates, []);
  assert.ok(checklist.requiredEnvironmentNames.includes("INCIDENT_ZERO_DYNAMODB_TABLE"));
  assert.ok(checklist.verificationCommands.some((command) => command.includes("audit:slack-submission")));

  const markdown = printDeploymentGateMarkdown(checklist);
  assert.ok(markdown.includes("Incident Zero Agent Deployment Gates"));
  assert.ok(markdown.includes("slackhack@salesforce.com"));
  assert.ok(markdown.includes("Do not paste Slack tokens"));
  assert.equal(hasInternalStrategyWording(markdown), false);
}

function testDeploymentGatePrinterPendingUrl() {
  const checklist = buildGateChecklist({ env: {} });
  assert.equal(checklist.publicUrl, "pending account-owner deployment");
  assert.equal(checklist.readyForPublicCloudClaim, false);
  assert.ok(checklist.missingAccountOwnerGates.includes("INCIDENT_ZERO_PUBLIC_URL"));
  assert.ok(checklist.verificationCommands.some((command) => command.includes("https://<public-deployment-url>")));
}

function testStaticDemoExporter() {
  const tmpDir = path.join(os.tmpdir(), "incident-zero-stack-tests");
  fs.mkdirSync(tmpDir, { recursive: true });
  const outputFile = path.join(tmpDir, "static-demo-data.js");
  fs.rmSync(outputFile, { force: true });

  const result = childProcess.spawnSync(process.execPath, [
    "scripts/export-static-demo.js",
    "--out",
    outputFile
  ], {
    cwd: path.resolve(__dirname, ".."),
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(outputFile), true);
  const text = fs.readFileSync(outputFile, "utf8");
  assert.ok(text.startsWith("window.INCIDENT_ZERO_STATIC_DEMO = "));
  assert.ok(text.includes("Privileged token anomaly"));
  assert.ok(text.includes("Duplicate payment webhook replay"));
  assert.ok(text.includes("Unusual data export"));
  assert.ok(text.includes("demoSteps"));
  assert.equal(hasInternalStrategyWording(text), false);
}

function testStaticDemoIsWiredIntoPublicApp() {
  const root = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
  const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
  assert.ok(html.includes("static-demo-data.js"));
  assert.ok(html.indexOf("static-demo-data.js") < html.indexOf("app.js"));
  assert.ok(app.includes("INCIDENT_ZERO_STATIC_DEMO"));
  assert.ok(app.includes("fetchJsonWithFallback"));
}

function testStaticMarkdownExportIsWiredIntoPublicApp() {
  const root = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
  const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
  assert.ok(html.includes("id=\"export-markdown\""));
  assert.ok(html.includes("Export Markdown"));
  assert.ok(app.includes("function downloadMarkdown"));
  assert.ok(app.includes("markdown;charset=utf-8"));
  assert.ok(app.includes("export-markdown"));
}

function testPagesWorkflowPublishesStaticDemo() {
  const root = path.resolve(__dirname, "..");
  const workflowPath = path.join(root, ".github/workflows/pages.yml");
  assert.equal(fs.existsSync(workflowPath), true);
  const workflow = fs.readFileSync(workflowPath, "utf8");
  assert.ok(workflow.includes("actions/upload-pages-artifact"));
  assert.ok(workflow.includes("actions/deploy-pages"));
  assert.ok(workflow.includes("path: public"));
  assert.ok(workflow.includes("pages: write"));
  assert.ok(workflow.includes("id-token: write"));
}

function testPathGuard() {
  assert.equal(safePublicPath("/../README.md"), null);
  const indexPath = safePublicPath("/index.html");
  assert.ok(indexPath.endsWith("public\\index.html") || indexPath.endsWith("public/index.html"));
}

function testServerDefaultExportIsVercelHandler() {
  assert.equal(typeof serverModule, "function");
  assert.equal(serverModule, handleRequest);
  assert.equal(serverModule.handleRequest, handleRequest);
  assert.equal(serverModule.safePublicPath, safePublicPath);
}

function testPublicVerifierHelpers() {
  assert.equal(normalizeBaseUrl("https://example.com/demo/"), "https://example.com/demo");
  assert.throws(() => normalizeBaseUrl("ftp://example.com"), /http/);
}

function testLiveProofGuards() {
  assert.throws(() => requireLiveWriteApproval({}), /Refusing live DynamoDB write/);
  assert.doesNotThrow(() => requireLiveWriteApproval({ INCIDENT_ZERO_ALLOW_LIVE_WRITE: "1" }));
  assert.equal(redact(["AKIA", "EXAMPLE123456789"].join("")), "AK****89");
  assert.equal(redact("abc"), "****");
}

function requestJson(server, path, options = {}) {
  const body = options.rawBody !== undefined ? options.rawBody : (options.body ? JSON.stringify(options.body) : null);
  const headers = options.headers || (options.rawBody !== undefined ? {
    "content-type": "application/x-www-form-urlencoded"
  } : {
    "content-type": "application/json"
  });
  return new Promise((resolve, reject) => {
    const request = http.request({
      hostname: "127.0.0.1",
      port: server.address().port,
      path,
      method: options.method || "GET",
      headers: body ? {
        ...headers,
        "content-length": Buffer.byteLength(body)
      } : undefined
    }, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        try {
          resolve({ status: response.statusCode, body: JSON.parse(data) });
        } catch (error) {
          reject(error);
        }
      });
    });
    request.on("error", reject);
    if (body) request.write(body);
    request.end();
  });
}

function invokeVercelFunction(fn, { method = "GET", url = "/", body } = {}) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const response = {
      statusCode: 200,
      headers: {},
      setHeader(name, value) {
        this.headers[name.toLowerCase()] = value;
      },
      end(value) {
        if (value !== undefined) chunks.push(String(value));
        resolve({
          status: this.statusCode,
          headers: this.headers,
          body: chunks.join("")
        });
      }
    };

    try {
      fn({ method, url, body }, response);
    } catch (error) {
      reject(error);
    }
  });
}

async function testHttpApi() {
  const server = http.createServer((request, response) => {
    handleRequest(request, response).catch((error) => {
      response.writeHead(500, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: error.message }));
    });
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const scenarios = await requestJson(server, "/api/scenarios");
    assert.equal(scenarios.status, 200);
    assert.equal(scenarios.body.scenarios.length, 3);

  const custom = await requestJson(server, "/api/case", {
      method: "POST",
      body: {
        scenarioId: "data",
        severity: "high",
        contained: false,
        evidenceConfidence: 92
      }
    });
    assert.equal(custom.status, 200);
    assert.equal(custom.body.alert.scenarioId, "data");
    assert.equal(custom.body.alert.severity, "high");
    assert.equal(custom.body.alert.evidenceConfidence, 92);
    assert.ok(custom.body.handoff.markdown.includes("Executive Handoff"));

    const storage = await requestJson(server, "/api/storage-preview?scenario=payments");
    assert.equal(storage.status, 200);
    assert.equal(storage.body.storagePlan.liveAdapterTarget, "aws-dynamodb");

    const cloud = await requestJson(server, "/api/cloud-readiness");
    assert.equal(cloud.status, 200);
    assert.equal(cloud.body.okForLocalReview, true);
    assert.equal(cloud.body.safety.returnsSecretValues, false);

    const slackGet = await requestJson(server, "/api/slack-agent?scenario=payments&severity=high");
    assert.equal(slackGet.status, 200);
    assert.equal(slackGet.body.metadata.scenarioId, "payments");
    assert.ok(slackGet.body.blocks.some((block) => block.type === "actions"));

    const slackForm = await requestJson(server, "/api/slack-agent?contentType=form", {
      method: "POST",
      rawBody: "text=scenario%3Ddata%20severity%3Dcritical%20confidence%3D92"
    });
    assert.equal(slackForm.status, 200);
    assert.equal(slackForm.body.metadata.scenarioId, "data");

    const verification = await runPublicVerification(`http://127.0.0.1:${server.address().port}`);
    assert.deepEqual(verification.map((result) => result.ok), verification.map(() => true));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function testVercelFunctions() {
  const caseResponse = await invokeVercelFunction(caseFunction, {
    method: "POST",
    url: "/api/case",
    body: { scenarioId: "payments", contained: false }
  });
  assert.equal(caseResponse.status, 200);
  assert.equal(JSON.parse(caseResponse.body).alert.scenarioId, "payments");

  const handoffResponse = await invokeVercelFunction(handoffFunction, {
    method: "GET",
    url: "/api/handoff?scenario=data"
  });
  assert.equal(handoffResponse.status, 200);
  assert.ok(handoffResponse.body.includes("Unusual data export"));
  assert.equal(handoffResponse.headers["content-type"], "text/markdown; charset=utf-8");

  const storageResponse = await invokeVercelFunction(storagePreviewFunction, {
    method: "GET",
    url: "/api/storage-preview?scenario=identity"
  });
  assert.equal(storageResponse.status, 200);
  assert.equal(JSON.parse(storageResponse.body).storagePlan.liveAdapterTarget, "aws-dynamodb");

  const cloudResponse = await invokeVercelFunction(cloudReadinessFunction, {
    method: "GET",
    url: "/api/cloud-readiness"
  });
  assert.equal(cloudResponse.status, 200);
  assert.equal(JSON.parse(cloudResponse.body).okForLocalReview, true);

  const slackResponse = await invokeVercelFunction(slackAgentFunction, {
    method: "POST",
    url: "/api/slack-agent",
    body: { scenarioId: "data", severity: "critical" }
  });
  assert.equal(slackResponse.status, 200);
  assert.equal(JSON.parse(slackResponse.body).metadata.scenarioId, "data");

  const slackHeadResponse = await invokeVercelFunction(slackAgentFunction, {
    method: "HEAD",
    url: "/api/slack-agent"
  });
  assert.equal(slackHeadResponse.status, 200);
  assert.equal(slackHeadResponse.body, "");
}

async function main() {
  testDefaultCase();
  testScenarioLibrary();
  testDynamoRecords();
  testHandoffAndStoragePlan();
  testDynamoAdapterAndCloudReadiness();
  testNormalizationAndRisk();
  testTaskShape();
  testMcpToolDefinitionsAndCalls();
  testSlackAgentPack();
  testSlackAgentPackExporter();
  testDemoStoryboardVideoPlan();
  testSlackManifestExporter();
  testSlackSubmissionAudit();
  testDeploymentGatePrinter();
  testDeploymentGatePrinterPendingUrl();
  testStaticDemoExporter();
  testStaticDemoIsWiredIntoPublicApp();
  testStaticMarkdownExportIsWiredIntoPublicApp();
  testPagesWorkflowPublishesStaticDemo();
  testPathGuard();
  testServerDefaultExportIsVercelHandler();
  testPublicVerifierHelpers();
  testLiveProofGuards();
  await testHttpApi();
  await testVercelFunctions();
  console.log("incident zero tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
