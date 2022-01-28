
const schema = {
  type: "object",
  properties: {
    isPrivate: { type: "boolean" },
  },
  required: [ "isPrivate" ],
  additionalProperties: false
}

module.exports = schema;