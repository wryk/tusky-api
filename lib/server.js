import yargs from 'yargs'
import net from 'net'
import http from 'http'
import ws from 'websocket-stream'

import api from './api.js'
import mqtt from './mqtt.js'

const argv = yargs
  .usage('Usage: $0 [--api-port=8080] --mqtt-port [num=1883] --mqtt-websocket-port [num=8000]')
  .default({
    apiPort: 8080,
    mqttPort: 1883,
    mqttWebsocketPort: 8000
  })
  .argv

const { apiPort, mqttPort, mqttWebsocketPort } = argv

const apiServer = http.createServer(api.callback())
apiServer.listen(apiPort, () => console.log(`API server listening on port ${apiPort}`))

const mqttServer = net.createServer(mqtt.handle)
mqttServer.listen(mqttPort, () => console.log(`MQTT server listening on port ${mqttPort}`))

// for testing purpose, I use an online MQTT client
const mqttWebsocketServer = http.createServer()
ws.createServer({ server: mqttWebsocketServer }, mqtt.handle)
mqttWebsocketServer.listen(mqttWebsocketPort, () => console.log(`MQTT WebSocket server listening on port ${mqttWebsocketPort}`))
