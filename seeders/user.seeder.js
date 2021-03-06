const Id = require('../utils/id');
const role = require('../utils/role');
const passwordUtils = require('../utils/password');
const userDb = require('../data-access/user-db');


const insertUser = async () => {

  const passSaltHash = passwordUtils.genPassword({ password: "123456"});
  const userData = {
    id:                           Id.makeId(),
    role:                         role.regular,
    username:                     'lazar',
    email:                        "lazar@dev.com",
    name:                         "Lazar Markovic",
    
    phoneNumber:                  "+381601389333",
    gender:                       "male",
    birthday:                     "14.11.1996.",
    website:                      "lazamarkovic.com",
    biography:                    "it's me",

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
  return true;
};

module.exports = Object.freeze({
  insertUser
});