const { handleError } = require('../utils/error');
const { verifyJWT } = require('../utils/jwt');
const userService = require('../services/user.service');

const microserviceToken = process.env.MICROSERVICE_TOKEN;

const authenticate = async (req, res, next) => {
  const msTokenHeader = req.headers['microservice-token'];
  if (msTokenHeader === microserviceToken) {
    req.isServiceCall = true;
    return next();
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(400).json({ msg: "Bad token." });
  }

  const jwtToken = authHeader && authHeader.split(' ')[1]
  if (!jwtToken) {
    return res.status(400).json({ msg: "Bad token." });
  }

  let data = null;
  try {
    data = verifyJWT(jwtToken);
  } catch (err) {
    return handleError(err, res);
  }
  
  const user = await userService.findUserById({ id: data.sub });
  if (!user) {
    return res.status(400).json({ msg: "Bad token. User not found." });
  }
  req.user = user;
  req.isServiceCall = false;

  return next();
};

module.exports = authenticate;