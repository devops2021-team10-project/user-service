const format = (user) => {
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    username: user.username,
    name: user.name,

    website: user.website,
    biography: user.biography,

    isPrivate: user.isPrivate,
  }
}

module.exports = Object.freeze({ format });