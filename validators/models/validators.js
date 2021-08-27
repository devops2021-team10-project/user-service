const { 
  username, 
  email, 
  name 
} = require('./base-user.validator');

const {
  phoneNumber,
  gender,
  birthday,
  website,
  biography
} = require('./regular-user.validator');


const validate = (obj = {}, toValidate = []) => {
  toValidate.forEach((elem) => {
    elem(obj);
  });
  return true;
};


module.exports = Object.freeze({
  regularUser: {
    username,
    email, 
    name,
    phoneNumber,
    gender,
    birthday,
    website,
    biography
  }, 
  validate
});