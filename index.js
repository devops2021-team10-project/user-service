require('dotenv').config();

const brokerConsumer = require('./msgBroker/consumer');
const brokerProducer = require('./msgBroker/producer');

const userService = require('./services/user.service');

const USER_SERVICE_QUEUES = {
  noAuth_findUserByUsername:  "userService_noAuth_findUserByUsername",
  noAuth_findUserById:        "userService_noAuth_findUserById",
  noAuth_searchByName:        "userService_noAuth_searchByName",
  findUserById:               "userService_findUserById",
  registerRegularUser:        "userService_registerRegularUser",
  updateRegularUser:          "userService_updateRegularUser",
  resetPassword:              "userService_resetPassword",
  changeIsPrivate:            "userService_changeIsPrivate",
  changeIsTaggable:           "userService_changeIsTaggable",
  changeMutedProfile:         "userService_changeMutedProfile",
  changeBlockedProfile:       "userService_changeBlockedProfile",
  delete:                     "userService_delete"
};

const formatResponse = ({data, err }) => {
  let respData = {};
  if (!err) {
    respData = {
      isError: false,
      error: null,
      data,
      serviceName: "userService",
      timestamp: Date.now()
    };
  } else {
    respData = {
      isError: true,
      error: err,
      data:  null,
      serviceName: "userService",
      timestamp: Date.now()
    }
  }
  return respData;
}

const declareRoutes = (consumerChannel, producerChannel) => {
  consumerChannel.assertQueue(USER_SERVICE_QUEUES.noAuth_findUserByUsername).then(() => {
    consumerChannel.consume(USER_SERVICE_QUEUES.noAuth_findUserByUsername, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        const user = await userService.findUserByUsername({ username: data.username });
        respData = formatResponse({data: user, err: null});
      } catch (err) {
        respData = formatResponse({data: null, err});
      }

      producerChannel.sendToQueue(msg.properties.replyTo,
        Buffer.from(JSON.stringify(respData)), {
          correlationId: msg.properties.correlationId
        });
      consumerChannel.ack(msg);
    });
  });


  consumerChannel.assertQueue(USER_SERVICE_QUEUES.noAuth_findUserById).then(() => {
    consumerChannel.consume(USER_SERVICE_QUEUES.noAuth_findUserById, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        const user = await userService.findUserById({ username: data.id });
        respData = formatResponse({data: user, err: null});
      } catch (err) {
        respData = formatResponse({data: null, err});
      }

      producerChannel.sendToQueue(msg.properties.replyTo,
        Buffer.from(JSON.stringify(respData)), {
          correlationId: msg.properties.correlationId
        });
      consumerChannel.ack(msg);
    });
  });
}


// Connect, make channels and start
Promise.all([brokerConsumer.getChannel(), brokerProducer.getChannel()]).then(values => {
  declareRoutes(values[0], values[1]);
});
