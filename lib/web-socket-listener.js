import EventEmitter from 'events'

const WebSocket = (function () {
  try {
    return require('uws')
  } catch (e) {
    return require('ws')
  }
})()

export default class WebSocketListener extends EventEmitter {
  constructor (instanceUrl, endpoint, accessToken) {
    super()

    this._instanceUrl = instanceUrl
    this._endpoint = endpoint
    this._accessToken = accessToken

    this._originalUrl = `wss://${instanceUrl}/api/v1/streaming?stream=${endpoint}&access_token=${accessToken}`
    this._url = this._originalUrl

    this._socket = null

    this._retryTimeoutId = null
    this._retryCounter = 10
    this._minimumRetryCounter = 0
    this._maximumRetryCounter = 10
    this._minimumRetryDelay = 5000 // 5s
    this._maximumRetryDelay = 60000 // 60s

    this._open()
  }

  _open () {
    if (this._socket) {
      throw new Error('already opened listener')
    }

    this._socket = new WebSocket(this._url)

    this._socket.on('open', () => {
      this.emit('open')
    })

    this._socket.on('message', message => {
      console.log('message', message)
      this.emit('data', message)
    })

    this._socket.on('unexpected-response', (request, response) => {
      console.log('unexpected-response', response.statusCode)

      if (response.statusCode === 401) {
        this._close()
        return
      }

      // follow redirect should be another kind of retryable (separate counter etc)
      if (response.statusCode === 301) {
        if (response.headers.location) {
          this._url = response.headers.location

          this._retry()
          return
        }
      }

      // default case we retry
      this._retry()
    })

    this._socket.on('error', error => {
      console.log('error', error.message)

      this._retry()
    })

    this._socket.on('close', (code, reason) => {
      console.log('close', code, reason)

      if (code === 1000) {
        this._close()
      } else {
        this._retry()
      }
    })
  }

  _close () {
    this._cleanup()

    console.log('closed emitted')
    this.emit('close')
  }

  _cleanup () {
    console.log('cleanup')

    if (this._socket) {
      try {
        this._socket.close()
      } catch (error) {
        console.log(`socket cleanup error : ${error.message}`)
      } finally {
        delete this._socket
      }
    }

    if (this._retryTimeoutId) {
      clearTimeout(this._retryTimeoutId)
      delete this._retryTimeoutId
    }
  }

  _retry () {
    this._cleanup()

    if (--this._retryCounter) {
      console.log('retry scheduled')
      const delay = this._minimumRetryDelay // should use non linear algo

      this._retryTimeoutId = setTimeout(() => {
        console.log('timeout done, retrying')
        this._open()
      }, delay)
    } else {
      console.log('no more retry attempts available')
      this._close()
    }
  }

  close () {
    this._close()
  }
}
