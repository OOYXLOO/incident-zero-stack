"use strict";

const { buildCase, DYNAMODB_SCHEMA } = require("./incidentZero");

function recordKey(record) {
  return `${record.PK}\u0000${record.SK}`;
}

function findCredentialLikeValues(value, path = "$") {
  const hits = [];
  if (value === null || value === undefined) return hits;

  if (typeof value === "string") {
    const patterns = [
      /AKIA[0-9A-Z]{16}/,
      /ASIA[0-9A-Z]{16}/,
      /aws_secret_access_key/i,
      /vercel[_-]?token/i,
      /-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----/
    ];
    if (patterns.some((pattern) => pattern.test(value))) hits.push(path);
    return hits;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      hits.push(...findCredentialLikeValues(item, `${path}[${index}]`));
    });
    return hits;
  }

  if (typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => {
      hits.push(...findCredentialLikeValues(item, `${path}.${key}`));
    });
  }

  return hits;
}

class LocalIncidentStore {
  constructor() {
    this.records = new Map();
  }

  putCase(caseData) {
    const secretPaths = findCredentialLikeValues(caseData.records);
    if (secretPaths.length) {
      throw new Error(`Refusing to persist credential-like values at ${secretPaths.join(", ")}`);
    }

    caseData.records.forEach((record) => {
      this.records.set(recordKey(record), { ...record });
    });

    return {
      tableName: DYNAMODB_SCHEMA.tableName,
      written: caseData.records.length,
      caseId: caseData.caseId
    };
  }

  getCaseRecords(caseId) {
    const prefix = `CASE#${caseId}\u0000`;
    return [...this.records.entries()]
      .filter(([key]) => key.startsWith(prefix))
      .map(([, record]) => ({ ...record }))
      .sort((left, right) => left.SK.localeCompare(right.SK));
  }
}

function createStoragePreview(alertInput) {
  const caseData = buildCase(alertInput);
  const store = new LocalIncidentStore();
  const write = store.putCase(caseData);
  return {
    write,
    storagePlan: caseData.storagePlan,
    sampleRecords: store.getCaseRecords(caseData.caseId).slice(0, 8)
  };
}

module.exports = {
  LocalIncidentStore,
  createStoragePreview,
  findCredentialLikeValues
};
