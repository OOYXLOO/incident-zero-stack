"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const { handleApiRequest } = require("./apiCore");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const PORT = Number(process.env.PORT || 8794);

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

function sendHead(response, status, type = "text/plain; charset=utf-8") {
  response.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store"
  });
  response.end("");
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

function readBodyText(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      resolve(body);
    });
    request.on("error", reject);
  });
}

async function handleRequest(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || "127.0.0.1"}`);

  if (url.pathname.startsWith("/api/")) {
    try {
      const method = request.method || "GET";
      const result = handleApiRequest({
        method: method === "HEAD" ? "GET" : method,
        pathname: url.pathname,
        searchParams: url.searchParams,
        bodyText: await readBodyText(request),
        contentType: request.headers["content-type"] || ""
      });
      if (method === "HEAD") {
        sendHead(response, result.status, result.type);
        return;
      }
      send(response, result.status, result.body, result.type);
    } catch (error) {
      sendJson(response, 400, { ok: false, error: error.message });
    }
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

module.exports = handleRequest;
module.exports.handleRequest = handleRequest;
module.exports.safePublicPath = safePublicPath;
