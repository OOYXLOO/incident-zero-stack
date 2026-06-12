"use strict";

const DEFAULT_ALERT = Object.freeze({
  caseId: "CASE-2026-0612-01",
  title: "Privileged token anomaly",
  severity: "critical",
  source: "cloud-idp",
  detectedAt: "2026-06-12T08:21:09Z",
  owner: "Identity response",
  impactedSystem: "build-prod-runner",
  signals: [
    "Token used from previously unseen ASN",
    "Admin API call followed by audit-log export",
    "CI runner assumed production deploy role outside release window"
  ]
});

const DYNAMODB_SCHEMA = Object.freeze({
  tableName: "IncidentZeroCases",
  partitionKey: "PK",
  sortKey: "SK",
  indexes: [
    {
      name: "GSI1",
      partitionKey: "GSI1PK",
      sortKey: "GSI1SK",
      purpose: "Query open incidents by severity and updated time"
    }
  ],
  entities: [
    "CASE",
    "ALERT",
    "EVIDENCE",
    "TASK",
    "AUDIT",
    "HANDOFF"
  ]
});

function severityRank(severity) {
  const normalized = String(severity || "medium").toLowerCase();
  return { critical: 4, high: 3, medium: 2, low: 1 }[normalized] || 2;
}

function normalizeAlert(alert = {}) {
  const merged = { ...DEFAULT_ALERT, ...alert };
  const signals = Array.isArray(merged.signals) && merged.signals.length ? merged.signals : DEFAULT_ALERT.signals;
  const severity = String(merged.severity || "medium").toLowerCase();
  return {
    ...merged,
    severity: ["critical", "high", "medium", "low"].includes(severity) ? severity : "medium",
    signals
  };
}

function riskScore(alertInput) {
  const alert = normalizeAlert(alertInput);
  const severityBase = { critical: 90, high: 76, medium: 52, low: 20 }[alert.severity];
  const signalBoost = Math.min(alert.signals.length * 3, 10);
  const identityBoost = /token|identity|admin|privileged|role/i.test(`${alert.title} ${alert.signals.join(" ")}`) ? 7 : 0;
  return Math.min(100, severityBase + signalBoost + identityBoost);
}

function responseTasks(alertInput) {
  const alert = normalizeAlert(alertInput);
  const rank = severityRank(alert.severity);
  return [
    {
      id: "task-rotate-token",
      owner: "Identity response",
      status: rank >= 3 ? "ready" : "queued",
      action: "Rotate token, revoke sessions, and preserve token metadata"
    },
    {
      id: "task-freeze-runner",
      owner: "Platform owner",
      status: rank >= 4 ? "ready" : "queued",
      action: `Pause ${alert.impactedSystem} until deploy-role use is reviewed`
    },
    {
      id: "task-export-evidence",
      owner: "Detection engineer",
      status: "ready",
      action: "Export identity, audit, and CI runner logs into evidence records"
    },
    {
      id: "task-handoff",
      owner: "Incident commander",
      status: "drafted",
      action: "Publish executive handoff with scope, owner, and next update time"
    }
  ];
}

function evidenceItems(alertInput) {
  const alert = normalizeAlert(alertInput);
  return alert.signals.map((signal, index) => ({
    id: `evidence-${String(index + 1).padStart(3, "0")}`,
    source: alert.source,
    status: index === 0 ? "corroborated" : "pending-review",
    detail: signal
  }));
}

function auditEvents(alertInput) {
  const alert = normalizeAlert(alertInput);
  return [
    {
      at: alert.detectedAt,
      event: "alert_ingested",
      detail: `${alert.source} generated ${alert.caseId}`
    },
    {
      at: "2026-06-12T08:22:17Z",
      event: "case_opened",
      detail: "Incident Zero created owner map and evidence ledger"
    },
    {
      at: "2026-06-12T08:24:45Z",
      event: "containment_ready",
      detail: "Token rotation and runner pause tasks marked ready"
    },
    {
      at: "2026-06-12T08:27:30Z",
      event: "handoff_drafted",
      detail: "Executive summary and analyst next actions generated"
    }
  ];
}

function dynamoRecord(entity, caseId, sortSuffix, attributes = {}) {
  return {
    PK: `CASE#${caseId}`,
    SK: `${entity}#${sortSuffix}`,
    entity,
    ...attributes
  };
}

function databaseRecords(alertInput) {
  const alert = normalizeAlert(alertInput);
  const risk = riskScore(alert);
  const tasks = responseTasks(alert);
  const evidence = evidenceItems(alert);
  const audits = auditEvents(alert);

  return [
    dynamoRecord("CASE", alert.caseId, "META", {
      title: alert.title,
      severity: alert.severity,
      owner: alert.owner,
      risk,
      GSI1PK: `OPEN#${alert.severity.toUpperCase()}`,
      GSI1SK: alert.detectedAt
    }),
    dynamoRecord("ALERT", alert.caseId, alert.detectedAt, {
      source: alert.source,
      impactedSystem: alert.impactedSystem
    }),
    ...evidence.map((item) => dynamoRecord("EVIDENCE", alert.caseId, item.id, item)),
    ...tasks.map((task) => dynamoRecord("TASK", alert.caseId, task.id, task)),
    ...audits.map((event) => dynamoRecord("AUDIT", alert.caseId, event.at, event)),
    dynamoRecord("HANDOFF", alert.caseId, "EXECUTIVE", {
      summary: `${alert.severity.toUpperCase()} ${alert.title}: ${risk}/100 risk, ${evidence.length} evidence items, ${tasks.length} response tasks.`
    })
  ];
}

function buildCase(alertInput) {
  const alert = normalizeAlert(alertInput);
  const risk = riskScore(alert);
  return {
    caseId: alert.caseId,
    alert,
    risk,
    tasks: responseTasks(alert),
    evidence: evidenceItems(alert),
    audit: auditEvents(alert),
    records: databaseRecords(alert),
    schema: DYNAMODB_SCHEMA,
    gates: {
      noSecretsStored: true,
      liveAwsDatabaseClaimed: false,
      vercelDeploymentClaimed: false,
      awsScreenshotRequired: true,
      devpostFinalSubmitRequired: true
    }
  };
}

module.exports = {
  DEFAULT_ALERT,
  DYNAMODB_SCHEMA,
  normalizeAlert,
  riskScore,
  responseTasks,
  evidenceItems,
  auditEvents,
  databaseRecords,
  buildCase
};
