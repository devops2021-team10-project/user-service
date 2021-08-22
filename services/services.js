
const db = require('../data-access/db');
const validators = require('../validators/models/validators');

const { buildAuthService } = require('./auth.service');
const { buildUserService } = require('./user.service');

const Id = require('../utils/id');
const passwordUtils = require('../utils/password');
const role = require('../utils/role');

const authService = buildAuthService({ Id, db, validators, passwordUtils, role });
const userService = buildUserService({ Id, db, validators, passwordUtils, role });

module.exports.authService = authService;
module.exports.userService = userService;