"use strict";

const { buildCase, scenarioList } = require("./incidentZero");

function clampText(value, maxLength = 280) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function actionValue(action, caseId) {
  return `${caseId}:${action}`.replace(/[^A-Za-z0-9:_-]/g, "_").slice(0, 1900);
}

function mrkdwn(text) {
  return { type: "mrkdwn", text: String(text || "") };
}

function section(text, extra = {}) {
  return { type: "section", text: mrkdwn(text), ...extra };
}

function fields(items) {
  return {
    type: "section",
    fields: items.map((item) => mrkdwn(`*${item.label}*\n${item.value}`)),
  };
}

function divider() {
  return { type: "divider" };
}

function createSlackAgentResponse(input = {}) {
  const incident = buildCase(input);
  const alert = incident.alert;
  const topTasks = incident.tasks.filter((task) => task.status !== "complete").slice(0, 3);
  const topEvidence = incident.evidence.slice(0, 3);
  const handoffSummary = clampText(incident.handoff.summary, 240);

  return {
    response_type: "ephemeral",
    text: `Incident Zero brief for ${incident.caseId}: risk ${incident.risk}/100`,
    blocks: [
      section(`*Incident Zero agent brief*\n${handoffSummary}`),
      fields([
        { label: "Case", value: incident.caseId },
        { label: "Severity", value: alert.severity.toUpperCase() },
        { label: "Risk", value: `${incident.risk}/100` },
        { label: "Owner", value: alert.owner },
        { label: "System", value: alert.impactedSystem },
        { label: "Next update", value: incident.handoff.nextUpdateAt },
      ]),
      divider(),
      section(`*Top actions*\n${topTasks.map((task) => `- ${task.owner}: ${task.action}`).join("\n")}`),
      section(`*Evidence signals*\n${topEvidence.map((item) => `- ${item.status} (${item.confidence}%): ${item.detail}`).join("\n")}`),
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Open handoff" },
            value: actionValue("handoff", incident.caseId),
            action_id: "incident_zero_open_handoff",
          },
          {
            type: "button",
            text: { type: "plain_text", text: "List due tasks" },
            value: actionValue("tasks", incident.caseId),
            action_id: "incident_zero_due_tasks",
          },
          {
            type: "button",
            text: { type: "plain_text", text: "Show evidence" },
            value: actionValue("evidence", incident.caseId),
            action_id: "incident_zero_show_evidence",
          },
        ],
      },
      section("_Public prototype boundary: no workspace credentials, signing secrets, private messages, customer data, or billing records are stored in this repository._"),
    ],
    metadata: {
      caseId: incident.caseId,
      scenarioId: alert.scenarioId,
      noSecretsStored: true,
      accountOwnerGates: [
        "Slack workspace app creation",
        "Slack signing secret",
        "slash command URL",
        "interactivity request URL",
        "Devpost final submission",
      ],
    },
  };
}

function createSlackAppManifest({ publicUrl = "https://example.com" } = {}) {
  const baseUrl = String(publicUrl || "https://example.com").replace(/\/+$/, "");
  return {
    display_information: {
      name: "Incident Zero Agent",
      description: "Incident response briefings, evidence summaries, and executive handoff from deterministic case records.",
      background_color: "#111827",
    },
    features: {
      bot_user: {
        display_name: "Incident Zero",
        always_online: false,
      },
      slash_commands: [
        {
          command: "/incident-zero",
          url: `${baseUrl}/api/slack-agent`,
          description: "Generate an incident response brief",
          usage_hint: "scenario=identity severity=critical",
          should_escape: false,
        },
      ],
    },
    oauth_config: {
      scopes: {
        bot: ["commands", "chat:write"],
      },
    },
    settings: {
      interactivity: {
        is_enabled: true,
        request_url: `${baseUrl}/api/slack-agent`,
      },
      org_deploy_enabled: false,
      socket_mode_enabled: false,
      token_rotation_enabled: false,
    },
  };
}

function parseSlackText(text = "") {
  const input = {};
  for (const part of String(text || "").split(/\s+/)) {
    const [rawKey, ...rawValue] = part.split("=");
    if (!rawKey || rawValue.length === 0) continue;
    const key = rawKey.trim();
    const value = rawValue.join("=").trim();
    if (key === "scenario") input.scenarioId = value;
    if (["severity", "confidence", "users", "contained", "customerImpact"].includes(key)) {
      input[key === "confidence" ? "evidenceConfidence" : key === "users" ? "impactedUsers" : key] = value;
    }
  }
  return input;
}

function createSlackAgentSubmissionPack({ publicUrl = "https://example.com" } = {}) {
  const scenarios = scenarioList();
  const examples = scenarios.map((scenario) => createSlackAgentResponse({ scenarioId: scenario.id }));
  return {
    projectName: "Incident Zero Agent",
    publicUrl,
    manifest: createSlackAppManifest({ publicUrl }),
    slashCommandExamples: [
      "/incident-zero scenario=identity severity=critical",
      "/incident-zero scenario=payments contained=false",
      "/incident-zero scenario=data confidence=92 users=18",
    ],
    demoScript: [
      "Open the public cockpit and show the deterministic incident case.",
      "Run the Slack command example in the sandbox workspace.",
      "Point out the agent brief, top actions, evidence signals, and handoff buttons.",
      "Open the executive handoff and explain that it is generated from case records, not copied from chat.",
      "Close with the security boundary: no credentials or private workspace data are stored in the repository.",
    ],
    architectureNotes: [
      "The slash command posts to /api/slack-agent.",
      "The Vercel handler calls the shared API core.",
      "The API core rebuilds a deterministic incident case from request inputs.",
      "The Slack response renders Block Kit fields, action buttons, evidence, and handoff metadata.",
      "Live workspace configuration stays outside the repository.",
    ],
    examples,
    nextExternalGates: [
      "Create Slack app from the generated manifest.",
      "Set slash command and interactivity URLs to the deployed /api/slack-agent endpoint.",
      "Add the app to a Slack sandbox workspace.",
      "Record a short demo video under three minutes.",
      "Submit the public app URL, source repository, demo, architecture diagram, and Slack sandbox URL on the challenge platform.",
    ],
  };
}

module.exports = {
  createSlackAgentResponse,
  createSlackAgentSubmissionPack,
  createSlackAppManifest,
  parseSlackText,
};
