import aedes from 'aedes'
import mq from 'mqemitter-redis'
import persistence from 'aedes-persistence-redis'

import logger from './logger.js'
import store from './session-store.js'
import { REDIS_BROKER_EMITTER_URL, REDIS_BROKER_PERSISTENCE_URL } from './configuration.js'
import * as util from './util.js'

const broker = aedes({
  mq: mq({ url: REDIS_BROKER_EMITTER_URL }),
  persistence: persistence({ url: REDIS_BROKER_PERSISTENCE_URL }),
  authenticate,
  authorizePublish,
  authorizeSubscribe
})

export const handler = broker.handle

export function publish (session, message) {
  const topic = util.topic(session)

  const packet = {
    cmd: 'publish',
    qos: 2,
    topic: topic,
    payload: message,
    retain: false
  }

  function done () {
    logger.debug(`broker - packet published to ${topic}`)
  }

  broker.publish(packet, done)
}

async function authenticate (client, username, password, done) {
  const sessions = await store.findAll({
    where: { deviceToken: client.id }
  })

  if (sessions.length > 0) {
    logger.debug(`broker - ${client.id} authenticated`)

    done(null, true)
  } else {
    logger.debug(`broker - ${client.id} authentication rejected, unregistered client`)

    const error = new Error('Unregistered client')
    error.returnCode = 2
    done(error)
  }
}

function authorizePublish (client, packet, done) {
  logger.debug(`broker - ${client.id} publish rejected`)

  const error = new Error('Client not allowed to publish')
  done(error)
}

async function authorizeSubscribe (client, subscription, done) {
  const sessions = await store.findAll({
    where: { deviceToken: client.id }
  })

  if (sessions.length > 0) {
    const session = sessions[0]
    const sessionTopic = util.topic(session)

    if (subscription.topic === sessionTopic) {
      logger.debug(`broker - ${client.id} subscripted to ${subscription.topic}`)

      done(null, subscription)
      return
    }
  }

  logger.debug(`broker - ${client.id} subscription to ${subscription.topic} rejected`)
  const error = new Error('Client not allowed to subscribe to this topic')
  done(error)
}
