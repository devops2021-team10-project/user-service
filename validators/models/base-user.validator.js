/* STRUCTURE OF BASE USER MODEL
  {
    id,
    role,
    username,
    password,
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

const password = (obj) => {
  const passwordPattern = /^.{6,100}$/;
  if (!(obj.hasOwnProperty("password") &&
    passwordPattern.test(obj.password))) {
    throw { status: 400, msg: "Invalid password."};
  }
};

const email = (obj) => {
  if (!(obj.hasOwnProperty("email") &&
      emailValidator.validate(obj.email))) {
    throw { status: 400, msg:"Invalid email address."};
  }
};

const name = (obj) => {
  const namePattern = /^[a-z A-Z]+$/;
  if (!(obj.hasOwnProperty("name") &&
      namePattern.test(obj.name))) {
    throw { status: 400, msg: "Invalid name."};
  }
};

module.exports = Object.freeze({
  username,
  password,
  email,
  name
});