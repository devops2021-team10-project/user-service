
const schema = {
  type: "object",
  properties: {
    oldPassword: { type: "string", format: "password" },
    newPassword: { type: "string", format: "password" },
  },
  required: [ "oldPassword", "newPassword" ],
  additionalProperties: false
}

module.exports = schema;