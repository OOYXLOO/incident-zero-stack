"use strict";

const state = {
  currentScenario: "identity",
  currentCase: null
};

function $(id) {
  return document.getElementById(id);
}

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function money(value) {
  return `$${Number(value || 0).toLocaleString("en-US")}`;
}

function shortDate(iso) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(iso));
}

function setText(id, value) {
  $(id).textContent = value;
}

function replace(id, children) {
  $(id).replaceChildren(...children);
}

function readForm() {
  return {
    scenarioId: state.currentScenario,
    title: $("title").value,
    severity: $("severity").value,
    evidenceConfidence: Number($("confidence").value),
    impactedUsers: Number($("users").value),
    revenueAtRiskUsd: Number($("revenue").value),
    customerImpact: $("customer-impact").checked,
    contained: $("contained").checked,
    signals: $("signals").value
  };
}

function writeForm(data) {
  const alert = data.alert;
  state.currentScenario = alert.scenarioId;
  $("title").value = alert.title;
  $("severity").value = alert.severity;
  $("confidence").value = alert.evidenceConfidence;
  $("confidence-label").textContent = `${alert.evidenceConfidence}%`;
  $("users").value = alert.impactedUsers;
  $("revenue").value = alert.revenueAtRiskUsd;
  $("customer-impact").checked = alert.customerImpact;
  $("contained").checked = alert.contained;
  $("signals").value = alert.signals.join("\n");
}

async function fetchCase(payload) {
  const response = await fetch("/api/case", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload || { scenarioId: state.currentScenario })
  });
  if (!response.ok) throw new Error(`Case request failed: ${response.status}`);
  return response.json();
}

async function fetchCloudReadiness() {
  const response = await fetch("/api/cloud-readiness");
  if (!response.ok) throw new Error(`Cloud readiness request failed: ${response.status}`);
  return response.json();
}

async function loadScenario(scenarioId) {
  state.currentScenario = scenarioId;
  const data = await fetchCase({ scenarioId });
  state.currentCase = data;
  writeForm(data);
  render(data);
  updateScenarioButtons();
}

function updateScenarioButtons() {
  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.classList.toggle("active", button.dataset.scenario === state.currentScenario);
  });
}

function renderScenarioButtons(scenarios) {
  const buttons = scenarios.map((scenario) => {
    const button = node("button", "scenario-button", "");
    button.type = "button";
    button.dataset.scenario = scenario.id;
    button.append(node("strong", "", scenario.name));
    button.append(node("span", "", scenario.severity));
    button.addEventListener("click", () => loadScenario(scenario.id));
    return button;
  });
  replace("scenario-buttons", buttons);
  updateScenarioButtons();
}

function renderMetrics(metrics) {
  replace("metric-grid", metrics.map((metric) => {
    const item = node("article", "metric-card");
    item.append(node("span", "", metric.label));
    item.append(node("strong", "", metric.value));
    item.append(node("small", "", metric.detail));
    return item;
  }));
}

function renderTasks(tasks) {
  replace("tasks", tasks.map((task) => {
    const item = node("article", `task-card ${task.status}`);
    const top = node("div", "task-top");
    top.append(node("span", "tag", task.stage));
    top.append(node("span", `status ${task.status}`, task.status));
    item.append(top);
    item.append(node("strong", "", task.owner));
    item.append(node("p", "", task.action));
    item.append(node("small", "", `Due ${shortDate(task.dueAt)} - ${task.acceptance}`));
    return item;
  }));
  setText("ready-count", `${tasks.filter((task) => task.status === "ready").length} ready`);
}

function renderWindows(windows) {
  replace("windows", windows.map((window) => {
    const item = node("div", "window-row");
    item.append(node("strong", "", window.label));
    item.append(node("span", "", `${window.dueMinutes} min`));
    item.append(node("small", "", shortDate(window.dueAt)));
    return item;
  }));
}

function renderRecords(records) {
  replace("records", records.slice(0, 12).map((record) => {
    const item = node("article", "record-row");
    item.append(node("strong", "", record.entity));
    item.append(node("code", "", `${record.PK} / ${record.SK}`));
    return item;
  }));
  setText("record-count", `${records.length} records`);
}

function renderStoragePlan(plan) {
  const rows = [
    ["Adapter", plan.adapter],
    ["Live target", plan.liveAdapterTarget],
    ["Table", plan.tableName],
    ["Records", String(plan.recordCount)],
    ["Writes", plan.writeStrategy],
    ["Reads", plan.readStrategy]
  ];
  replace("storage-plan", rows.map(([label, value]) => {
    const row = node("div", "storage-row");
    row.append(node("strong", "", label));
    row.append(node("span", "", value));
    return row;
  }));
}

function renderEvidence(items) {
  replace("evidence", items.map((item) => {
    const row = node("article", "evidence-row");
    const header = node("div", "evidence-header");
    header.append(node("strong", "", `${item.confidence}%`));
    header.append(node("span", "tag", item.status));
    row.append(header);
    row.append(node("p", "", item.detail));
    row.append(node("code", "", item.integrityHash));
    return row;
  }));
}

function renderQueries(queries) {
  replace("queries", queries.map((query) => {
    const row = node("article", "query-row");
    row.append(node("strong", "", query.name));
    row.append(node("code", "", query.query));
    row.append(node("small", "", query.reason));
    return row;
  }));
}

function renderUpdates(updates) {
  replace("updates", updates.map((update) => {
    const row = node("article", "update-row");
    row.append(node("span", "tag", update.audience));
    row.append(node("p", "", update.message));
    return row;
  }));
}

function renderAudit(events) {
  replace("audit", events.map((event) => {
    const item = node("li", "");
    item.append(node("time", "", shortDate(event.at)));
    item.append(node("strong", "", event.event));
    item.append(node("p", "", event.detail));
    return item;
  }));
}

function renderGates(gates) {
  const rows = [
    ["No secrets stored", gates.noSecretsStored, true],
    ["Local prototype ready", gates.localPrototypeReady, true],
    ["Live AWS database claimed", gates.liveAwsDatabaseClaimed, false],
    ["Vercel deployment claimed", gates.vercelDeploymentClaimed, false],
    ["AWS screenshot required", gates.awsScreenshotRequired, false],
    ["Final submission required", gates.devpostFinalSubmitRequired, false]
  ];
  replace("gates", rows.map(([label, value, expected]) => {
    const ok = value === expected;
    const row = node("div", `gate-row ${ok ? "ok" : "blocked"}`);
    row.append(node("strong", "", label));
    row.append(node("span", "", String(value)));
    return row;
  }));
}

function renderCloudReadiness(readiness) {
  const rows = [
    ["Local review", readiness.okForLocalReview ? "ready" : "blocked"],
    ["Cloud claim", readiness.okForPublicCloudClaim ? "ready" : "blocked"],
    ["Adapter", readiness.database.adapter],
    ["DynamoDB table", readiness.database.tableNameConfigured ? "configured" : "missing"],
    ["AWS region", readiness.database.regionConfigured ? "configured" : "missing"],
    ["Public URL", readiness.deployment.publicBaseUrlConfigured ? "configured" : "missing"]
  ];
  replace("cloud-readiness", rows.map(([label, value]) => {
    const isOk = String(value).includes("ready") || String(value).includes("configured") || value === "local";
    const row = node("div", `readiness-row ${isOk ? "ok" : "blocked"}`);
    row.append(node("strong", "", label));
    row.append(node("span", "", value));
    return row;
  }));
}

function renderHandoff(handoff) {
  const lines = handoff.markdown.split("\n").slice(0, 16).join("\n");
  $("handoff").textContent = lines;
}

function render(data) {
  const alert = data.alert;
  const stateLabel = alert.contained ? "Contained" : "Active";
  setText("case-title", alert.title);
  setText("case-id", data.caseId);
  setText("case-severity", alert.severity.toUpperCase());
  setText("case-state", stateLabel);
  setText("risk-score", `${data.risk}`);
  setText("risk-detail", `${alert.owner} owns ${alert.impactedSystem}`);
  setText("case-summary", `${alert.impactedUsers.toLocaleString("en-US")} affected scope, ${money(alert.revenueAtRiskUsd)} exposure, ${alert.signals.length} evidence signals.`);
  $("risk-ring").style.setProperty("--risk", `${data.risk}%`);
  renderMetrics(data.metrics);
  renderTasks(data.tasks);
  renderWindows(data.windows);
  renderRecords(data.records);
  renderStoragePlan(data.storagePlan);
  renderEvidence(data.evidence);
  renderQueries(data.architectureQueries);
  renderUpdates(data.updates);
  renderHandoff(data.handoff);
  renderAudit(data.audit);
  renderGates(data.gates);
}

function downloadJson() {
  if (!state.currentCase) return;
  const blob = new Blob([JSON.stringify(state.currentCase, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${state.currentCase.caseId.toLowerCase()}-incident-zero.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function applyPayload(payload) {
  const updated = await fetchCase(payload);
  state.currentCase = updated;
  writeForm(updated);
  render(updated);
  updateScenarioButtons();
}

async function runDemo() {
  const button = $("run-demo");
  button.disabled = true;
  button.textContent = "Running";
  try {
    await applyPayload({ scenarioId: "identity", contained: false, evidenceConfidence: 58, impactedUsers: 12, revenueAtRiskUsd: 3200 });
    await wait(650);
    await applyPayload({ scenarioId: "identity", contained: false, evidenceConfidence: 89, impactedUsers: 48, revenueAtRiskUsd: 12400, customerImpact: true });
    await wait(650);
    await applyPayload({ scenarioId: "identity", contained: true, evidenceConfidence: 94, impactedUsers: 48, revenueAtRiskUsd: 12400, customerImpact: true });
  } finally {
    button.disabled = false;
    button.textContent = "Run demo";
  }
}

async function main() {
  const scenarioResponse = await fetch("/api/scenarios");
  const scenarioData = await scenarioResponse.json();
  renderScenarioButtons(scenarioData.scenarios);
  const data = await fetchCase({ scenarioId: state.currentScenario });
  state.currentCase = data;
  writeForm(data);
  render(data);
  renderCloudReadiness(await fetchCloudReadiness());

  $("confidence").addEventListener("input", () => {
    $("confidence-label").textContent = `${$("confidence").value}%`;
  });

  $("rebuild").addEventListener("click", async () => {
    await applyPayload(readForm());
  });

  $("run-demo").addEventListener("click", runDemo);

  $("export-json").addEventListener("click", downloadJson);
}

main().catch((error) => {
  setText("case-title", "Unable to load local case");
  console.error(error);
});
