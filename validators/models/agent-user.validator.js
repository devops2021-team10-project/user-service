/* STRUCTURE OF AGENT USER MODEL
  {
    id,
    role,
    username
    email,
    name,

    # Specific for regular user
    phoneNumber,
    gender,
    birthday,
    website,
    biography,

    isPrivate,
    isTaggable,

    posts: []

    following: [],
    sentFollowingRequests: [],
    receivedFollowingRequests: [],

    mutedProfiles: [],
    blockedProfiles: [],

    likedPosts: [],
    dislikedPosts: []
    #

    # Specific for Agent user
    campaigns: []
    #

    passwordSalt,
    passwordHash,

    isBlocked,
    createdAt,
    deletedAt,
  }
*/

module.exports = Object.freeze({});