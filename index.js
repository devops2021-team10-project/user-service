require('dotenv').config();

const brokerConsumer = require('./msgBroker/consumer');
const brokerProducer = require('./msgBroker/producer');
const { formatResponse } = require('./msgBroker/utils');

const userService = require('./services/user.service');


const USER_SERVICE_QUEUES = {
  findUserById:               "userService_findUserById",
  findUserByUsername:         "userService_findUserByUsername",
  searchByName:               "userService_searchByName",
  registerRegularUser:        "userService_registerRegularUser",
  updateRegularUser:          "userService_updateRegularUser",
  resetPassword:              "userService_resetPassword",
  changeIsPrivate:            "userService_changeIsPrivate",
  delete:                     "userService_delete"
};

const declareQueues = (consumerChannel, producerChannel) => {

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


// Connect, make queues and start
Promise.all([brokerConsumer.getChannel(), brokerProducer.getChannel(), brokerConsumer.initReplyConsumer()]).then(values => {
  try {
    declareQueues(values[0], values[1]);
    console.log("User Service - Ready");
  } catch (err) {
    console.log(err);
  }
});
