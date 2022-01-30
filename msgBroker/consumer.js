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


const timeoutError = Symbol();
const timeout = ({ prom, time, exception }) => {
  let timer;
  return Promise.race([
    prom,
    new Promise((_r, rej) => timer = setTimeout(rej, time, exception))
  ]).finally(() => clearTimeout(timer));
}


const consumeCorrelated = async ({ queue, correlationId }) => {
  const channel = await getChannel();
  await channel.assertQueue(queue);

  const consumePromise = new Promise((resolve, _reject) => {
    channel.consume(queue, (msg) => {
      if ((msg.properties.correlationId) === correlationId) {
        resolve(JSON.parse(msg.content));
      }
    }, {
      noAck: true
    });
  });

  return await timeout({
    prom: consumePromise,
    time: 3000,
    exception: timeoutError
  });
}


const consumeAny = async ({ queue }) => {
  const channel = await getChannel();
  await channel.assertQueue(queue);
  const consumePromise = new Promise((resolve, _reject) => {
    channel.consume(queue, (msg) => {
      resolve(JSON.parse(msg.content));
      channel.ack(msg);
    });
  });

  return await timeout({
    prom: consumePromise,
    time: 3000,
    exception: timeoutError
  });
}

module.exports = Object.freeze({
  getChannel,
  consumeAny,
  consumeCorrelated
});
