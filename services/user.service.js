function buildUserService ({ Id, db, validators, passwordUtils, role }) {
  return Object.freeze({
    registerRegularUser,
    resetPassword,
  });


  async function registerRegularUser({
   user
 } = {}) {
    const passSaltHash = passwordUtils.genPassword(user.password);
    validators.regularUserValidator.validate(user, [
      validators.baseUserValidator.username,
      validators.baseUserValidator.email,
      validators.baseUserValidator.name,
      validators.regularUserValidator.phoneNumber,
      validators.regularUserValidator.gender,
      validators.regularUserValidator.birthday,
      validators.regularUserValidator.website,
      validators.regularUserValidator.biography,
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

    await db.userDb.insert(userData);
    return userData;
  }

  async function resetPassword({
    token,
    password
  } = {}) {
    const saltHash = passwordUtils.genPassword(password);
    await db.userDb.resetPassword({ token: token, salt: saltHash.salt, hash: saltHash.hash });
  }

}

module.exports.buildUserService = buildUserService;