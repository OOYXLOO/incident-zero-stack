"use strict";

const { buildCase } = require("../src/incidentZero");
const { dynamoReadinessFromEnv, writeCaseWithDocumentClient } = require("../src/dynamoAdapter");

function requireLiveWriteApproval(env = process.env) {
  if (env.INCIDENT_ZERO_ALLOW_LIVE_WRITE !== "1") {
    throw new Error("Refusing live DynamoDB write. Set INCIDENT_ZERO_ALLOW_LIVE_WRITE=1 only during an account-owner approved proof run.");
  }
}

function loadAwsSdk() {
  try {
    const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
    const { DynamoDBDocumentClient, BatchWriteCommand } = require("@aws-sdk/lib-dynamodb");
    return { DynamoDBClient, DynamoDBDocumentClient, BatchWriteCommand };
  } catch (error) {
    throw new Error("AWS SDK packages are missing. Run npm install or npm ci before live proof verification.");
  }
}

function redact(value) {
  if (!value) return "";
  const text = String(value);
  if (text.length <= 4) return "****";
  return `${text.slice(0, 2)}****${text.slice(-2)}`;
}

async function main() {
  requireLiveWriteApproval();

  const readiness = dynamoReadinessFromEnv(process.env);
  if (!readiness.liveWriteEnabled) {
    throw new Error(`DynamoDB live write is not ready. Missing: ${readiness.missing.join(", ") || "unknown"}`);
  }

  const { DynamoDBClient, DynamoDBDocumentClient, BatchWriteCommand } = loadAwsSdk();
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  const tableName = process.env.INCIDENT_ZERO_DYNAMODB_TABLE;
  const scenarioId = process.env.INCIDENT_ZERO_PROOF_SCENARIO || "identity";
  const caseData = buildCase({ scenarioId });

  const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region }), {
    marshallOptions: {
      removeUndefinedValues: true
    }
  });

  const result = await writeCaseWithDocumentClient(client, caseData, {
    tableName,
    commandFactory: (input) => new BatchWriteCommand(input)
  });

  const proof = {
    ok: true,
    tableName,
    region,
    caseId: result.caseId,
    recordsWritten: result.written,
    chunks: result.chunks,
    storageMode: process.env.INCIDENT_ZERO_STORAGE,
    publicUrlConfigured: Boolean(process.env.INCIDENT_ZERO_PUBLIC_URL),
    accessKeyIdHint: redact(process.env.AWS_ACCESS_KEY_ID)
  };

  console.log(JSON.stringify(proof, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  loadAwsSdk,
  redact,
  requireLiveWriteApproval
};
