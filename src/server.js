"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const { buildCase, DYNAMODB_SCHEMA } = require("./incidentZero");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const PORT = Number(process.env.PORT || 8794);

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function send(response, status, body, type = "text/plain; charset=utf-8") {
  response.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store"
  });
  response.end(body);
}

function safePublicPath(urlPath) {
  const requested = urlPath === "/" ? "/index.html" : urlPath;
  const resolved = path.resolve(PUBLIC_DIR, "." + requested);
  if (!resolved.startsWith(PUBLIC_DIR)) return null;
  return resolved;
}

function handleRequest(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || "127.0.0.1"}`);

  if (url.pathname === "/api/case") {
    send(response, 200, JSON.stringify(buildCase(), null, 2), "application/json; charset=utf-8");
    return;
  }

  if (url.pathname === "/api/schema") {
    send(response, 200, JSON.stringify(DYNAMODB_SCHEMA, null, 2), "application/json; charset=utf-8");
    return;
  }

  if (url.pathname === "/api/health") {
    send(response, 200, JSON.stringify({ ok: true, noSecretsStored: true }), "application/json; charset=utf-8");
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
  http.createServer(handleRequest).listen(PORT, "127.0.0.1", () => {
    console.log(`Incident Zero Stack listening on http://127.0.0.1:${PORT}/`);
  });
}

module.exports = { handleRequest, safePublicPath };
