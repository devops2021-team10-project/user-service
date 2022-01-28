// Main
const axios = require("axios");


const findByUserIds = async ({ followerUserId, followedUserId }) => {
  let config = {
    headers: {
      "microservice-token": process.env.MICROSERVICE_TOKEN,
    }
  }
  const response = await axios.get(
    'http://localhost:5001/following-service-api/following/findByUserIds/followerUserId/' + followerUserId + '/followedUserId/' + followedUserId,
    config
  )

  if (response.status !== 200) {
    throw response.data
  }
  return { ...response.data };
};

module.exports = Object.freeze({
  findByUserIds
});