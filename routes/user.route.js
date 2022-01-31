// Main
const express = require('express');
const userRouter = express.Router();
const { differenceInYears, parse } = require('date-fns');

// Enums
const roleEnum = require('./../utils/role');

// JSON request schema validators
const { userValidator } = require('../schemas/ajv');



// Utils
const { handleError } = require('./../utils/error');

// Middleware
const { authenticateUser } = require('../../api-gateway/middleware/authenticateUser.middleware');
const { authorizeRoles } = require('../../api-gateway/middleware/authorizeRoles.middleware');
const { authorizeFollowing } = require('../../api-gateway/middleware/authorizeFollowing.middleware');

// Services
const userService = require('./../services/user.service');


// Find user by username (public)
userRouter.get(
  '/regular-user/public/byUsername/:username',
  async (req, res, next) => {
    try {
      const username = req.params.username;
      if (!username) {
        throw "Bad request";
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
        throw "Bad request"
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
        throw "Bad request";
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
        throw "Bad request";
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
      if (!userValidator.validateCreate(req.body)) {
        throw "Bad data.";
      }

      // Check age
      try {
        const birthday = parse(req.body.birthday, 'dd.MM.yyyy.', new Date());
        const age = differenceInYears(new Date(), birthday);
        if (age < 13) {
          throw "You are under legal age to use social media platform."
        }
      } catch (err) {
        throw "Bad date format.";
      }

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
        throw "Bad request";
      }

      if (req.user.id !== userId && !req.isServiceCall) {
        throw "Access denied.";
      }

      if (!userValidator.validateUpdate(req.body)) {
        throw "Bad data.";
      }

      // Check age
      try {
        const birthday = parse(req.body.birthday, 'dd.MM.yyyy.', new Date());
        const age = differenceInYears(new Date(), birthday);
        if (age < 13) {
          throw "You are under legal age to use social media platform."
        }
      } catch (err) {
        throw "Bad date format.";
      }

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
      if (!userValidator.validatePasswordReset(req.body)) {
        throw "Bad data.";
      }
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

      if (!userValidator.validateChangeIsPrivate(req.body)) {
        throw "Bad data.";
      }
      await userService.changeIsPrivate({ 
        id: req.user.id, 
        value: req.body.isPrivate,
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

      if (!userValidator.validateChangeIsTaggable(req.body)) {
        throw "Bad data.";
      };
      await userService.changeIsTaggable({
        id: req.user.id,
        value: req.body.isTaggable,
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

      if (!userValidator.validateChangeMutedProfile(req.body)) {
        throw "Bad data.";
      }
      await userService.changeMutedProfile({
        id: req.user.id,
        toMuteUserId: req.body.toMuteUserId,
        isMuted: req.body.isMuted,
      });
      return res.status(200).send("");
    } catch(err) {
      handleError(err, res);
    }
  });

// Change blocked profile
userRouter.put(
  '/regular-user/change-blocked-profile',
  authenticateUser(),
  authorizeRoles([roleEnum.regular]),
  async (req, res, next) => {
    try {

      if (!userValidator.validateChangeBlockedProfile(req.body)) {
        throw "Bad data.";
      }
      await userService.changeBlockedProfile({
        id: req.user.id,
        toBlockUserId: req.body.toBlockUserId,
        isBlocked: req.body.isBlocked,
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