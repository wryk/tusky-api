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
  const url = `wss://${instanceUrl}/api/v1/streaming?stream=${endpoint}&access_token=${accessToken}`
  const headers = { 'Authorization': `Bearer ${accessToken}` }

  console.log(`${url} with ${headers}`)

  const es = new EventSource(`https://${instanceUrl}/api/v1/streaming/${endpoint}`, { headers })

  es.on('open', handleOpen)
  es.on('error', handleError)

  // Mastodon streaming events
  es.on('update', handleUpdate)
  es.on('notification', handleNotification)
  es.on('delete', handleDelete)

  function handleOpen (event) {
    console.log('open', event)
  }

  function handleError (event) {
    console.log('error', event)
  }

  function handleUpdate (event) {
    console.log('update', event)
  }

  function handleNotification (event) {
    console.log('notification', event)
  }

  function handleDelete (event) {
    console.log('delete', event)
  }
}
