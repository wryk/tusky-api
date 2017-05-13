import { Mapper } from 'js-data'
import { RedisAdapter } from 'js-data-redis'

import configuration from './config'
import sessionSchema from './session-schema.json'

const sessionService = new Mapper({
  name: 'session',
  schema: sessionSchema
})

const redisAdapter = new RedisAdapter(configuration.redis)

sessionService.registerAdapter('redis', redisAdapter, { default: true })

export default sessionService
