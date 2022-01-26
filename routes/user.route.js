// Main
const express = require('express');
const userRouter = express.Router();

// Enums
const roleEnum = require('./../utils/role');

// Schema validators
const { userValidator } = require('../schemas/ajv');

// Formatters
const regularUserFormatter = require("../formatters/user/regular-user.formatter");
const publicRegularUserFormatter = require("../formatters/user/regular-user.formatter");

// Utils
const { handleError } = require('./../utils/error');

// Auth utils
const authenticateUser = require('../middleware/authenticateUser.middleware');
const authorizeRoles = require('../middleware/authorizeRoles.middleware');
const authorizeFollowing = require('../middleware/authorizeFollowing.middleware');

// Services
const userService = require('./../services/user.service');



// Find user by username (public)
userRouter.get(
  '/regular-user/public/byUsername/:username',
  async (req, res, next) => {
    try {
      const username = req.params.username;
      if (!username) {
        throw { status: 400, msg: "Bad request" }
      }

      const user = await userService.findUserByUsername({ username });
      if (!user) {
        return res.status(400).json({msg: "User with given username not found."});
      }
      return res.status(200).json(publicRegularUserFormatter.format(user));
    } catch(err) {
      handleError(err, res);
    }
  });

// Find user by id (public)
userRouter.get(
  '/regular-user/public/byId/:userId',
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        throw {status: 400, msg: "Bad request"}
      }

      const user = await userService.findUserById({ id: userId });
      if (!user) {
        return res.status(400).json({msg: "User with given id not found."});
      }
      return res.status(200).json(publicRegularUserFormatter.format(user));
    } catch(err) {
      handleError(err, res);
    }
  });


// Search users by name (public)
userRouter.get(
  '/regular-user/public/search/:name',
  async (req, res, next) => {
    try {
      const name = req.params.name;
      if (!name) {
        throw {status: 400, msg: "Bad request"}
      }

      console.log(name)

      const users = await userService.searchByName({ name });
      if (!users) {
        return res.status(200).json([]);
      }
      return res.status(200).json(users.map((user) => publicRegularUserFormatter.format(user)));
    } catch(err) {
      handleError(err, res);
    }
  });

// Find user by id
userRouter.get(
  '/regular-user/:userId',
  authenticateUser(),
  authorizeRoles([roleEnum.regular]),
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

// Create new user (public)
userRouter.post(
  '/regular-user',
  async (req, res, next) => {
    try {
      userValidator.validateCreate(req.body);
      const insertedUser = await userService.registerRegularUser({ userData: req.body });
      return res.status(200).json(regularUserFormatter.format(insertedUser));
    } catch(err) {
      handleError(err, res);
    }
});

// Update user
userRouter.put(
  '/regular-user/update/:userId',
  authenticateUser(),
  authorizeRoles([roleEnum.regular]),
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        throw {status: 400, msg: "Bad request"};
      }

      if (req.user.id !== userId && !req.isServiceCall) {
        throw { status: 400, msg: "Access denied." };
      }

      userValidator.validateUpdate(req.body);
      const updatedUser = await userService.updateRegularUser({ id: userId, userData: req.body });
      return res.status(200).json(regularUserFormatter.format(updatedUser));
    } catch(err) {
      handleError(err, res);
    }
});

// Reset user password
userRouter.put(
  '/regular-user/reset-password',
  authenticateUser(),
  authorizeRoles([roleEnum.regular]),
  async (req, res, next) => {
    try {
      userValidator.validatePasswordReset(req.body);
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
  authenticateUser(),
  authorizeRoles([roleEnum.regular]),
  async (req, res, next) => {
    try {
      const {isPrivate} = validate(req.body, [rValid.isPrivate]);
      await userService.changeIsPrivate({ 
        id: req.user.id, 
        value: isPrivate,
      });
      return res.status(200).send("");
    } catch(err) {
      handleError(err, res);
    }
});

// Change IsTaggable value
userRouter.put(
  '/regular-user/change-is-taggable',
  authenticateUser(),
  authorizeRoles([roleEnum.regular]),
  async (req, res, next) => {
    try {
      const {isTaggable} = validate(req.body, [rValid.isTaggable]);
      await userService.changeIsTaggable({
        id: req.user.id,
        value: isTaggable,
      });
      return res.status(200).send("");
    } catch(err) {
      handleError(err, res);
    }
  });

// Change muted profile
userRouter.put(
  '/regular-user/change-muted-profile',
  authenticateUser(),
  authorizeRoles([roleEnum.regular]),
  async (req, res, next) => {
    try {
      const validData = validate(req.body, [
        changeMutedProfileRequestValidator.toMuteUserId,
        changeMutedProfileRequestValidator.isMuted,
      ]);
      await userService.changeMutedProfile({
        id: req.user.id,
        toMuteUserId: validData.toMuteUserId,
        isMuted: validData.isMuted,
      });
      return res.status(200).send("");
    } catch(err) {
      handleError(err, res);
    }
  });

// Change muted profile
userRouter.put(
  '/regular-user/change-blocked-profile',
  authenticateUser(),
  authorizeRoles([roleEnum.regular]),
  async (req, res, next) => {
    try {
      const validData = validate(req.body, [
        changeBlockedProfileRequestValidator.toBlockUserId,
        changeBlockedProfileRequestValidator.isBlocked,
      ]);
      await userService.changeBlockedProfile({
        id: req.user.id,
        toBlockUserId: validData.toBlockUserId,
        isBlocked: validData.isBlocked,
      });
      return res.status(200).send("");
    } catch(err) {
      handleError(err, res);
    }
  });


// Delete user
userRouter.delete(
  '/regular-user',
  authenticateUser(),
  authorizeRoles([roleEnum.regular]),
  async (req, res, next) => {
    try {
      await userService.deleteRegularUser({
        id: req.user.id
      });
      return res.status(200).send("");
    } catch(err) {
      handleError(err, res);
    }
  });

module.exports = userRouter;