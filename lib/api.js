import Koa from 'koa'
import Router from 'koa-router'

import { middleware as store } from './store.js'

const app = new Koa()
export default app

const router = new Router()
router.post('/', create)
router.del('/', destroy)

app.use(store())
app.use(router.routes())
app.use(router.allowedMethods())

async function create (context, next) {
  console.log(context.state)
  console.log(context.state.store)

  await context.state.store.create({
    instanceUrl: 'mastodon.social',
    accessToken: '-',
    deviceToken: '-'
  })

  context.body = await context.state.store.count()
}

async function destroy (context, next) {
  await context.state.store.destroyAll()

  context.body = await context.state.store.count()
}
