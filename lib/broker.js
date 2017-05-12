import aedes from 'aedes'
import mq from 'mqemitter'
import persistence from 'aedes-persistence'

import * as format from './format.js'

// AEDES (see https://github.com/mcollina/aedes#aedesopts)
// client (https://github.com/mcollina/aedes#client | impl: https://github.com/mcollina/aedes/blob/master/lib/client.js)
// packet (https://github.com/mqttjs/mqtt-packet | impl: https://github.com/mcollina/aedes-packet/blob/master/packet.js)

const mqtt = aedes({
  mq: mq(), // in-memory implementation, only for prototype
  persistence: persistence(), // in-memory implementation, only for prototype
  concurrency: 100,
  heartbeatInterval: 6000,
  authenticate,
  authorizePublish,
  authorizeSubscribe,
  authorizeForward
})

export default mqtt

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

mqtt.on('client', client => console.log())
mqtt.on('clientDisconnect', client => console.log(`clientDisconnect ${format.client(client)}`))
mqtt.on('clientError', (client, error) => console.log(`clientError ${format.client(client)} ${error.message}`))
mqtt.on('keepaliveTimeout', (client, error) => console.log(`keepaliveTimeout ${format.client(client)}`))
mqtt.on('publish', (packet, client) => {
  if (client) {
    console.log(`publish ${format.client(client)} ${format.packet(packet)}`)
  }
})
