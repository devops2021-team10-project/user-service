export default function buildMakeUser({Id, md5}) {
    return function makeUser({
        username,
        name,
        email,
        phone,
        gender,
        birthday,
        website,
        biography,

        isPrivate = false,
        isTaggable = true,
        followingProfileIds = [],
        mutedProfileIds = [],
        blockedProfileIds = [],

        likedPosts = [],
        dislikedPosts = [],
        reportedPosts = [],
        

        userId = Id.makeId(),
        createdOn = Date.now(),
        modifiedOn = Date.now(),
        deletedOn = null,
    } = {}) {

        // Data validation
        if (!Id.isValidId(id)) {
            throw new Error('User must have a valid id.')
        }
        if (!username || username.length < 1) {
            throw new Error('Username must include at least one character of text.')
        }

        return Object.freeze({
            getId: () => id,
            getUsername: () => username,
            getName: () => name,
            getEmail: () => email,
            getPhone: () => phone,
            getGender: () => gender,
            getBirthday: () => birthday,
            getWebsite: () => website,
            getBiography: () => biography,
            isPrivate: () => isPrivate,
            isTaggable: () => isTaggable,
            getFollowingProfileIds: () => followingProfileIds,
            getMutedProfileIds: () => mutedProfileIds,
            getBlockedProfleIds: () => blockedProfileIds,
            getLikedPosts: () => likedPosts,
            getDislikedPosts: () => dislikedPosts,
            getReportedPosts: () => reportedPosts,

            getCreatedOn: () => createdOn,
            getModifiedOn: () => modifiedOn,
            getDeletedOn: () => deletedOn,

            isDeleted: () => deletedOn !== null,


            markDeleted: () => {
              deletedOn = Date.now()
            },
           
            getHash: () => hash || (hash = makeHash()),
          })
    }
}