"use strict";

const assert = require("assert");
const http = require("http");
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
const { handleRequest, safePublicPath } = require("../src/server");
const caseFunction = require("../api/case");
const cloudReadinessFunction = require("../api/cloud-readiness");
const handoffFunction = require("../api/handoff");
const storagePreviewFunction = require("../api/storage-preview");
const { LocalIncidentStore, createStoragePreview, findCredentialLikeValues } = require("../src/storage");

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
  assert.throws(() => store.putCase({
    caseId: "CASE-BAD",
    records: [{ PK: "CASE#CASE-BAD", SK: "CASE#META", entity: "CASE", token: "AKIA1234567890ABCDEF" }]
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
}

async function main() {
  testDefaultCase();
  testScenarioLibrary();
  testDynamoRecords();
  testHandoffAndStoragePlan();
  testDynamoAdapterAndCloudReadiness();
  testNormalizationAndRisk();
  testTaskShape();
  testPathGuard();
  await testHttpApi();
  await testVercelFunctions();
  console.log("incident zero tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
