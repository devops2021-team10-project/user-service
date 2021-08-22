const Id = require('../utils/id');
const role = require('../utils/role');
const passwordUtils = require('../utils/password');


const { userDb } = require('../data-access/db');
const { buildUserSeeder } = require('./user.seeder');

const userSeeder = buildUserSeeder({ Id, role, passwordUtils, userDb });
 
module.exports.userSeeder = userSeeder;