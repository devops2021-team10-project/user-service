
const toBlockUserId = (obj) => {
  if (!(obj.hasOwnProperty("toBlockUserId") &&
    typeof obj.toBlockUserId === "string")) {
    throw { status: 400, msg: "Invalid toBlockUserId value" };
  }
};

const isBlocked = (obj) => {
  if (!(obj.hasOwnProperty("isBlocked") &&
    typeof obj.isBlocked === "boolean")) {
    throw { status: 400, msg: "Invalid isBlocked value" };
  }
};

module.exports = Object.freeze({
  toBlockUserId,
  isBlocked,
});