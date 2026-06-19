"use strict";

const assert = require("assert");
const http = require("http");
const {
  DYNAMODB_SCHEMA,
  buildCase,
  databaseRecords,
  normalizeAlert,
  responseTasks,
  riskScore,
  scenarioList
} = require("../src/incidentZero");
const { handleRequest, safePublicPath } = require("../src/server");

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

function testPathGuard() {
  assert.equal(safePublicPath("/../README.md"), null);
  const indexPath = safePublicPath("/index.html");
  assert.ok(indexPath.endsWith("public\\index.html") || indexPath.endsWith("public/index.html"));
}

function requestJson(server, path, options = {}) {
  const body = options.body ? JSON.stringify(options.body) : null;
  return new Promise((resolve, reject) => {
    const request = http.request({
      hostname: "127.0.0.1",
      port: server.address().port,
      path,
      method: options.method || "GET",
      headers: body ? {
        "content-type": "application/json",
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
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function main() {
  testDefaultCase();
  testScenarioLibrary();
  testDynamoRecords();
  testNormalizationAndRisk();
  testTaskShape();
  testPathGuard();
  await testHttpApi();
  console.log("incident zero tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
