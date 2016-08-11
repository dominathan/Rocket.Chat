let models = [RocketChat.models.Messages, RocketChat.models.Rooms, RocketChat.models.Subscriptions]

function observerObject(meteorAMQPMethod) {
  return {
    added(doc) {
      Meteor.call(meteorAMQPMethod, doc)
    },
    changed(newDoc, oldDoc) {
      Meteor.call(meteorAMQPMethod, newDoc)
    },
    removed(doc) {
      Meteor.call(meteorAMQPMethod, doc)
    }
  }
}

Meteor.startup(function() {
    RocketChat.models.Messages.find({ts: {$gt: new Date()}}).observe(observerObject('amqpSendMessage'))
    RocketChat.models.Subscriptions.find({ts: {$gt: new Date()}}).observe(observerObject('amqpSendSubscription'))
    RocketChat.models.Rooms.find({ts: {$gt: new Date()}}).observe(observerObject('amqpSendRoom'))
})
