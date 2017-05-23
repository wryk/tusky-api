import net from 'net'
import http from 'http'
import ws from 'websocket-stream'

import { WEB_SERVICE_PORT, BROKER_PORT, BROKER_WEB_SOCKET_PORT } from './configuration.js'
import logger from './logger.js'
import store from './session-store.js'
import * as bridge from './bridge.js'
import * as api from './api.js'
import * as broker from './broker.js'

// watch already registered
store.findAll().then(sessions => sessions.map(bridge.watch))

// setup api
const apiServer = http.createServer(api.handler)
apiServer.listen(WEB_SERVICE_PORT, () => logger.info(`WebService listening on port ${WEB_SERVICE_PORT}`))

// setup broker
const brokerServer = net.createServer(broker.handler)
brokerServer.listen(BROKER_PORT, () => logger.info('info', `MQTT broker listening on port ${BROKER_PORT}`))

// for testing purpose, I use an online MQTT client
const websocketBrokerServer = http.createServer()
ws.createServer({ server: websocketBrokerServer }, broker.handler)
websocketBrokerServer.listen(BROKER_WEB_SOCKET_PORT, () => logger.info('info', `MQTT broker server listening on port ${BROKER_WEB_SOCKET_PORT}`))
