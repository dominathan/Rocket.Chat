amqp = Npm.require('amqp');

let exchange = 'rocket-chat-pubnub-integration';
let queueName = 'rocket-chat-pubnub-queue';
let queueKey = 'bohemian';
let options = {
  url: Meteor.settings.rabbitMQ.url
}

Meteor.startup(() => {
  let connection = amqp.createConnection(options,{defaultExchangeName: exchange});

  connection.on('error', (err) => console.log('OH SHIT: ', err))

  connection.on('ready', () => {
    var ex = connection.exchange(exchange,
      { type: 'topic', durable: 'true', autoDelete: false },
      (openExchange) => {
      console.log('connected to exchange');

      Meteor.methods({
        'amqpSendRoom': function(room) {
          openExchange.publish('room', room, { contentType: 'application/json' })
        },
        'amqpSendMessage': function(message) {
          openExchange.publish('message', message, { contentType: 'application/json' })
        },
        'amqpSendSubscription': function(subscription) {
          openExchange.publish('subscription', subscription, { contentType: 'application/json' })
        }
      })
    });

    connection.queue(queueName, { durable: true, autoDelete: false  }, function(q) {
      q.bind(exchange, 'room');
      console.log('BINDING TO exhange and queue: Room')
    })

    connection.queue(queueName, { durable: true, autoDelete: false  }, function(q) {
      q.bind(exchange, 'message');
      console.log('BINDING TO exhange and queue: Message')
    })

    connection.queue(queueName, { durable: true, autoDelete: false  }, function(q) {
      q.bind(exchange, 'subscription');
      console.log('BINDING TO exhange and queue: Subscription')
    })

  })

})
