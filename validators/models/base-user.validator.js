/* STRUCTURE OF BASE USER MODEL
  {
    id,
    role,
    username,
    email,
    name,

    passwordSalt,
    passwordHash,

    isBlocked,
    createdAt,
    deletedAt,˚ s
  }
*/

const emailValidator = require('email-validator');

const username = (obj) => {
  const usernamePattern = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
  if (!(obj.hasOwnProperty("username") &&
      usernamePattern.test(obj.username))) {
    throw { status: 400, msg: "Invalid username."};
  }
};

const email = (obj) => {
  if (!(obj.hasOwnProperty("email") &&
      emailValidator.validate(obj.email))) {
    throw { status: 400, msg:"Invalid email address."};
  }
};

const name = (obj) => {
  const namePattern = /^[a-z ,.'-]+$/;
  if (!(obj.hasOwnProperty("name") &&
      namePattern.test(obj.name))) {
    throw { status: 400, msg: "Invalid name."};
  }
};

module.exports = Object.freeze({
  username,
  email,
  name
});