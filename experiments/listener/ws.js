const WebSocket = (function () {
  try {
    return require('uws')
  } catch (e) {
    return require('ws')
  }
})()

export const command = 'ws [instanceUrl] [accessToken]'

export const describe = 'listen to WebSocket Mastodon streaming API'

export const builder = {
  endpoint: {
    default: 'user',
    choices: ['user', 'public']
  }
}

export function handler ({ instanceUrl, accessToken, endpoint }) {
  const url = `wss://${instanceUrl}/api/v1/streaming?stream=${endpoint}&access_token=${accessToken}`
  console.log({ url })

  const ws = new WebSocket(url)

  ws.on('open', handleOpen)
  ws.on('headers', handleHeaders)
  ws.on('message', handleMessage)
  ws.on('unexpected-response', handleUnexpectedResponse)
  ws.on('ping', handlePing)
  ws.on('pong', handlePong)
  ws.on('error', handleError)
  ws.on('close', handleClose)

  function handleOpen () {
    console.log('open')
  }

  function handleHeaders (headers, response) {
    console.log('headers', headers, response)
  }

  function handleMessage (data) {
    console.log('message', data)
  }

  function handleUnexpectedResponse (request, response) {
    console.log('unexpected-response', request, response)
  }

  function handlePing (data) {
    console.log('ping', data)
  }

  function handlePong (data) {
    console.log('pong', data)
  }

  function handleError (error) {
    console.log('error', error)
  }

  function handleClose (code, reason) {
    console.log('close', { code, reason })
  }
}
