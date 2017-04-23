import * as Koa from 'koa'
import connection from './connection'
import router from './router'

export { default as Context } from './context'

export default
  new Koa()
    .use(connection)
    .use(router.routes())
    .use(router.allowedMethods())
