import Koa from 'koa'
import Router from 'koa-router'
import jsonBodyParser from 'koa-json-body'
import compose from 'koa-compose'

import { middleware as sessionServiceMiddleware } from './session-service.js'

const app = new Koa()
export default app

const router = new Router()

app.use(jsonBodyParser({ fallback: false }))
app.use(sessionServiceMiddleware())

router.post('/register', compose([validate, register]))
router.post('/unregister', compose([validate, unregister]))
app.use(router.routes())

app.use(router.allowedMethods())

async function validate (context, next) {
  const errors = context.state.sessionService.validate(context.request.body)

  if (errors) {
    context.status = 400
    context.body = errors
  } else {
    await next()
  }
}

async function register (context, next) {
  const session = context.request.body

  var sessions = await context.state.sessionService.findAll({
    where: session
  })

  if (!sessions.length) {
    await context.state.sessionService.create(session)
  }

  console.log(await context.state.sessionService.count())

  context.status = 200
}

async function unregister (context, next) {
  const session = context.request.body

  await context.state.sessionService.destroyAll({
    where: session
  })

  console.log(await context.state.sessionService.count())

  context.status = 200
}
