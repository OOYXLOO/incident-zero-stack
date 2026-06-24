import { createRequire } from "node:module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const require = createRequire(import.meta.url);
const { callIncidentTool, createMcpToolDefinitions } = require("../src/mcpTools.js");

const incidentInputSchema = {
  scenarioId: z.enum(["identity", "payments", "data"]).optional().describe("Incident scenario to rebuild."),
  severity: z.enum(["low", "medium", "high", "critical"]).optional().describe("Override incident severity."),
  confidence: z.string().optional().describe("Evidence confidence percentage."),
  users: z.string().optional().describe("Impacted user count."),
  contained: z.enum(["true", "false"]).optional().describe("Whether containment is complete."),
  customerImpact: z.enum(["true", "false"]).optional().describe("Whether customers are impacted.")
};

const server = new McpServer({
  name: "incident-zero-stack",
  version: "0.3.0"
});

for (const tool of createMcpToolDefinitions()) {
  server.registerTool(tool.name, {
    title: tool.title,
    description: tool.description,
    inputSchema: incidentInputSchema
  }, async (args) => callIncidentTool(tool.name, args));
}

const transport = new StdioServerTransport();
await server.connect(transport);
