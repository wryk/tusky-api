import logger from './logger.js'
import store from './session-store.js'
import * as broker from './broker.js'
import * as util from './util.js'

const WebSocket = (function () {
  try {
    return require('uws')
  } catch (e) {
    return require('ws')
  }
})()

const connections = {}
const reconnectCounts = {}
const reconnectsQueued = {}

export function watch (session) {
  const connectionId = util.connectionId(session)

  if (connections[connectionId]) {
    logger.debug(`bridge - ${connectionId} for ${session.deviceToken} already opened`)
    return
  }

  reconnectCounts[connectionId] = 0

  connect()

  function connect () {
    const url = util.url(session)
    const ws = new WebSocket(url)

    connections[connectionId] = ws

    ws.on('open', handleOpen)
    ws.on('message', handleMessage)
    ws.on('error', handleError)
    ws.on('close', handleClose)

    delete reconnectsQueued[connectionId]
  }

  function reconnect () {
    if (reconnectsQueued[connectionId]) {
      return
    }
    if (reconnectCounts[connectionId] <= 5) {
      logger.debug(`bridge - ${connectionId} reconnection`)
      setTimeout(connect, 5000)
      reconnectCounts[connectionId] += 1
    } else {
      logger.debug(`bridge - ${connectionId} hit reconnection limit. closing connection`)
      close()
    }
    reconnectsQueued[connectionId] = true
  }

  function close () {
    unwatch(session)
  }

  function handleOpen () {
    logger.debug(`bridge - ${connectionId} opened for ${session.deviceToken}`)
  }

  function handleMessage (message) {
    const data = JSON.parse(message)

    if (data.event !== 'notification') return

    logger.debug(`bridge - ${connectionId} received a new notification`)

    broker.publish(session, data.payload)
  }

  function handleError (error) {
    logger.debug(`bridge - ${connectionId} error : ${error.message}`)
    reconnect()
  }

  function handleClose (code) {
    if (code === 1000) {
      logger.debug(`bridge - ${connectionId} closed by remote`)
      close()
    } else {
      logger.debug(`bridge - ${connectionId} unexpectedly closed`)
      reconnect()
    }
  }
}

export async function unwatch (session) {
  const connectionId = util.connectionId(session)
  const { instanceUrl, accessToken } = session

  const sessions = await store.findAll({
    where: session
  })

  if (sessions.length) {
    await store.destroyAll({ where: session })
    logger.debug(`bridge - unwatch ${session.deviceToken}`)

    const remainingSessions = await store.findAll({
      where: { instanceUrl, accessToken }
    })

    if (!remainingSessions.length) {
      const connection = connections[connectionId]

      if (connection) {
        connection.close()
        delete connections[connectionId]
      }

      logger.debug(`bridge - ${connectionId} closed`)
    }
  }
}
