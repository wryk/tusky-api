import EventSource from 'eventsource'

export const command = 'sse [instanceUrl] [accessToken]'

export const describe = 'listen to SSE Mastodon streaming API'

export const builder = {
  endpoint: {
    default: 'user',
    choices: ['user', 'public']
  }
}

export function handler ({ instanceUrl, accessToken, endpoint }) {
  // Mastodon SSE streaming doesn't allow access token in query parameters until https://github.com/tootsuite/mastodon/pull/3208
  // Used EventSource implementation allow custom headers while native EventSource implementation doesn't allow it and so can't use Mastodon SSE streaming API
  // Authorization header is used instead of query parameter for comptability with oldest Mastodon instances
  const es = new EventSource(`https://${instanceUrl}/api/v1/streaming/${endpoint}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  })

  es.on('open', event => console.log('open', { event }))
  es.on('error', event => console.log('error', { event }))

  // Mastodon streaming events
  es.on('update', event => console.log('update', { event }))
  es.on('notification', event => console.log('notification', { event }))
  es.on('delete', event => console.log('delete', { event }))
}
