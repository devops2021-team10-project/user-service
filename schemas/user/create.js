
const schema = {
  type: "object",
  properties: {
    username: { type: "string", format: "identifier" },
    password: { type: "string", format: "password" },
    email: { type: "string", format: "email" },
    name: { type: "string", format: "general_name" },
    phoneNumber: { type: "string", format: "phone" },
    gender: { enum: ["male", "female", "other"]},
    birthday: { type: "string" },
    website: { type: "string"},
    biography: { type: "string"}
  },
  required: [ "username", "password", "email", "name", "phoneNumber", "gender", "birthday", "website", "biography" ],
  additionalProperties: false
}

module.exports = schema;