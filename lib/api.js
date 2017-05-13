import Koa from 'koa'
import Router from 'koa-router'
import jsonBodyParser from 'koa-json-body'
import compose from 'koa-compose'

import sessionService from './session-service.js'

const api = new Koa()
export default api

export function handler () {
  return api.callback()
}

const router = new Router()

api.use(jsonBodyParser())
router.post('/register', compose([validate, register]))
router.post('/unregister', compose([validate, unregister]))
api.use(router.routes())
api.use(router.allowedMethods())

async function validate (context, next) {
  const errors = sessionService.validate(context.request.body)

  if (errors) {
    context.status = 400
    context.body = errors
  } else {
    await next()
  }
}

async function register (context, next) {
  const session = context.request.body

  var sessions = await sessionService.findAll({
    where: session
  })

  if (!sessions.length) {
    await sessionService.create(session)
  }

  console.log(await sessionService.count())

  context.status = 200
}

async function unregister (context, next) {
  const session = context.request.body

  await sessionService.destroyAll({
    where: session
  })

  console.log(await sessionService.count())

  context.status = 200
}
