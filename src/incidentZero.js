"use strict";

const SEVERITIES = Object.freeze(["critical", "high", "medium", "low"]);

const SCENARIOS = Object.freeze({
  identity: Object.freeze({
    id: "identity",
    name: "Privileged Identity",
    caseId: "CASE-2026-0612-01",
    title: "Privileged token anomaly",
    severity: "critical",
    source: "cloud-idp",
    detectedAt: "2026-06-12T08:21:09Z",
    owner: "Identity response",
    impactedSystem: "build-prod-runner",
    impactedUsers: 14,
    customerImpact: true,
    contained: false,
    evidenceConfidence: 88,
    revenueAtRiskUsd: 8400,
    signals: [
      "Token used from previously unseen ASN",
      "Admin API call followed by audit-log export",
      "CI runner assumed production deploy role outside release window"
    ]
  }),
  payments: Object.freeze({
    id: "payments",
    name: "Payment Webhook",
    caseId: "CASE-2026-0619-02",
    title: "Duplicate payment webhook replay",
    severity: "high",
    source: "payments-edge",
    detectedAt: "2026-06-19T03:18:44Z",
    owner: "Revenue platform",
    impactedSystem: "checkout-ledger",
    impactedUsers: 126,
    customerImpact: true,
    contained: true,
    evidenceConfidence: 74,
    revenueAtRiskUsd: 21400,
    signals: [
      "Webhook signature valid but nonce reused six times",
      "Ledger rows show repeated idempotency key drift",
      "Refund queue has mismatch between provider event and order state"
    ]
  }),
  data: Object.freeze({
    id: "data",
    name: "Data Export",
    caseId: "CASE-2026-0619-03",
    title: "Unusual data export from analyst workspace",
    severity: "medium",
    source: "warehouse-audit",
    detectedAt: "2026-06-19T05:06:12Z",
    owner: "Data governance",
    impactedSystem: "analytics-workspace",
    impactedUsers: 5,
    customerImpact: false,
    contained: false,
    evidenceConfidence: 61,
    revenueAtRiskUsd: 0,
    signals: [
      "Export volume exceeded analyst baseline by 9x",
      "Query touched regulated-data views",
      "Destination bucket was newly created and has no owner tag"
    ]
  })
});

const DEFAULT_ALERT = SCENARIOS.identity;

const DYNAMODB_SCHEMA = Object.freeze({
  tableName: "IncidentZeroCases",
  partitionKey: "PK",
  sortKey: "SK",
  indexes: [
    {
      name: "GSI1",
      partitionKey: "GSI1PK",
      sortKey: "GSI1SK",
      purpose: "Query active incidents by severity and updated time"
    },
    {
      name: "GSI2",
      partitionKey: "GSI2PK",
      sortKey: "GSI2SK",
      purpose: "Query owner workload, due tasks, and handoff readiness"
    }
  ],
  entities: [
    "CASE",
    "ALERT",
    "EVIDENCE",
    "TASK",
    "AUDIT",
    "UPDATE",
    "METRIC",
    "HANDOFF"
  ],
  accessPatterns: [
    "Load one incident with all response records",
    "List open incidents by severity",
    "Find response tasks due within the next SLA window",
    "Export an executive handoff packet without scanning the table"
  ]
});

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function toBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return ["true", "1", "yes", "on"].includes(value.toLowerCase());
  }
  return fallback;
}

function normalizeSeverity(value) {
  const severity = String(value || "medium").toLowerCase();
  return SEVERITIES.includes(severity) ? severity : "medium";
}

function scenarioFromId(id) {
  return SCENARIOS[id] || DEFAULT_ALERT;
}

function parseSignals(value, fallbackSignals) {
  if (Array.isArray(value)) {
    return value.map((signal) => String(signal).trim()).filter(Boolean).slice(0, 6);
  }
  if (typeof value === "string") {
    return value.split(/\r?\n|;/).map((signal) => signal.trim()).filter(Boolean).slice(0, 6);
  }
  return fallbackSignals.slice();
}

function stableId(input) {
  let hash = 2166136261;
  for (const char of String(input)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function addMinutes(isoDate, minutes) {
  return new Date(new Date(isoDate).getTime() + minutes * 60 * 1000).toISOString();
}

function scenarioList() {
  return Object.values(SCENARIOS).map((scenario) => ({
    id: scenario.id,
    name: scenario.name,
    title: scenario.title,
    severity: scenario.severity
  }));
}

function normalizeAlert(alert = {}) {
  const base = scenarioFromId(alert.scenarioId || alert.id);
  const severity = normalizeSeverity(alert.severity || base.severity);
  const signals = parseSignals(alert.signals, base.signals);

  return {
    ...base,
    ...alert,
    id: alert.scenarioId || alert.id || base.id,
    scenarioId: alert.scenarioId || alert.id || base.id,
    caseId: String(alert.caseId || base.caseId).trim(),
    title: String(alert.title || base.title).trim(),
    severity,
    source: String(alert.source || base.source).trim(),
    detectedAt: String(alert.detectedAt || base.detectedAt).trim(),
    owner: String(alert.owner || base.owner).trim(),
    impactedSystem: String(alert.impactedSystem || base.impactedSystem).trim(),
    impactedUsers: Math.round(clampNumber(alert.impactedUsers, 0, 1000000, base.impactedUsers)),
    customerImpact: toBoolean(alert.customerImpact, base.customerImpact),
    contained: toBoolean(alert.contained, base.contained),
    evidenceConfidence: Math.round(clampNumber(alert.evidenceConfidence, 0, 100, base.evidenceConfidence)),
    revenueAtRiskUsd: Math.round(clampNumber(alert.revenueAtRiskUsd, 0, 100000000, base.revenueAtRiskUsd)),
    signals
  };
}

function severityRank(severity) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[normalizeSeverity(severity)] || 2;
}

function riskScore(alertInput) {
  const alert = normalizeAlert(alertInput);
  const base = { critical: 82, high: 68, medium: 43, low: 18 }[alert.severity];
  const signalBoost = Math.min(alert.signals.length * 4, 18);
  const confidenceBoost = Math.round((alert.evidenceConfidence - 50) / 4);
  const customerBoost = alert.customerImpact ? 9 : 0;
  const userBoost = Math.min(Math.floor(alert.impactedUsers / 25), 8);
  const revenueBoost = Math.min(Math.floor(alert.revenueAtRiskUsd / 5000), 10);
  const containmentDiscount = alert.contained ? 14 : 0;
  const identityBoost = /token|identity|admin|privileged|role|regulated|payment|ledger/i.test(`${alert.title} ${alert.signals.join(" ")}`) ? 6 : 0;

  return Math.min(100, Math.max(1, base + signalBoost + confidenceBoost + customerBoost + userBoost + revenueBoost + identityBoost - containmentDiscount));
}

function responseWindows(alertInput) {
  const alert = normalizeAlert(alertInput);
  const rank = severityRank(alert.severity);
  const triage = { 4: 10, 3: 20, 2: 45, 1: 90 }[rank];
  const contain = { 4: 30, 3: 60, 2: 120, 1: 240 }[rank];
  const update = alert.customerImpact ? Math.max(triage, 30) : contain;
  const handoff = { 4: 120, 3: 180, 2: 360, 1: 720 }[rank];

  return [
    { label: "Triage", dueMinutes: triage, dueAt: addMinutes(alert.detectedAt, triage) },
    { label: "Contain", dueMinutes: contain, dueAt: addMinutes(alert.detectedAt, contain) },
    { label: "Stakeholder update", dueMinutes: update, dueAt: addMinutes(alert.detectedAt, update) },
    { label: "Executive handoff", dueMinutes: handoff, dueAt: addMinutes(alert.detectedAt, handoff) }
  ];
}

function responseTasks(alertInput) {
  const alert = normalizeAlert(alertInput);
  const rank = severityRank(alert.severity);
  const windows = responseWindows(alert);
  const statusFor = (minimumRank, readyWhenContained = false) => {
    if (readyWhenContained && alert.contained) return "complete";
    return rank >= minimumRank ? "ready" : "queued";
  };

  return [
    {
      id: "task-triage",
      stage: "Triage",
      owner: alert.owner,
      status: "ready",
      dueAt: windows[0].dueAt,
      action: `Confirm blast radius for ${alert.impactedSystem} and assign one incident commander`,
      acceptance: "Owner, affected service, severity, and next update time are recorded"
    },
    {
      id: "task-contain-primary",
      stage: "Contain",
      owner: /payment|ledger|checkout/i.test(alert.title) ? "Revenue platform" : "Platform owner",
      status: statusFor(3, true),
      dueAt: windows[1].dueAt,
      action: alert.contained ? "Validate containment and watch for recurrence" : `Freeze risky path on ${alert.impactedSystem} until evidence is preserved`,
      acceptance: "Containment action is reversible, logged, and linked to evidence"
    },
    {
      id: "task-preserve-evidence",
      stage: "Evidence",
      owner: "Detection engineer",
      status: "ready",
      dueAt: windows[1].dueAt,
      action: "Write source logs, analyst notes, and decision markers into immutable evidence records",
      acceptance: "Each signal has source, confidence, status, and audit timestamp"
    },
    {
      id: "task-stakeholder-update",
      stage: "Communicate",
      owner: alert.customerImpact ? "Customer lead" : "Internal comms",
      status: rank >= 3 || alert.customerImpact ? "drafted" : "queued",
      dueAt: windows[2].dueAt,
      action: alert.customerImpact ? "Draft customer-safe update without exposing investigation details" : "Prepare internal status update for leadership channel",
      acceptance: "Message states impact, current mitigation, next update, and unknowns"
    },
    {
      id: "task-handoff",
      stage: "Handoff",
      owner: "Incident commander",
      status: "drafted",
      dueAt: windows[3].dueAt,
      action: "Generate executive handoff with decisions, open risks, and database-backed timeline",
      acceptance: "Handoff can be exported without scanning or reassembling chat history"
    }
  ];
}

function evidenceItems(alertInput) {
  const alert = normalizeAlert(alertInput);
  return alert.signals.map((signal, index) => {
    const confidence = Math.max(15, alert.evidenceConfidence - index * 7);
    const id = `evidence-${String(index + 1).padStart(3, "0")}`;
    return {
      id,
      source: alert.source,
      status: confidence >= 75 ? "corroborated" : confidence >= 55 ? "pending-review" : "weak-signal",
      confidence,
      detail: signal,
      integrityHash: stableId(`${alert.caseId}:${id}:${signal}:${confidence}`)
    };
  });
}

function auditEvents(alertInput) {
  const alert = normalizeAlert(alertInput);
  const windows = responseWindows(alert);
  return [
    {
      at: alert.detectedAt,
      event: "alert_ingested",
      actor: alert.source,
      detail: `${alert.source} generated ${alert.caseId}`
    },
    {
      at: addMinutes(alert.detectedAt, 2),
      event: "case_opened",
      actor: "Incident Zero",
      detail: "Owner map, SLA clock, and evidence ledger created"
    },
    {
      at: addMinutes(alert.detectedAt, Math.min(8, windows[0].dueMinutes)),
      event: "risk_scored",
      actor: alert.owner,
      detail: `Risk score computed as ${riskScore(alert)}/100 from severity, confidence, blast radius, and containment state`
    },
    {
      at: addMinutes(alert.detectedAt, Math.min(18, windows[1].dueMinutes)),
      event: alert.contained ? "containment_verified" : "containment_planned",
      actor: "Platform owner",
      detail: alert.contained ? "Primary risky path is already contained and under watch" : "Containment task is ready with reversible action and evidence requirement"
    },
    {
      at: addMinutes(alert.detectedAt, Math.min(30, windows[2].dueMinutes)),
      event: "handoff_drafted",
      actor: "Incident commander",
      detail: "Executive summary, stakeholder update, and open risks generated from case records"
    }
  ];
}

function stakeholderUpdates(alertInput) {
  const alert = normalizeAlert(alertInput);
  const risk = riskScore(alert);
  const nextWindow = responseWindows(alert)[2].dueAt;
  return [
    {
      audience: "Responder channel",
      tone: "operational",
      message: `${alert.severity.toUpperCase()} ${alert.title}. ${alert.owner} owns triage. Current risk ${risk}/100. Next checkpoint ${nextWindow}.`
    },
    {
      audience: alert.customerImpact ? "Customer-facing lead" : "Business owner",
      tone: alert.customerImpact ? "customer-safe" : "internal",
      message: alert.customerImpact
        ? `We are investigating an issue affecting ${alert.impactedSystem}. Mitigation is ${alert.contained ? "in place" : "in progress"}; next update is scheduled.`
        : `No confirmed customer impact. Tracking ${alert.impactedSystem} with evidence confidence ${alert.evidenceConfidence}%.`
    },
    {
      audience: "Executive handoff",
      tone: "brief",
      message: `${alert.impactedUsers} users or internal actors in scope, ${alert.signals.length} evidence signals, $${alert.revenueAtRiskUsd.toLocaleString("en-US")} estimated exposure.`
    }
  ];
}

function metricCards(alertInput) {
  const alert = normalizeAlert(alertInput);
  const risk = riskScore(alert);
  const tasks = responseTasks(alert);
  const evidence = evidenceItems(alert);
  const records = databaseRecords(alert);
  return [
    { label: "Risk", value: `${risk}/100`, detail: alert.contained ? "contained path discount applied" : "containment still open" },
    { label: "SLA windows", value: String(responseWindows(alert).length), detail: "triage, containment, update, handoff" },
    { label: "Evidence", value: String(evidence.length), detail: `${Math.round(evidence.reduce((sum, item) => sum + item.confidence, 0) / evidence.length)}% avg confidence` },
    { label: "Records", value: String(records.length), detail: "single-table DynamoDB-shaped entities" },
    { label: "Ready tasks", value: String(tasks.filter((task) => task.status === "ready").length), detail: "immediately actionable response work" }
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
  const updates = stakeholderUpdates(alert);

  return [
    dynamoRecord("CASE", alert.caseId, "META", {
      title: alert.title,
      severity: alert.severity,
      owner: alert.owner,
      risk,
      status: alert.contained ? "contained" : "active",
      GSI1PK: `${alert.contained ? "CONTAINED" : "OPEN"}#${alert.severity.toUpperCase()}`,
      GSI1SK: alert.detectedAt,
      GSI2PK: `OWNER#${alert.owner}`,
      GSI2SK: `RISK#${String(100 - risk).padStart(3, "0")}`
    }),
    dynamoRecord("ALERT", alert.caseId, alert.detectedAt, {
      source: alert.source,
      impactedSystem: alert.impactedSystem,
      impactedUsers: alert.impactedUsers,
      customerImpact: alert.customerImpact
    }),
    ...evidence.map((item) => dynamoRecord("EVIDENCE", alert.caseId, item.id, item)),
    ...tasks.map((task) => dynamoRecord("TASK", alert.caseId, task.id, {
      ...task,
      GSI2PK: `OWNER#${task.owner}`,
      GSI2SK: `DUE#${task.dueAt}`
    })),
    ...audits.map((event) => dynamoRecord("AUDIT", alert.caseId, event.at, event)),
    ...updates.map((update, index) => dynamoRecord("UPDATE", alert.caseId, String(index + 1).padStart(2, "0"), update)),
    dynamoRecord("METRIC", alert.caseId, "CURRENT", {
      risk,
      evidenceConfidence: alert.evidenceConfidence,
      revenueAtRiskUsd: alert.revenueAtRiskUsd,
      affectedScope: alert.impactedUsers
    }),
    dynamoRecord("HANDOFF", alert.caseId, "EXECUTIVE", {
      summary: `${alert.severity.toUpperCase()} ${alert.title}: ${risk}/100 risk, ${evidence.length} evidence records, ${tasks.length} response tasks, ${alert.contained ? "contained" : "containment pending"}.`
    })
  ];
}

function architectureQueries(alertInput) {
  const alert = normalizeAlert(alertInput);
  return [
    {
      name: "Incident packet",
      query: `PK = CASE#${alert.caseId}`,
      reason: "Loads case, evidence, tasks, audit, updates, metrics, and handoff in one partition"
    },
    {
      name: "Open severity queue",
      query: `GSI1PK = OPEN#${alert.severity.toUpperCase()}`,
      reason: "Ranks active incidents for command-center triage"
    },
    {
      name: "Owner due work",
      query: `GSI2PK = OWNER#${alert.owner}`,
      reason: "Finds response tasks and accountable handoffs without table scans"
    }
  ];
}

function handoffPacket(alertInput) {
  const alert = normalizeAlert(alertInput);
  const risk = riskScore(alert);
  const windows = responseWindows(alert);
  const evidence = evidenceItems(alert);
  const tasks = responseTasks(alert);
  const nextUpdate = windows.find((window) => window.label === "Stakeholder update") || windows[0];
  const openTasks = tasks.filter((task) => task.status !== "complete");
  const summary = `${alert.severity.toUpperCase()} ${alert.title}: risk ${risk}/100, ${alert.contained ? "contained" : "containment pending"}, ${evidence.length} evidence records, ${openTasks.length} open response tasks.`;
  const markdown = [
    `# ${alert.caseId} Executive Handoff`,
    "",
    "## Executive Summary",
    "",
    summary,
    "",
    "## Current Scope",
    "",
    `- System: ${alert.impactedSystem}`,
    `- Owner: ${alert.owner}`,
    `- Affected scope: ${alert.impactedUsers}`,
    `- Customer impact: ${alert.customerImpact ? "yes" : "no"}`,
    `- Estimated exposure: $${alert.revenueAtRiskUsd.toLocaleString("en-US")}`,
    "",
    "## Evidence",
    "",
    ...evidence.map((item) => `- ${item.status} (${item.confidence}%): ${item.detail}`),
    "",
    "## Open Actions",
    "",
    ...openTasks.map((task) => `- [${task.status}] ${task.owner}: ${task.action}`),
    "",
    "## Next Update",
    "",
    `${nextUpdate.label}: ${nextUpdate.dueAt}`
  ].join("\n");

  return {
    filename: `${alert.caseId.toLowerCase()}-handoff.md`,
    summary,
    nextUpdateAt: nextUpdate.dueAt,
    markdown
  };
}

function storageAdapterPlan(alertInput) {
  const alert = normalizeAlert(alertInput);
  const records = databaseRecords(alert);
  const entityCounts = records.reduce((counts, record) => {
    counts[record.entity] = (counts[record.entity] || 0) + 1;
    return counts;
  }, {});

  return {
    adapter: "local-memory",
    liveAdapterTarget: "aws-dynamodb",
    tableName: DYNAMODB_SCHEMA.tableName,
    recordCount: records.length,
    entityCounts,
    writeStrategy: "Batch write incident packet by PK/SK, then append audit and evidence events as immutable records",
    readStrategy: "Load one incident by PK; use GSI1 for active severity queue and GSI2 for owner due work",
    safety: {
      noCredentialsInCode: true,
      noSecretsStored: true,
      accountOwnerProvisioningRequired: true
    }
  };
}

function buildCase(alertInput) {
  const alert = normalizeAlert(alertInput);
  const risk = riskScore(alert);
  return {
    caseId: alert.caseId,
    alert,
    risk,
    windows: responseWindows(alert),
    metrics: metricCards(alert),
    tasks: responseTasks(alert),
    evidence: evidenceItems(alert),
    audit: auditEvents(alert),
    updates: stakeholderUpdates(alert),
    records: databaseRecords(alert),
    schema: DYNAMODB_SCHEMA,
    architectureQueries: architectureQueries(alert),
    storagePlan: storageAdapterPlan(alert),
    handoff: handoffPacket(alert),
    gates: {
      noSecretsStored: true,
      localPrototypeReady: true,
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
  SCENARIOS,
  architectureQueries,
  auditEvents,
  buildCase,
  databaseRecords,
  evidenceItems,
  handoffPacket,
  metricCards,
  normalizeAlert,
  responseTasks,
  responseWindows,
  riskScore,
  scenarioList,
  severityRank,
  storageAdapterPlan,
  stakeholderUpdates
};
