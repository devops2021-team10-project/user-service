
const schema = {
  type: "object",
  properties: {
    toMuteUserId: { type: "string", format: "mongoID" },
    isMuted: { type: "boolean" },
  },
  required: [ "toMuteUserId", "isMuted" ],
  additionalProperties: false
}

module.exports = schema;