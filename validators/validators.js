const baseUserValidator = require('./models/base-user.validator');
const regularUserValidator = require('./models/regular-user.validator');

const changeMutedProfileRequestValidator = require('./requests/change-muted-profile.validator');
const changeBlockedProfileRequestValidator = require('./requests/change-blocked-profile.validator');


const validate = (obj = {}, toValidate = []) => {
  const newObj = {};
  toValidate.forEach((elem) => {
    elem(obj);
    newObj[elem.name] = obj[elem.name];
  });
  return newObj;
};


module.exports = Object.freeze({
  regularUserValidator: {
    username: baseUserValidator.username,
    password: baseUserValidator.password,
    email: baseUserValidator.email,
    name: baseUserValidator.name,
    phoneNumber: regularUserValidator.phoneNumber,
    gender: regularUserValidator.gender,
    birthday: regularUserValidator.birthday,
    website: regularUserValidator.website,
    biography: regularUserValidator.biography,
    isPrivate: regularUserValidator.isPrivate,
    isTaggable: regularUserValidator.isTaggable,
  },
  changeMutedProfileRequestValidator: {
    toMuteUserId: changeMutedProfileRequestValidator.toMuteUserId,
    isMuted: changeMutedProfileRequestValidator.isMuted,
  },
  changeBlockedProfileRequestValidator: {
    toBlockUserId: changeBlockedProfileRequestValidator.toBlockUserId,
    isBlocked: changeBlockedProfileRequestValidator.isBlocked,
  },
  validate
});