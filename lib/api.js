import Koa from 'koa'
import KoaRouter from 'koa-router'
import parser from 'koa-json-body'
import compose from 'koa-compose'

import logger from './logger.js'
import store from './session-store.js'
import * as bridge from './bridge.js'

const app = new Koa()
const router = new KoaRouter()

router.post('/register', compose([validate, register]))
router.post('/unregister', compose([validate, unregister]))

app.use(parser())
app.use(router.routes())
app.use(router.allowedMethods())

export const handler = app.callback()

async function register (context, next) {
  const session = context.request.body

  var sessions = await store.findAll({
    where: session
  })

  if (!sessions.length) {
    await store.create(session)

    logger.debug(`api - session ${session.deviceToken} registered`, session)

    bridge.watch(session)
  } else {
    logger.debug(`api - attempt to register an already registered session ${session.deviceToken}`, session)
  }

  context.status = 200
}

async function unregister (context, next) {
  const session = context.request.body

  var sessions = await store.findAll({
    where: session
  })

  if (sessions.length) {
    await store.destroyAll({
      where: session
    })

    logger.debug(`api - session ${session.deviceToken} unregisted`, session)

    bridge.unwatch(session)
  } else {
    logger.debug(`api - attempt to unregister an unknow session ${session.deviceToken}`, session)
  }

  context.status = 200
}

async function validate (context, next) {
  const errors = store.validate(context.request.body)

  if (errors) {
    context.status = 400
    context.body = errors
  } else {
    await next()
  }
}
