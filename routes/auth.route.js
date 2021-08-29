const express = require('express');
const authRouter = express.Router();

const { handleError } = require('./../utils/error');
const { verifyJWT } = require('../utils/jwt');

const Role = require('./../utils/role');

const authenticate = require('./../middleware/authenticate.middleware');
const authorize = require('./../middleware/authorize.middleware');

const { regularUserValidator: rValid, validate } = require('../validators/validators');

const authService = require('./../services/auth.service');
const userService = require('./../services/user.service');


const regularUserFormatter = require('./../formatters/user/regular-user.formatter');


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
  authenticate,
  authorize([Role.regular]),
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


module.exports = authRouter;