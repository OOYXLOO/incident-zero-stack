"use strict";

const { handleVercelRequest } = require("./_handler");

module.exports = (request, response) => handleVercelRequest("case", request, response);
