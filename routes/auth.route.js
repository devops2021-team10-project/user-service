const express = require('express');
const authRouter = express.Router();

const Role = require('../utils/role');
const Passport = require('passport');
const Authorize = require('../utils/authorize');

const { handleError } = require('../utils/error');
const authService = require('./../services/auth.service');
const userService = require('./../services/user.service');
const regularUserFormatter = require('./../formatters/user/regular-user.formatter');


authRouter.post('/regular-user/login', 
                async (req, res, next) => {
  try {
      const { accessToken, refreshToken, user } = 
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

authRouter.get('/regular-user/get-auth', 
              Passport.authenticate('access', { session: false }), 
              Authorize.authorize([ Role.regular ]),
              async (req, res, next) => {
  try {
    return res.status(200).json(regularUserFormatter.format(req.user));
  } catch(err) {
    handleError(err, res);
  }
});


authRouter.get('/refresh-token', 
              Passport.authenticate('refresh', { session: false }),
              async (req, res, next) => {
  try {
      const { accessToken } = await authService.refreshToken(req.user.id);
      return res.status(200).json({ accessToken: accessToken});
  } catch(err) {
      return res.sendStatus(401);
  }
});

authRouter.post('/reset-password',
                async (req, res, next) => {
  try {
      await userService.resetPassword({ token: req.body.token, password: req.body.newPassword });
      return res.sendStatus(200);
  } catch(err) {
      handleError(err, res);
  }
});


module.exports = authRouter;