function buildAuthService ({ Id, db, validators, passwordUtils, role }) {
  return Object.freeze({
    login,
    refreshToken,
  });

  async function login({
     username,
     password,
     role
  } = {}) {
    const user = await db.userDb.findByUsername({ username });
    if (user === null) {
      throw "Bad credentials.";
    }
    if (user.role !== role) {
      throw "Bad credentials.";
    }
    const isValid = passwordUtils.validPassword(password, user.passwordHash, user.passwordSalt);
    if(!isValid) {
      throw "Bad credentials.";
    }
    if(user.isBlocked === true) {
      throw "Your account is blocked by administrator";
    }
    const accessToken = passwordUtils.issueJWT('access', user.id);
    const refreshToken = passwordUtils.issueJWT('refresh', user.id);
    return { accessToken: accessToken.token, refreshToken: refreshToken.token, user };
  }

  async function refreshToken({
    id
  } = {}) {
    const accessToken = passwordUtils.issueJWT('access', id);
    return { accessToken: accessToken.token };
  }

}

module.exports.buildAuthService = buildAuthService;