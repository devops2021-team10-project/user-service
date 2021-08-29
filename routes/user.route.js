const express = require('express');
const userRouter = express.Router();
const { handleError } = require('./../utils/error');

const Role = require('./../utils/role');

const authenticate = require('./../middleware/authenticate.middleware');
const authorize = require('./../middleware/authorize.middleware');

const { regularUserValidator: rValid, validate } = require('./../validators/models/validators');

const userService = require('./../services/user.service');

const regularUserFormatter = require('./../formatters/user/regular-user.formatter');

// Find user by id
userRouter.get(
  '/regular-user/:userId',
  authenticate,
  authorize([Role.regular]),
  async (req, res, next) => {
    try {
      
      const userId = req.params.userId;
      if (!userId) {
        throw {status: 400, msg: "Bad request"}
      }

      const user = await userService.findUserById({ id: userId });
      return res.status(200).json(regularUserFormatter.format(user));
    } catch(err) {
      handleError(err, res);
    }
});

// Insert user
userRouter.post(
  '/regular-user',
  async (req, res, next) => {
    try {
      const validUserData = validate(req.body, [
        rValid.username,
        rValid.password,
        rValid.email,
        rValid.name,
        rValid.phoneNumber,
        rValid.gender,
        rValid.birthday,
        rValid.website,
        rValid.biography,
      ]);

      const insertedUser = await userService.registerRegularUser({ userData: validUserData });
      return res.status(200).json(regularUserFormatter.format(insertedUser));
    } catch(err) {
      handleError(err, res);
    }
});

// Update user
userRouter.put(
  '/regular-user/:userId',
  authenticate,
  authorize([Role.regular]),
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        throw {status: 400, msg: "Bad request"};
      }

      if (req.user.id !== userId) {
        throw { status: 400, msg: "Access denied." };
      }

      const validUserData = validate(req.body, [
        rValid.username,
        rValid.email,
        rValid.name,
        rValid.phoneNumber,
        rValid.gender,
        rValid.birthday,
        rValid.website,
        rValid.biography,
      ]);

      const updatedUser = await userService.updateRegularUser({ id: userId, userData: validUserData });
      return res.status(200).json(regularUserFormatter.format(updatedUser));
    } catch(err) {
      handleError(err, res);
    }
});

// Reset user password
userRouter.put(
  '/regular-user/reset-password',
  authenticate,
  authorize([Role.regular]),
  async (req, res, next) => {
    try {

      validate({password: req.body.oldPassword}, [rUser.password]);
      validate({password: req.body.newPassword}, [rUser.password]);

      await userService.resetPassword({ 
        user: req.user, 
        oldPassword: req.body.oldPassword, 
        newPassword: req.body.newPassword 
      });
      return res.status(200).send("");
    } catch(err) {
      handleError(err, res);
    }
});

// Change IsPrivate value
userRouter.put(
  '/regular-user/change-is-private',
  authenticate,
  authorize([Role.regular]),
  async (req, res, next) => {
    try {
      const {isPrivate} = validate(req.body, [rUser.isPrivate]);
      await userService.changeIsPrivate({ 
        id: req.user.id, 
        value: isPrivate,
      });
      return res.status(200).send("");
    } catch(err) {
      handleError(err, res);
    }
});


module.exports = userRouter;