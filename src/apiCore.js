"use strict";

const { buildCase, DYNAMODB_SCHEMA, scenarioList } = require("./incidentZero");
const { createStoragePreview } = require("./storage");

const MAX_BODY_BYTES = 32 * 1024;

function jsonBody(body, status = 200) {
  return {
    status,
    type: "application/json; charset=utf-8",
    body: JSON.stringify(body, null, 2)
  };
}

function textBody(body, type = "text/plain; charset=utf-8", status = 200) {
  return { status, type, body };
}

function queryToCaseInput(searchParams) {
  return {
    scenarioId: searchParams.get("scenario") || undefined,
    severity: searchParams.get("severity") || undefined,
    evidenceConfidence: searchParams.get("confidence") || undefined,
    impactedUsers: searchParams.get("users") || undefined,
    customerImpact: searchParams.get("customerImpact") || undefined,
    contained: searchParams.get("contained") || undefined
  };
}

function parseJsonText(text) {
  if (!text || !text.trim()) return {};
  if (Buffer.byteLength(text) > MAX_BODY_BYTES) {
    throw new Error("Request body too large");
  }
  return JSON.parse(text);
}

function normalizeEndpoint(pathname) {
  if (pathname.startsWith("/api/")) return pathname.slice("/api/".length);
  return pathname.replace(/^\/+/, "");
}

function handleApiRequest({ method = "GET", pathname = "", searchParams = new URLSearchParams(), bodyText = "" }) {
  const endpoint = normalizeEndpoint(pathname);

  if (endpoint === "case" && method === "GET") {
    return jsonBody(buildCase(queryToCaseInput(searchParams)));
  }

  if (endpoint === "case" && method === "POST") {
    return jsonBody(buildCase(parseJsonText(bodyText)));
  }

  if (endpoint === "scenarios") {
    return jsonBody({ scenarios: scenarioList() });
  }

  if (endpoint === "handoff" && method === "GET") {
    return textBody(buildCase(queryToCaseInput(searchParams)).handoff.markdown, "text/markdown; charset=utf-8");
  }

  if (endpoint === "handoff" && method === "POST") {
    return textBody(buildCase(parseJsonText(bodyText)).handoff.markdown, "text/markdown; charset=utf-8");
  }

  if (endpoint === "storage-preview" && method === "GET") {
    return jsonBody(createStoragePreview(queryToCaseInput(searchParams)));
  }

  if (endpoint === "storage-preview" && method === "POST") {
    return jsonBody(createStoragePreview(parseJsonText(bodyText)));
  }

  if (endpoint === "schema") {
    return jsonBody(DYNAMODB_SCHEMA);
  }

  if (endpoint === "health") {
    return jsonBody({
      ok: true,
      noSecretsStored: true,
      localOnly: true
    });
  }

  return jsonBody({ ok: false, error: "API route not found" }, 404);
}

module.exports = {
  MAX_BODY_BYTES,
  handleApiRequest,
  parseJsonText,
  queryToCaseInput
};
