"use strict";

const { DYNAMODB_SCHEMA } = require("./incidentZero");

function assertSafeTableName(tableName) {
  const value = String(tableName || "").trim();
  if (!/^[A-Za-z0-9_.-]{3,255}$/.test(value)) {
    throw new Error("DynamoDB table name must be 3-255 chars: letters, numbers, underscore, dash, or dot");
  }
  return value;
}

function buildPutRequests(records, tableName = DYNAMODB_SCHEMA.tableName) {
  const safeTableName = assertSafeTableName(tableName);
  return records.map((record) => ({
    TableName: safeTableName,
    Item: { ...record },
    ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
  }));
}

function buildBatchWriteChunks(records, tableName = DYNAMODB_SCHEMA.tableName) {
  const safeTableName = assertSafeTableName(tableName);
  const chunks = [];
  for (let index = 0; index < records.length; index += 25) {
    chunks.push({
      RequestItems: {
        [safeTableName]: records.slice(index, index + 25).map((record) => ({
          PutRequest: {
            Item: { ...record }
          }
        }))
      }
    });
  }
  return chunks;
}

async function writeCaseWithDocumentClient(documentClient, caseData, options = {}) {
  if (!documentClient || typeof documentClient.send !== "function") {
    throw new Error("A DynamoDB document client with send(command) is required");
  }
  const tableName = assertSafeTableName(options.tableName || process.env.INCIDENT_ZERO_DYNAMODB_TABLE || DYNAMODB_SCHEMA.tableName);
  const commandFactory = options.commandFactory;
  if (typeof commandFactory !== "function") {
    throw new Error("commandFactory is required so this adapter stays SDK-version neutral in local tests");
  }

  const chunks = buildBatchWriteChunks(caseData.records, tableName);
  const results = [];
  for (const chunk of chunks) {
    results.push(await documentClient.send(commandFactory(chunk)));
  }
  return {
    tableName,
    caseId: caseData.caseId,
    chunks: chunks.length,
    written: caseData.records.length,
    results
  };
}

function dynamoReadinessFromEnv(env = process.env) {
  const tableName = env.INCIDENT_ZERO_DYNAMODB_TABLE || "";
  const region = env.AWS_REGION || env.AWS_DEFAULT_REGION || "";
  const storage = env.INCIDENT_ZERO_STORAGE || "local";
  const wantsDynamo = storage === "dynamodb";
  const missing = [];

  if (wantsDynamo && !tableName) missing.push("INCIDENT_ZERO_DYNAMODB_TABLE");
  if (wantsDynamo && !region) missing.push("AWS_REGION");

  return {
    adapter: wantsDynamo ? "dynamodb" : "local",
    liveWriteEnabled: wantsDynamo && missing.length === 0,
    tableNameConfigured: Boolean(tableName),
    regionConfigured: Boolean(region),
    missing,
    requiredEnv: [
      "INCIDENT_ZERO_STORAGE=dynamodb",
      "INCIDENT_ZERO_DYNAMODB_TABLE",
      "AWS_REGION"
    ],
    credentialPolicy: "Use Vercel environment variables or account-owner AWS configuration; do not commit credentials."
  };
}

module.exports = {
  assertSafeTableName,
  buildBatchWriteChunks,
  buildPutRequests,
  dynamoReadinessFromEnv,
  writeCaseWithDocumentClient
};
