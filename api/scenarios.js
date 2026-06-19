"use strict";

const { handleVercelRequest } = require("./_handler");

module.exports = (request, response) => handleVercelRequest("scenarios", request, response);
