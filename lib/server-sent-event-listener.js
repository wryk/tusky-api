import EventEmitter from 'events'

export default class EventSourceListener extends EventEmitter {
  constructor (instanceUrl, endpoint, accessToken) {
    super()

    throw new Error('not yet implemented')

    // this.instanceUrl = instanceUrl
    // this.accessToken = accessToken
    // this.endpoint = endpoint
    //
    // this.originalUrl = `https://${instanceUrl}/api/v1/streaming/${endpoint}`
    //
    // this.source = null
  }
}
