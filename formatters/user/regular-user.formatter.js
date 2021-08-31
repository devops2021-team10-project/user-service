
const format = (user) => {
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    role: user.role,
    username: user.username,
    email: user.email,
    name: user.name,

    phoneNumber: user.phoneNumber,
    gender: user.gender,
    birthday: user.birthday,
    website: user.website,
    biography: user.biography,

    isPrivate: user.isPrivate,
    isTaggable: user.isTaggable,

    mutedProfiles: user.mutedProfiles,
    blockedProfiles: user.blockedProfiles,

    isBlocked: user.isBlocked,
    createdAt: user.createdAt,
    deletedAt: user.deletedAt,
  }
}

module.exports = Object.freeze({ format });