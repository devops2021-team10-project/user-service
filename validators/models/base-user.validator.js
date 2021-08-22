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
    deletedAt,˚
  }
*/

module.exports = function buildBaseUserValidator ({ emailValidator }) {
  return Object.freeze({
    username: (obj) => {
      const usernamePattern = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
      if (!(obj.hasOwnProperty("username") &&
          usernamePattern.test(obj.username))) {
        throw "Invalid username."
      }
    },
    email: (obj) => {
      if (!(obj.hasOwnProperty("email") &&
          emailValidator.validate(obj.email))) {
        throw "Invalid email address."
      }
    },
    name: (obj) => {
      const namePattern = /^[a-z ,.'-]+$/;
      if (!(obj.hasOwnProperty("name") &&
          namePattern.test(obj.name))) {
        throw "Invalid name."
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