import { Mapper } from 'js-data'
import { RedisAdapter } from 'js-data-redis'

import { REDIS_STORE_URL } from './configuration.js'
import schema from './session-schema.json'

const mapper = new Mapper({
  name: 'session',
  schema
})

const adapter = new RedisAdapter({ url: REDIS_STORE_URL })
mapper.registerAdapter('redis', adapter, { default: true })

export default mapper
