import aedes from 'aedes'
import mq from 'mqemitter-redis'
import persistence from 'aedes-persistence-redis'

import configuration from './config.js'
import * as format from './format.js'

// AEDES (see https://github.com/mcollina/aedes#aedesopts)
// client (https://github.com/mcollina/aedes#client | impl: https://github.com/mcollina/aedes/blob/master/lib/client.js)
// packet (https://github.com/mqttjs/mqtt-packet | impl: https://github.com/mcollina/aedes-packet/blob/master/packet.js)

const broker = aedes({
  mq: mq(configuration.redis),
  persistence: persistence(configuration.redis),
  concurrency: 100,
  heartbeatInterval: 6000,
  authenticate,
  authorizePublish,
  authorizeSubscribe,
  authorizeForward
})

export function handler () {
  return broker.handle
}

function authenticate (client, username, password, done) {
  console.log(`authenticate ${format.client(client)}`)
  done(null, true)
}

function authorizePublish (client, packet, done) {
  console.log(`authorizePublish ${format.client(client)} ${format.packet(packet)}`)
  done(null)
}

function authorizeSubscribe (client, subscription, done) {
  console.log(`authorizeSubscribe ${format.client(client)} on ${subscription.topic}`)
  done(null, subscription)
}

function authorizeForward (clientId, packet) {
  console.log(`authorizeForward Client(id="${clientId}") ${format.packet(packet)}`)
  return packet
}

broker.on('client', client => console.log())
broker.on('clientDisconnect', client => console.log(`clientDisconnect ${format.client(client)}`))
broker.on('clientError', (client, error) => console.log(`clientError ${format.client(client)} ${error.message}`))
broker.on('keepaliveTimeout', (client, error) => console.log(`keepaliveTimeout ${format.client(client)}`))
broker.on('publish', (packet, client) => {
  if (client) {
    console.log(`publish ${format.client(client)} ${format.packet(packet)}`)
  }
})
