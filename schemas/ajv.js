const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({allErrors: true});
addFormats(ajv);
require("ajv-errors")(ajv, { singleError: true, keepErrors: true });

const parse = require('date-fns/parse');

// Custom formats
ajv.addFormat("mongoID", /^[a-zA-Z0-9]{1,100}$/);
ajv.addFormat("general_name", /^[a-zA-Z0-9][^\n]{0,200}$/);
ajv.addFormat("identifier", /^[_a-zA-Z][_a-zA-Z0-9]{0,100}$/);
ajv.addFormat("number", /^[0-9]+$/);
ajv.addFormat("phone", /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/);
ajv.addFormat("custom_date", function(dateTimeString) {
  try {
    parse(dateTimeString, 'dd.MM.yyyy.', new Date());
    return true;
  } catch (err) {
    return false;
  }
});

module.exports = Object.freeze({
  userValidator: {
    validateLogin: ajv.compile(require('./user/login')),
    validateCreate: ajv.compile(require('./user/create')),
    validateUpdate: ajv.compile(require('./user/update')),
    validatePasswordReset: ajv.compile(require('./user/passwordReset')),
    validateChangeIsPrivate: ajv.compile(require('./user/changeIsPrivate')),
    validateChangeIsTaggable: ajv.compile(require('./user/changeIsTaggable')),
    validateChangeMutedProfile: ajv.compile(require('./user/changeMutedProfile')),
    validateChangeBlockedProfile: ajv.compile(require('./user/changeBlockedProfile'))
  }
});