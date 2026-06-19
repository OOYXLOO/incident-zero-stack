"use strict";

const { DYNAMODB_SCHEMA } = require("./incidentZero");
const { dynamoReadinessFromEnv } = require("./dynamoAdapter");

function buildIamPolicy(tableArn = "arn:aws:dynamodb:<region>:<account-id>:table/IncidentZeroCases") {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:BatchWriteItem",
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query"
        ],
        Resource: [
          tableArn,
          `${tableArn}/index/*`
        ]
      }
    ]
  };
}

function cloudReadiness(env = process.env) {
  const dynamo = dynamoReadinessFromEnv(env);
  const publicBaseUrl = env.INCIDENT_ZERO_PUBLIC_URL || "";
  const deployment = {
    vercelProjectUrlConfigured: Boolean(publicBaseUrl),
    publicBaseUrlConfigured: Boolean(publicBaseUrl),
    expectedPaths: [
      "/",
      "/api/health",
      "/api/scenarios",
      "/api/case",
      "/api/schema",
      "/api/handoff",
      "/api/storage-preview"
    ]
  };

  const missingAccountOwnerGates = [];
  if (!deployment.publicBaseUrlConfigured) missingAccountOwnerGates.push("INCIDENT_ZERO_PUBLIC_URL");
  if (dynamo.adapter !== "dynamodb") {
    missingAccountOwnerGates.push("INCIDENT_ZERO_STORAGE=dynamodb");
    missingAccountOwnerGates.push("INCIDENT_ZERO_DYNAMODB_TABLE");
    missingAccountOwnerGates.push("AWS_REGION");
  } else if (!dynamo.liveWriteEnabled) {
    missingAccountOwnerGates.push(...dynamo.missing);
  }

  return {
    okForLocalReview: true,
    okForPublicCloudClaim: deployment.publicBaseUrlConfigured && dynamo.liveWriteEnabled,
    database: {
      tableName: DYNAMODB_SCHEMA.tableName,
      adapter: dynamo.adapter,
      liveWriteEnabled: dynamo.liveWriteEnabled,
      tableNameConfigured: dynamo.tableNameConfigured,
      regionConfigured: dynamo.regionConfigured,
      requiredEnv: dynamo.requiredEnv,
      credentialPolicy: dynamo.credentialPolicy
    },
    deployment,
    missingAccountOwnerGates: [...new Set(missingAccountOwnerGates)],
    iamPolicyTemplate: buildIamPolicy(),
    safety: {
      returnsSecretValues: false,
      storesCredentials: false,
      accountOwnerActionRequired: missingAccountOwnerGates.length > 0
    }
  };
}

module.exports = {
  buildIamPolicy,
  cloudReadiness
};
