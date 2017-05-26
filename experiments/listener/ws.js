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
  const ws = new WebSocket(`ws://${instanceUrl}/api/v1/streaming?stream=${endpoint}?access_token=${accessToken}`)

  ws.on('open', () => console.log('open'))
  ws.on('headers', (headers, response) => console.log('headers', { headers, response }))
  ws.on('message', data => console.log('message', { data }))
  ws.on('unexpected-response', (request, response) => console.log('message', { request, response }))
  ws.on('ping', data => console.log('ping', { data }))
  ws.on('pong', data => console.log('pong', { data }))
  ws.on('error', error => console.log('error', { error }))
  ws.on('close', (code, reason) => console.log('close', { code, reason }))
}
