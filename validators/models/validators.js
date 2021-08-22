 
const emailValidator = require("email-validator");
const parse = require('date-fns/parse');
const isWithinInterval = require('date-fns/isWithinInterval');
const sub = require('date-fns/sub');

const buildBaseUserValidator = require('./base-user.validator');
const buildRegularUserValidator = require('./regular-user.validator');
const buildAgentUserValidator = require('./agent-user.validator');

const baseUserValidator = buildBaseUserValidator({ emailValidator });
const regularUserValidator = buildRegularUserValidator({ parse, isWithinInterval, sub });
const agentUserValidator = buildAgentUserValidator();

module.exports.baseUserValidator = baseUserValidator;
module.exports.regularUserValidator = regularUserValidator;
module.exports.agentUserValidator = agentUserValidator;