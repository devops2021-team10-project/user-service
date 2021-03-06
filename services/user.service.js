
// Enums
const role = require('../utils/role');

// Utils
const passwordUtils = require('../utils/password');

// DB access
const userDb = require('../data-access/user-db');



const findUserByUsername = async ({ username } = {}) => {
  return await userDb.findByUsername({ username });
};

const findUserById = async ({ id } = {}) => {
  return await userDb.findById({id});
};

const searchByName = async ({ name } = {}) => {
  return await userDb.searchByName({ name });
};

const registerRegularUser = async ({
  userData
} = {}) => {
  const foundUserByUsername = await userDb.findByUsername({ username: userData.username });
  const foundUserByEmail = await userDb.findByEmail({ email: userData.email });

  if (foundUserByUsername) {
    throw "User with given username already exists.";
  }

  if (foundUserByEmail) {
    throw "User with given email already exists.";
  }

  const passSaltHash = passwordUtils.genPassword({ password: userData.password });
  const userCreateData = {
    role:                         role.regular,
    username:                     userData.username,
    email:                        userData.email,
    name:                         userData.name,
    
    phoneNumber:                  userData.phoneNumber,
    gender:                       userData.gender,
    birthday:                     userData.birthday,
    website:                      userData.website,
    biography:                    userData.biography,

    isPrivate:                    true,
    isTaggable:                   true,

    mutedProfiles:                [],
    blockedProfiles:              [],

    passwordSalt:                 passSaltHash.salt,
    passwordHash:                 passSaltHash.hash,

    isBlocked:                    false,
    createdAt:                    Date.now(),
    deletedAt:                    null,
  };

  return await userDb.insert({data: userCreateData});
}

const updateRegularUser = async ({
  id,
  userData
} = {}) => {

  const foundUserByUsername = await userDb.findByUsername({ username: userData.username });
  const foundUserByEmail = await userDb.findByEmail({ email: userData.email });

  if (foundUserByUsername !== null && foundUserByUsername.id !== id) {
    throw "User with given username already exists.";
  }

  if (foundUserByEmail !== null && foundUserByEmail.id !== id) {
    throw "User with given email already exists.";
  }

  const userUpdateData = {
    username:                     userData.username,
    email:                        userData.email,
    name:                         userData.name,
    
    phoneNumber:                  userData.phoneNumber,
    gender:                       userData.gender,
    birthday:                     userData.birthday,
    website:                      userData.website,
    biography:                    userData.biography,
  };

  await userDb.update({ id, data: userUpdateData });

  return await findUserById({ id });
};

const changeIsPrivate = async ({
  id,
  value
} = {}) => {
  await userDb.update({ id, data: { isPrivate: value }} );
}

const resetPassword = async ({ userId, oldPassword, newPassword } = {}) => {
  const user = await findUserById({ id: userId });
  const isValid = passwordUtils.validPassword({ password: oldPassword, hash: user.passwordHash, salt: user.passwordSalt });
  if (!isValid) {
    throw "Wrong old password.";
  }
  const { salt, hash } = passwordUtils.genPassword({ password: newPassword });
  await userDb.resetPassword({ userId: userId, passwordHash: hash, passwordSalt: salt });
}

const deleteRegularUser = async ({ id } = {}) => {
  await userDb.deleteById({ id });
};

module.exports = Object.freeze({
  findUserById,
  findUserByUsername,
  searchByName,

  registerRegularUser,

  updateRegularUser,
  changeIsPrivate,

  resetPassword,

  deleteRegularUser,
});