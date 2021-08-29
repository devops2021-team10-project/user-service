
const toMuteUserId = (obj) => {
  if (!(obj.hasOwnProperty("toMuteUserId") &&
    typeof obj.toMuteUserId === "string")) {
    throw { status: 400, msg: "Invalid toMuteUserId value" };
  }
};

const isMuted = (obj) => {
  if (!(obj.hasOwnProperty("isMuted") &&
    typeof obj.isMuted === "boolean")) {
    throw { status: 400, msg: "Invalid isMuted value" };
  }
};

module.exports = Object.freeze({
  toMuteUserId,
  isMuted,
});