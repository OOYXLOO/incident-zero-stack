"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const { buildCase, DYNAMODB_SCHEMA, scenarioList } = require("./incidentZero");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const PORT = Number(process.env.PORT || 8794);
const MAX_BODY_BYTES = 32 * 1024;

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png"
};

function send(response, status, body, type = "text/plain; charset=utf-8") {
  response.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store"
  });
  response.end(body);
}

function sendJson(response, status, body) {
  send(response, status, JSON.stringify(body, null, 2), "application/json; charset=utf-8");
}

function safePublicPath(urlPath) {
  const requested = urlPath === "/" ? "/index.html" : urlPath;
  const resolved = path.resolve(PUBLIC_DIR, "." + requested);
  if (!resolved.startsWith(PUBLIC_DIR)) return null;
  return resolved;
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function queryToCaseInput(url) {
  return {
    scenarioId: url.searchParams.get("scenario") || undefined,
    severity: url.searchParams.get("severity") || undefined,
    evidenceConfidence: url.searchParams.get("confidence") || undefined,
    impactedUsers: url.searchParams.get("users") || undefined,
    customerImpact: url.searchParams.get("customerImpact") || undefined,
    contained: url.searchParams.get("contained") || undefined
  };
}

async function handleRequest(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || "127.0.0.1"}`);

  if (url.pathname === "/api/case" && request.method === "GET") {
    sendJson(response, 200, buildCase(queryToCaseInput(url)));
    return;
  }

  if (url.pathname === "/api/case" && request.method === "POST") {
    try {
      sendJson(response, 200, buildCase(await readJsonBody(request)));
    } catch (error) {
      sendJson(response, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (url.pathname === "/api/scenarios") {
    sendJson(response, 200, { scenarios: scenarioList() });
    return;
  }

  if (url.pathname === "/api/schema") {
    sendJson(response, 200, DYNAMODB_SCHEMA);
    return;
  }

  if (url.pathname === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      noSecretsStored: true,
      localOnly: true
    });
    return;
  }

  const filePath = safePublicPath(url.pathname);
  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    send(response, 404, "Not found");
    return;
  }

  const type = CONTENT_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
  send(response, 200, fs.readFileSync(filePath), type);
}

if (require.main === module) {
  http.createServer((request, response) => {
    handleRequest(request, response).catch((error) => {
      sendJson(response, 500, { ok: false, error: error.message });
    });
  }).listen(PORT, "127.0.0.1", () => {
    console.log(`Incident Zero Stack listening on http://127.0.0.1:${PORT}/`);
  });
}

module.exports = { handleRequest, safePublicPath };
