import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
const error = require('koa-error')
const session = require('koa-session')

import env from 'config/env'
import passport from './passport'
import connection from './connection'
import router from './router'
import render from './render'

const app = new Koa()
app.keys = env.server.secretKeys

export default app
    .use(error())
    .use(bodyParser())
    .use(session(app))
    .use(passport.initialize())
    .use(passport.session())
    .use(connection)
    .use(render)
    .use(router.routes())
    .use(router.allowedMethods())
