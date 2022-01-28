
const schema = {
  type: "object",
  properties: {
    isTaggable: { type: "boolean" },
  },
  required: [ "isTaggable" ],
  additionalProperties: false
}

module.exports = schema;