import * as Koa from 'koa'
import connection from './connection'
import router from './router'
import render from './render'

export { default as Context } from './context'
export { default as HttpStatus } from './http-status'

export default
  new Koa()
    .use(connection)
    .use(render)
    .use(router.routes())
    .use(router.allowedMethods())
