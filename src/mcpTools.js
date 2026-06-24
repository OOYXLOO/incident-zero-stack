"use strict";

const { buildCase } = require("./incidentZero");
const { createStoragePreview } = require("./storage");

const INCIDENT_INPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    scenarioId: {
      type: "string",
      enum: ["identity", "payments", "data"],
      description: "Incident scenario to rebuild."
    },
    severity: {
      type: "string",
      enum: ["low", "medium", "high", "critical"],
      description: "Override incident severity."
    },
    confidence: {
      type: "string",
      description: "Evidence confidence percentage."
    },
    users: {
      type: "string",
      description: "Impacted user count."
    },
    contained: {
      type: "string",
      enum: ["true", "false"],
      description: "Whether containment is complete."
    },
    customerImpact: {
      type: "string",
      enum: ["true", "false"],
      description: "Whether customers are impacted."
    }
  }
};

function normalizeMcpInput(input = {}) {
  return {
    scenarioId: input.scenarioId,
    severity: input.severity,
    evidenceConfidence: input.confidence ?? input.evidenceConfidence,
    impactedUsers: input.users ?? input.impactedUsers,
    contained: input.contained,
    customerImpact: input.customerImpact
  };
}

function textResult(structuredContent) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(structuredContent, null, 2)
      }
    ],
    structuredContent
  };
}

function createMcpToolDefinitions() {
  return [
    {
      name: "incident_zero_brief",
      title: "Incident Zero Brief",
      description: "Build a compact incident response brief with risk, owner, actions, evidence, and handoff timing.",
      inputSchema: INCIDENT_INPUT_SCHEMA
    },
    {
      name: "incident_zero_handoff",
      title: "Incident Zero Handoff",
      description: "Generate the executive handoff markdown for a selected incident scenario.",
      inputSchema: INCIDENT_INPUT_SCHEMA
    },
    {
      name: "incident_zero_storage_preview",
      title: "Incident Zero Storage Preview",
      description: "Return DynamoDB-shaped storage records and access-pattern metadata for a selected incident scenario.",
      inputSchema: INCIDENT_INPUT_SCHEMA
    }
  ];
}

function briefForInput(input) {
  const incident = buildCase(normalizeMcpInput(input));
  return {
    caseId: incident.caseId,
    scenarioId: incident.alert.scenarioId,
    title: incident.alert.title,
    severity: incident.alert.severity,
    risk: incident.risk,
    owner: incident.alert.owner,
    impactedSystem: incident.alert.impactedSystem,
    nextUpdateAt: incident.handoff.nextUpdateAt,
    topActions: incident.tasks.filter((task) => task.status !== "complete").slice(0, 4).map((task) => ({
      owner: task.owner,
      action: task.action,
      dueAt: task.dueAt,
      status: task.status
    })),
    evidenceSignals: incident.evidence.slice(0, 4).map((item) => ({
      status: item.status,
      confidence: item.confidence,
      detail: item.detail
    })),
    handoffSummary: incident.handoff.summary,
    noSecretsStored: incident.gates.noSecretsStored
  };
}

function callIncidentTool(name, input = {}) {
  if (name === "incident_zero_brief") {
    return textResult(briefForInput(input));
  }

  if (name === "incident_zero_handoff") {
    const incident = buildCase(normalizeMcpInput(input));
    return {
      content: [
        {
          type: "text",
          text: incident.handoff.markdown
        }
      ],
      structuredContent: {
        caseId: incident.caseId,
        scenarioId: incident.alert.scenarioId,
        filename: incident.handoff.filename,
        markdown: incident.handoff.markdown,
        noSecretsStored: incident.gates.noSecretsStored
      }
    };
  }

  if (name === "incident_zero_storage_preview") {
    return textResult(createStoragePreview(normalizeMcpInput(input)));
  }

  throw new Error(`Unknown MCP tool: ${name}`);
}

module.exports = {
  callIncidentTool,
  createMcpToolDefinitions,
  normalizeMcpInput
};
