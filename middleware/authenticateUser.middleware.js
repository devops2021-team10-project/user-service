// Enums
const microserviceToken = process.env.MICROSERVICE_TOKEN;
const authAdditionalOptions = require("../utils/authAdditionalOptions");

// Utils
const { handleError } = require('../utils/error');
const { verifyJWT } = require('../utils/jwt');

// Services
const userService = require('../services/user.service');


const checkCondition = async ({ req }) => {
  const msTokenHeader = req.headers['microservice-token'];
  if (msTokenHeader === microserviceToken) {
    req.isServiceCall = true;
    return true;
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    throw "Bad token.";
  }

  const jwtToken = authHeader && authHeader.split(' ')[1]
  if (!jwtToken) {
    throw "Bad token.";
  }

  const data = verifyJWT(jwtToken);
  const user = await userService.findUserById({ id: data.sub });
  if (!user) {
   throw "Bad token. User not found.";
  }
  req.user = user;
  req.isServiceCall = false;

  return req;
};


const authenticateUser = (additionalOptions = []) => {
  if (typeof additionalOptions === 'string') {
    additionalOptions = [additionalOptions];
  }
  return [
    async (req, res, next) => {
      try {
        await checkCondition({ req });
        next();
      } catch (err) {
        if (!additionalOptions.includes(authAdditionalOptions.noError)) {
          return handleError(err, res);
        }
      }
    }
  ];
}

module.exports = Object.freeze({
  checkCondition,
  authenticateUser
});