require('dotenv').config();

const brokerConsumer = require('./msgBroker/consumer');
const brokerProducer = require('./msgBroker/producer');

const userService = require('./services/user.service');

const USER_SERVICE_QUEUES = {
  findUserById:               "userService_findUserById",
  findUserByUsername:         "userService_findUserByUsername",
  searchByName:               "userService_searchByName",
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

  console.log("Declaring routes");
  consumerChannel.assertQueue(USER_SERVICE_QUEUES.findUserById, { exclusive: false }, (error2, q) => {
    consumerChannel.consume(USER_SERVICE_QUEUES.findUserById, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        const user = await userService.findUserById({ id: data.id });
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


  consumerChannel.assertQueue(USER_SERVICE_QUEUES.findUserByUsername, { exclusive: false }, (error2, q) => {
    consumerChannel.consume(USER_SERVICE_QUEUES.findUserByUsername, async (msg) => {
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


  consumerChannel.assertQueue(USER_SERVICE_QUEUES.searchByName, { exclusive: false }, (error2, q) => {
    consumerChannel.consume(USER_SERVICE_QUEUES.searchByName, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        const users = await userService.searchByName({ name: data.name });
        respData = formatResponse({data: users, err: null});
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

  consumerChannel.assertQueue(USER_SERVICE_QUEUES.registerRegularUser, { exclusive: false }, (error2, q) => {
    consumerChannel.consume(USER_SERVICE_QUEUES.registerRegularUser, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        const user = await userService.registerRegularUser({ userData: data.userData });
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

  consumerChannel.assertQueue(USER_SERVICE_QUEUES.updateRegularUser, { exclusive: false }, (error2, q) => {
    consumerChannel.consume(USER_SERVICE_QUEUES.updateRegularUser, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        const user = await userService.updateRegularUser({ id: data.userId, userData: data.userData });
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


  consumerChannel.assertQueue(USER_SERVICE_QUEUES.resetPassword, { exclusive: false }, (error2, q) => {
    consumerChannel.consume(USER_SERVICE_QUEUES.resetPassword, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        await userService.resetPassword({
          userId: data.userId,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword
        });
        respData = formatResponse({data: {}, err: null});
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


  consumerChannel.assertQueue(USER_SERVICE_QUEUES.changeIsPrivate, { exclusive: false }, (error2, q) => {
    consumerChannel.consume(USER_SERVICE_QUEUES.changeIsPrivate, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        await userService.changeIsPrivate({
          id: data.userId,
          value: data.value
        });
        respData = formatResponse({data: {}, err: null});
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


  consumerChannel.assertQueue(USER_SERVICE_QUEUES.changeIsTaggable, { exclusive: false }, (error2, q) => {
    consumerChannel.consume(USER_SERVICE_QUEUES.changeIsTaggable, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        await userService.changeIsTaggable({
          id: data.userId,
          value: data.value
        });
        respData = formatResponse({data: {}, err: null});
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


  consumerChannel.assertQueue(USER_SERVICE_QUEUES.changeMutedProfile, { exclusive: false }, (error2, q) => {
    consumerChannel.consume(USER_SERVICE_QUEUES.changeMutedProfile, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        await userService.changeMutedProfile({
          id: data.id,
          toMuteUserId: data.toMuteUserId,
          isMuted: data.isMuted,
        });
        respData = formatResponse({data: {}, err: null});
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

  consumerChannel.assertQueue(USER_SERVICE_QUEUES.changeBlockedProfile, { exclusive: false }, (error2, q) => {
    consumerChannel.consume(USER_SERVICE_QUEUES.changeBlockedProfile, async (msg) => {
      const data = JSON.parse(msg.content);
      console.log(data);
      let respData = null;
      try {
        await userService.changeBlockedProfile({
          id: data.id,
          toBlockUserId: data.toBlockUserId,
          isBlocked: data.isBlocked,
        });
        respData = formatResponse({data: {}, err: null});
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


  consumerChannel.assertQueue(USER_SERVICE_QUEUES.delete, { exclusive: false }, (error2, q) => {
    consumerChannel.consume(USER_SERVICE_QUEUES.delete, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        await userService.deleteRegularUser({ id: data.id });
        respData = formatResponse({data: {}, err: null});
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
  try {
    declareRoutes(values[0], values[1]);
    console.log("Ready");
  } catch (err) {
    console.log(err);
  }
});
