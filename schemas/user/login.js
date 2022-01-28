
const schema = {
  type: "object",
  properties: {
    username: { type: "string", format: "identifier" },
    password: { type: "string", format: "password" },
  },
  required: [ "username", "password" ],
  additionalProperties: false
}

module.exports = schema;