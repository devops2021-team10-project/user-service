const { 
  username, 
  password,
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
  const newObj = {};
  toValidate.forEach((elem) => {
    elem(obj);
    newObj[elem.name] = obj[elem.name];
  });
  return newObj;
};


module.exports = Object.freeze({
  regularUserValidator: {
    username,
    password,
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