/* STRUCTURE OF REGULAR USER MODEL
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

    passwordSalt,
    passwordHash,

    isBlocked,
    createdAt,
    deletedAt,
  }
*/

module.exports = function buildRegularUserValidator ({ parse, isWithinInterval, sub }) {
  return Object.freeze({
    phoneNumber: (obj) => {
      const phoneNumberPattern = /^\+[0-9]{1,20}$/;
      if (!(obj.hasOwnProperty("phoneNumber") &&
          typeof obj.phoneNumber === "string" &&
          phoneNumberPattern.test(obj.phoneNumber))) {
        throw "Invalid phone number."
      }
    },

    gender: (obj) => {
      if (!(obj.hasOwnProperty("gender") &&
          typeof obj.gender === "string" &&
          (obj.gender === 'male' ||
          obj.gender === 'female' ||
          obj.gender === 'other'))) {
        throw 'Invalid gender.'
      }
    },

    birthday: (obj) => {
      if (!(obj.hasOwnProperty("birthday") &&
          typeof obj.birthday === "string")) {
        let birthdayDate = null;
        try {
          birthdayDate = parse(obj.birthday, 'dd.MM.yyyy.', new Date())
        } catch (exception) {
          throw 'Invalid birthday.'
        }

        if (!isWithinInterval(
          birthdayDate,
          {start: new Date(1920, 1, 1), end: sub(new Date(), {years: 18})}
        )) {
          throw 'You must be older than 18.'
        }
      }
    },

    website: (obj) => {
      const websitePattern = /(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)|(https?:\/\/)?(www\.)?(?!ww)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/;
      if (!(obj.hasOwnProperty("website") &&
          typeof obj.website === "string" &&
          (websitePattern.test(obj.website) ||
          obj.website === ""))) {
        throw 'Invalid website'
      }
    },

    biography: (obj) => {
      if (!(obj.hasOwnProperty("website") &&
          typeof obj.website === "string")) {
        throw 'Invalid website'
      }
    },


    validate: (obj = {}, toValidate = []) => {
      toValidate.forEach((elem) => {
        elem(obj);
      });
      return true;
    }
  });
}