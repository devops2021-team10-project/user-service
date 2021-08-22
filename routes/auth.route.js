const express = require('express');
const router = express.Router();
const passport = require('passport');

const { handleError } = require('../utils/error');
const role = require('../utils/role');
const { authService } = require('../services/services');

router.post('/regular-user/login', async (req, res, next) => {
  try {
      const { accessToken, refreshToken, user } = 
        await authService.login({ 
          username: req.body.username, 
          password: req.body.password, 
          role: role.regular
        });

      return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, user: user });
  } catch(err) {
      handleError(err, res);
  }
});

module.exports = router;