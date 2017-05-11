import yargs from 'yargs'
import net from 'net'
import http from 'http'
import ws from 'websocket-stream'

import mqtt from './mqtt.js'

const argv = yargs
  .usage('Usage: $0 --net-port [num=1883] --http-port [num=8000]')
  .default({
    netPort: 1883,
    httpPort: 8000
  })
  .argv

const { netPort, httpPort } = argv

// NET SERVER
const netServer = net.createServer(mqtt.handle)
netServer.listen(netPort, () => console.log(`MQTT server listening on port ${netPort}`))

// HTTP/WS SERVER
const httpServer = http.createServer()
ws.createServer({ server: httpServer }, mqtt.handle)
httpServer.listen(httpPort, () => console.log(`MQTT WebSocket server listening on port ${httpPort}`))
