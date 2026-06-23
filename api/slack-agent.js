"use strict";

const { handleVercelRequest } = require("./_handler");

module.exports = (request, response) => handleVercelRequest("slack-agent", request, response);
