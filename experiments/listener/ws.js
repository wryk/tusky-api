import WebSocketListener from '../../lib/web-socket-listener'

export const command = 'ws [instanceUrl] [accessToken]'

export const describe = 'listen to WebSocket Mastodon streaming API'

export const builder = {
  endpoint: {
    default: 'user',
    choices: ['user', 'public']
  }
}

export function handler ({ instanceUrl, accessToken, endpoint }) {
  const listener = new WebSocketListener(instanceUrl, endpoint, accessToken)

  listener.on('open', () => console.log('listener.open'))
  listener.on('data', data => console.log('listener.data', JSON.parse(data).event))
  listener.on('error', error => console.log('listener.error', error))
  listener.on('close', () => console.log('listener.close'))
}
