const userDb = require('./../data-access/user-db');
const passwordUtils = require('./../utils/password');
const { issueJWT } = require('./../utils/jwt')

const login = async ({
    username,
    password,
    role
} = {}) => {
  const user = await userDb.findByUsername({ username });
  if (user === null && user.role !== role) {
    throw { status: 400, msg: "Bad credentials."};
  }
  const isValid = passwordUtils.validPassword(password, user.passwordHash, user.passwordSalt);
  if(!isValid) {
    throw { status: 400, msg: "Bad credentials."};
  }
  if(user.isBlocked === true) {
    throw { status: 400, msg:"Your account is blocked by administrator" };
  }
  const accessToken = issueJWT('access', user.id);
  const refreshToken = issueJWT('refresh', user.id);

  return { accessToken: accessToken.token, refreshToken: refreshToken.token };
}

module.exports = Object.freeze({
  login
});