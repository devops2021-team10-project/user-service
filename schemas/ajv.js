const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({allErrors: true});
addFormats(ajv);
require("ajv-errors")(ajv, { singleError: true, keepErrors: true });


// Custom formats
ajv.addFormat("mongoID", /^[a-zA-Z0-9]{1,100}$/);
ajv.addFormat("general_name", /^[a-zA-Z0-9][^\n]{0,200}$/);
ajv.addFormat("identifier", /^[_a-zA-Z][_a-zA-Z0-9]{0,100}$/);
ajv.addFormat("number", /^[0-9]+$/);
ajv.addFormat("phone", /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/);


module.exports = Object.freeze({
  authValidator: {
    validateLogin: ajv.compile(require('./auth/login')),
    validateFindByJWTValue: ajv.compile(require('./auth/findByJWTValue'))
  },
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