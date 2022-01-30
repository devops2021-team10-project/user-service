const amqp = require('amqplib');

const init = () => {
  return new Promise((resolve, reject) => {
    amqp.connect('amqp://user:123456@localhost:5672', (error0, connection) => {
      if (error0) {
        reject(error0);
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          reject(error1);
        }
        resolve(channel);
      });
    });
  });
};

let channelSingleton = null;
const getChannel = async () => {
  if (channelSingleton === null) {
    channelSingleton = await init();
  } else {
    return channelSingleton;
  }
}



const produceWithReply = async ({ queue, replyQueue, content, correlationId }) => {
  const channel = await getChannel();
  channel.sendToQueue(queue,
    Buffer.from(JSON.stringify(content)), {
      correlationId: correlationId,
      replyTo: replyQueue });
};

const produceWithNoReply = async ({ queue, content }) => {
  const channel = await getChannel();
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(content)));
}


module.exports = Object.freeze({
  getChannel,
  produceWithReply,
  produceWithNoReply
});


