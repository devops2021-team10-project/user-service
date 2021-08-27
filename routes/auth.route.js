const express = require('express');
const authRouter = express.Router();

const Role = require('./../utils/role');
const { handleError } = require('./../utils/error');
const { verifyJWT } = require('./../utils/jwt') 
const authService = require('./../services/auth.service');
const userService = require('./../services/user.service');
const regularUserFormatter = require('./../formatters/user/regular-user.formatter');
const { JsonWebTokenError } = require('jsonwebtoken');


authRouter.post(
  '/regular-user/login', 
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

authRouter.get(
  '/regular-user/get-auth', 
  async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const jwtToken = authHeader && authHeader.split(' ')[1]
    const data = verifyJWT(jwtToken);
    const user = await userService.findUserById({ id: data.sub });
  try {
    return res.status(200).json(regularUserFormatter.format(user));
  } catch(err) {
    handleError(err, res);
  }
});

authRouter.post(
  '/regular-user/auth-jwt',
  async (req, res, next) => {
    const jwtToken = req.body.jwt;
    const data = verifyJWT(jwtToken);
    const user = await userService.findUserById({ id: data.sub });
    try {
      return res.status(200).json(regularUserFormatter.format(user));
    } catch(err) {
      handleError(err, res);
    }
});

authRouter.post(
  '/reset-password',
  async (req, res, next) => {
    try {
      const jwtToken = req.headers["Authorization"];
      const data = verifyJWT(jwtToken);
      const user = userService.findUserById(data.sub);
      await userService.resetPassword({ 
        user, 
        oldPassword: req.body.oldPassword, 
        newPassword: req.body.newPassword 
      });
      return res.sendStatus(200);
    } catch(err) {
      handleError(err, res);
    }
});


module.exports = authRouter;