import WebSocketListener from './web-socket-listener.js'
import logger from './logger.js'
import store from './session-store.js'
import * as broker from './broker.js'
import * as util from './util.js'

const connections = {}

export function watch (session) {
  const connectionId = util.connectionId(session)

  if (connections[connectionId]) {
    logger.debug(`bridge - ${connectionId} for ${session.deviceToken} already opened`)
    return
  }

  open()

  function open () {
    const listener = new WebSocketListener(session.instanceUrl, 'user', session.accessToken)
    connections[connectionId] = listener

    listener.on('open', handleOpen)
    listener.on('data', handleData)
    listener.on('error', handleError)
    listener.on('close', handleClose)
  }

  function close () {
    unwatch(session)
  }

  function handleOpen () {
    logger.debug(`bridge - ${connectionId} (re-)opened for ${session.deviceToken}`)
  }

  function handleData (message) {
    const data = JSON.parse(message)

    if (data.event !== 'notification') return

    logger.debug(`bridge - ${connectionId} received a new notification`)

    broker.publish(session, data.payload)
  }

  function handleError (error) {
    logger.debug(`bridge - ${connectionId} error : ${error.message}`)
    close()
  }

  function handleClose () {
    logger.debug(`bridge - ${connectionId} closed`)
    close()
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
