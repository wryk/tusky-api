import yargs from 'yargs'
import net from 'net'
import http from 'http'
import ws from 'websocket-stream'

import { handler as apiHandler } from './api.js'
import { handler as brokerHandler } from './broker.js'

const argv = yargs
  .usage('Usage: $0 [--api-port=8080] --broker-port [num=1883] --websocket-broker-port [num=8000]')
  .default({
    apiPort: 8080,
    brokerPort: 1883,
    websocketBrokerPort: 8000
  })
  .argv

const { apiPort, brokerPort, websocketBrokerPort } = argv

const api = apiHandler()

const apiServer = http.createServer(api)
apiServer.listen(apiPort, () => console.log(`API server listening on port ${apiPort}`))

const broker = brokerHandler()

const brokerServer = net.createServer(broker)
brokerServer.listen(brokerPort, () => console.log(`MQTT server listening on port ${brokerPort}`))

// for testing purpose, I use an online MQTT client
const websocketBrokerServer = http.createServer()
ws.createServer({ server: websocketBrokerServer }, broker)
websocketBrokerServer.listen(websocketBrokerPort, () => console.log(`MQTT WebSocket server listening on port ${websocketBrokerPort}`))
