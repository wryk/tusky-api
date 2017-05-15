import aedes from 'aedes'
import mq from 'mqemitter-redis'
import persistence from 'aedes-persistence-redis'

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
  const packet = {
    cmd: 'publish',
    qos: 2,
    topic: util.topic(session),
    payload: message,
    retain: false
  }

  function done () {
    console.log(`broker: packet published ${session.deviceToken}`)
  }

  broker.publish(packet, done)
}

async function authenticate (client, username, password, done) {
  const sessions = await store.findAll({
    where: { deviceToken: client.id }
  })

  if (sessions.length > 0) {
    console.log(`authenticate ${client.id}`)

    done(null, true)
  } else {
    console.log(`reject authenticate ${client.id}`)

    const error = new Error('Unregistered client')
    error.returnCode = 2
    done(error)
  }
}

function authorizePublish (client, packet, done) {
  console.log(`reject authorizePublish ${client.id}`)

  const error = new Error('Client not allowed to publish')
  done(error)
}

async function authorizeSubscribe (client, subscription, done) {
  const sessions = await store.findAll({
    where: { deviceToken: client.id }
  })

  if (sessions.length > 0) {
    const session = sessions[0]

    if (subscription.topic === util.topic(session)) {
      console.log(`authorizeSubscribe ${client.id}`)
      done(null, subscription)
      return
    }
  }

  const error = new Error('Client not allowed to subscribe to this topic')
  done(error)
}
