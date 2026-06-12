"use strict";

const assert = require("assert");
const {
  DYNAMODB_SCHEMA,
  buildCase,
  databaseRecords,
  normalizeAlert,
  riskScore
} = require("../src/incidentZero");
const { safePublicPath } = require("../src/server");

function testDefaultCase() {
  const result = buildCase();
  assert.equal(result.caseId, "CASE-2026-0612-01");
  assert.equal(result.alert.severity, "critical");
  assert.equal(result.risk, 100);
  assert.equal(result.evidence.length, 3);
  assert.equal(result.tasks.length, 4);
  assert.equal(result.audit.length, 4);
  assert.equal(result.gates.noSecretsStored, true);
  assert.equal(result.gates.liveAwsDatabaseClaimed, false);
  assert.equal(result.gates.vercelDeploymentClaimed, false);
}

function testDynamoRecords() {
  const records = databaseRecords();
  assert.ok(records.length >= 10);
  assert.ok(records.every((record) => record.PK === "CASE#CASE-2026-0612-01"));
  assert.ok(records.some((record) => record.entity === "EVIDENCE"));
  assert.ok(records.some((record) => record.entity === "HANDOFF"));
  assert.equal(DYNAMODB_SCHEMA.partitionKey, "PK");
  assert.equal(DYNAMODB_SCHEMA.sortKey, "SK");
}

function testNormalizationAndRisk() {
  const alert = normalizeAlert({ severity: "unexpected", signals: [] });
  assert.equal(alert.severity, "medium");
  assert.equal(alert.signals.length, 3);
  assert.ok(riskScore({ severity: "low", title: "Routine notice", signals: ["No token"] }) >= 20);
}

function testPathGuard() {
  assert.equal(safePublicPath("/../README.md"), null);
  const indexPath = safePublicPath("/index.html");
  assert.ok(indexPath.endsWith("public\\index.html") || indexPath.endsWith("public/index.html"));
}

testDefaultCase();
testDynamoRecords();
testNormalizationAndRisk();
testPathGuard();

console.log("incident zero tests passed");
