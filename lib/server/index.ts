import * as Koa from 'koa'
import router from './router'

export default
  new Koa()
    .use(router.routes())
    .use(router.allowedMethods())
