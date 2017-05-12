import { Mapper, Schema } from 'js-data'
import { SqlAdapter } from 'js-data-sql'

import sessionJsonSchema from './session-schema.json'

const sessionSchema = new Schema(sessionJsonSchema)

const sessionService = new Mapper({
  name: 'session',
  schema: sessionSchema
})

const sqlAdapter = new SqlAdapter({
  knexOpts: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    }
  }
})

sessionService.registerAdapter('sql', sqlAdapter, { default: true })

export function middleware () {
  return async function store (context, next) {
    // TODO: move table initialization in better place
    await sqlAdapter.knex.schema.createTableIfNotExists('session', function (table) {
      table.increments('id').primary()
      table.string('instanceUrl')
      table.string('accessToken')
      table.string('deviceToken')
    })

    context.state.store = sessionService

    await next()
  }
}
