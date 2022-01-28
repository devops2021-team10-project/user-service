
const schema = {
  type: "object",
  properties: {
    toBlockUserId: { type: "string", format: "mongoID" },
    isBlocked: { type: "boolean" },
  },
  required: [ "toBlockUserId", "isBlocked" ],
  additionalProperties: false
}

module.exports = schema;