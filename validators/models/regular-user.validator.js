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

const parse = require('date-fns/parse');
const isWithinInterval = require('date-fns/isWithinInterval');
const sub = require('date-fns/sub');


const phoneNumber = (obj) => {
  const phoneNumberPattern = /^\+[0-9]{1,20}$/;
  if (!(obj.hasOwnProperty("phoneNumber") &&
      typeof obj.phoneNumber === "string" &&
      phoneNumberPattern.test(obj.phoneNumber))) {
    throw { status: 400, msg: "Invalid phone number."};
  }
};

const gender = (obj) => {
  if (!(obj.hasOwnProperty("gender") &&
      typeof obj.gender === "string" &&
      (obj.gender === 'male' ||
      obj.gender === 'female' ||
      obj.gender === 'other'))) {
    throw { status: 400, msg: "Invalid gender." };
  }
};

const birthday = (obj) => {
  if (!(obj.hasOwnProperty("birthday") &&
      typeof obj.birthday === "string")) {
    let birthdayDate = null;
    try {
      birthdayDate = parse(obj.birthday, 'dd.MM.yyyy.', new Date())
    } catch (exception) {
      throw { status: 400, msg: "Invalid birthday." };
    }

    if (!isWithinInterval(
      birthdayDate,
      {start: new Date(1920, 1, 1), end: sub(new Date(), {years: 18})}
    )) {
      throw { status: 400, msg: "You must be older than 18." };
    }
  }
};

const website = (obj) => {
  const websitePattern = /(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)|(https?:\/\/)?(www\.)?(?!ww)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/;
  if (!(obj.hasOwnProperty("website") &&
      typeof obj.website === "string" &&
      (websitePattern.test(obj.website) ||
      obj.website === ""))) {
    throw { status: 400, msg: "Invalid website" };
  }
};

const biography = (obj) => {
  if (!(obj.hasOwnProperty("website") &&
      typeof obj.website === "string")) {
    throw { status: 400, msg: "Invalid website" };
  }
};

module.exports = Object.freeze({
  phoneNumber,
  gender,
  birthday,
  website,
  biography
});