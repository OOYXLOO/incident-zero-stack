"use strict";

const { handleApiRequest } = require("../src/apiCore");

function readBodyText(request) {
  if (typeof request.body === "string") return request.body;
  if (request.body && typeof request.body === "object") return JSON.stringify(request.body);
  return "";
}

function sendResult(response, result) {
  response.statusCode = result.status;
  response.setHeader("content-type", result.type);
  response.setHeader("cache-control", "no-store");
  response.end(result.body);
}

function sendHeadResult(response, result) {
  response.statusCode = result.status;
  response.setHeader("content-type", result.type);
  response.setHeader("cache-control", "no-store");
  response.end("");
}

function handleVercelRequest(endpoint, request, response) {
  try {
    const url = new URL(request.url || `/${endpoint}`, "http://127.0.0.1");
    const method = request.method || "GET";
    const result = handleApiRequest({
      method: method === "HEAD" ? "GET" : method,
      pathname: endpoint,
      searchParams: url.searchParams,
      bodyText: readBodyText(request)
    });
    if (method === "HEAD") {
      sendHeadResult(response, result);
      return;
    }
    sendResult(response, result);
  } catch (error) {
    sendResult(response, {
      status: 400,
      type: "application/json; charset=utf-8",
      body: JSON.stringify({ ok: false, error: error.message }, null, 2)
    });
  }
}

module.exports = {
  handleVercelRequest,
  readBodyText,
  sendHeadResult
};
