// Main
const express = require('express');
const authRouter = express.Router();

// Enums
const Role = require('./../utils/role');

// JSON request schema validators
const { userValidator } = require('../schemas/ajv');

// Formatters
const regularUserFormatter = require('./../formatters/user/regular-user.formatter');

// Util
const { handleError } = require('./../utils/error');
const { verifyJWT } = require('../utils/jwt');

// Middleware
const { authenticateUser } = require('../middleware/authenticateUser.middleware');
const { authorizeRoles } = require('../middleware/authorizeRoles.middleware');
const { authorizeFollowing } = require('../middleware/authorizeFollowing.middleware');

// Services
const authService = require('./../services/auth.service');
const userService = require('./../services/user.service');



authRouter.post(
  '/regular-user/login', 
  async (req, res, next) => {
    try {
      validate(req.body, [
        rValid.username,
        rValid.password,
      ]);

      const { accessToken, refreshToken } = 
        await authService.login({ 
          username: req.body.username, 
          password: req.body.password, 
          role: Role.regular
        });

      return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch(err) {
        handleError(err, res);
    }
});

authRouter.get(
  '/regular-user/find-by-jwt-header',
  authenticateUser(),
  authorizeRoles([Role.regular]),
  async (req, res, next) => {
    try {
      return res.status(200).json(regularUserFormatter.format(req.user));
    } catch(err) {
      handleError(err, res);
    }
});

authRouter.post(
  '/regular-user/find-by-jwt-value',
  async (req, res, next) => {
    if (!(req.body.hasOwnProperty('jwt') && typeof req.body.jwt === 'string' && req.body.jwt.length > 5)) {
      return res.status(400).json({ msg: "Invalid token." });
    }
    const data = verifyJWT(req.body.jwt);
    const user = await userService.findUserById({ id: data.sub });
    if (!user) {
      return res.status(400).json({ msg: "Bad token. User not found." });
    }
    try {
      return res.status(200).json(regularUserFormatter.format(user));
    } catch(err) {
      handleError(err, res);
    }
});

authRouter.post(
  '/authenticateUser',
  async (req, res, next) => {
    try {
      const resultReq = await authenticateUser.checkCondition({req: req.body.remoteReq})
      return res.status(200).json(resultReq);
    } catch (err) {
      handleError(err, res);
    }
  }
);

authRouter.post(
  '/authorizeRoles',
  async (req, res, next) => {
    try {
      await authorizeRoles.checkCondition({
        req: req.body.remoteReq,
        roles: req.body.userRoles
      });
      return res.sendStatus(200);
    } catch (err) {
      handleError(err, res);
    }
  }
);

authRouter.post(
  '/authorizeFollowing',
  async (req, res, next) => {
    try {
      await authorizeFollowing.checkCondition({ req: req.body.remoteReq });
      return res.sendStatus(200);
    } catch (err) {
      handleError(err, res);
    }
  }
);


module.exports = authRouter;