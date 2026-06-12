"use strict";

function text(id, value) {
  document.getElementById(id).textContent = value;
}

function element(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
}

function renderList(id, values) {
  const root = document.getElementById(id);
  root.replaceChildren();
  values.forEach((value) => root.appendChild(element("li", "", value)));
}

function renderTasks(tasks) {
  const root = document.getElementById("tasks");
  root.replaceChildren();
  tasks.forEach((task) => {
    const wrapper = element("div", "task");
    wrapper.append(element("span", `pill ${task.status}`, task.status));
    wrapper.append(element("strong", "", task.owner));
    wrapper.append(element("span", "", task.action));
    root.appendChild(wrapper);
  });
}

function renderRecords(records) {
  const root = document.getElementById("records");
  root.replaceChildren();
  records.slice(0, 7).forEach((record) => {
    root.appendChild(element("div", "record", `${record.PK} / ${record.SK} / ${record.entity}`));
  });
}

function renderAudit(events) {
  const root = document.getElementById("audit");
  root.replaceChildren();
  events.forEach((event) => {
    const item = element("li", "");
    item.append(element("div", "time", event.at));
    item.append(element("strong", "", event.event));
    item.append(element("div", "", event.detail));
    root.appendChild(item);
  });
}

function renderGates(gates) {
  const rows = [
    ["No secrets stored", gates.noSecretsStored, true],
    ["Live AWS database claimed", gates.liveAwsDatabaseClaimed, false],
    ["Vercel deployment claimed", gates.vercelDeploymentClaimed, false],
    ["AWS screenshot required", gates.awsScreenshotRequired, false],
    ["Devpost final submit required", gates.devpostFinalSubmitRequired, false]
  ];
  const root = document.getElementById("gates");
  root.replaceChildren();
  rows.forEach(([label, value, expected]) => {
    const ok = value === expected;
    root.appendChild(element("div", `gate ${ok ? "good" : "blocked"}`, `${label}: ${value}`));
  });
}

async function main() {
  const response = await fetch("/api/case");
  const data = await response.json();
  text("case-title", data.alert.title);
  text("severity", data.alert.severity.toUpperCase());
  text("risk", `${data.risk}/100`);
  text("system", data.alert.impactedSystem);
  renderList("signals", data.alert.signals);
  renderTasks(data.tasks);
  renderRecords(data.records);
  renderAudit(data.audit);
  renderGates(data.gates);
}

main().catch((error) => {
  text("case-title", "Unable to load local case");
  console.error(error);
});
