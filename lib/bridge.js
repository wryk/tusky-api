import WebSocket from 'ws'

import store from './session-store.js'
import * as broker from './broker.js'
import * as util from './util.js'

const watchers = {}

export function watch (session) {
  console.log(`bridge: watch ${session.deviceToken}`)

  const id = util.id(session)

  if (watchers[id]) {
    console.log(`bridge: already watch ${session.deviceToken}`)
    return
  }

  connect()

  function connect () {
    const url = util.url(session)
    const ws = new WebSocket(url)

    watchers[id] = ws

    ws.on('message', handleMessage)
    ws.on('error', handleError)
    ws.on('close', handleClose)
  }

  function reconnect () {
    setTimeout(connect, 5000)
  }

  function close () {
    unwatch(session)
  }

  function handleMessage (message) {
    const data = JSON.parse(message)

    if (data.event !== 'notification') return

    broker.publish(session, data.payload)
  }

  function handleError (error) {
    console.log(error)
    reconnect()
  }

  function handleClose (code) {
    if (code === 1000) {
      console.log(`bridge: remote close ${session.deviceToken}`)
      close()
    } else {
      console.log(`bridge: unexpected close ${session.deviceToken}`)
      reconnect()
    }
  }
}

export async function unwatch (session) {
  console.log(`bridge: unwatch ${session.deviceToken}`)

  const id = util.id(session)
  const { instanceUrl, accessToken } = session

  const watcher = watchers[id]

  if (watcher) {
    watcher.close()
    delete watchers[id]
  }

  await store.destroyAll({ where: { instanceUrl, accessToken } })
}
