const Id = require('../utils/id');
const userDb = require('../data-access/user-db');
const { regularUserValidator: rValid , validate } = './../validators/models/validators'
const passwordUtils = require('../utils/password');
const role = require('../utils/role');


const registerRegularUser = async ({
  user
} = {}) => {
  const passSaltHash = passwordUtils.genPassword(user.password);
  validate(user, [
    rValid.username,
    rValid.email,
    rValid.name,
    vrValid.phoneNumber,
    rValid.gender,
    rValid.birthday,
    rValid.website,
    vrValid.biography,
  ]);

  const userData = {
    id:                           Id.makeId(),
    role:                         role.regular,
    username:                     user.username,
    email:                        user.email,
    name:                         user.name,
    
    phoneNumber:                  user.phoneNumber,
    gender:                       user.gender,
    birthday:                     user.birthday,
    website:                      user.website,
    biography:                    user.biography,

    isPrivate:                    true,
    isTaggable:                   true,

    posts:                        [],

    following:                    [],
    sentFollowingRequests:        [],
    receivedFollowingRequests:    [],

    mutedProfiles:                [],
    blockedProfiles:              [],

    likedPosts:                   [],
    dislikedPosts:                [],

    passwordSalt:                 passSaltHash.salt,
    passwordHash:                 passSaltHash.hash,

    isBlocked:                    false,
    createdAt:                    Date.now(),
    deletedAt:                    null,
  };

  await userDb.insert(userData);
  return userData;
}

const resetPassword = async ({
  token,
  password
} = {}) => {
  const saltHash = passwordUtils.genPassword(password);
  await db.userDb.resetPassword({ token: token, salt: saltHash.salt, hash: saltHash.hash });
}

module.exports = Object.freeze({
  registerRegularUser,
  resetPassword
});