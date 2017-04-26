import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
const convert = require('koa-convert')
const error = require('koa-error')
const session = require('koa-generic-session')

import passport from './passport'
import connection from './connection'
import router from './router'
import render from './render'

const app
  = new Koa()
    .use(error())
    .use(bodyParser())
    .use(convert(session()))
    .use(passport.initialize())
    .use(passport.session())
    .use(connection)
    .use(render)
    .use(router.routes())
    .use(router.allowedMethods())

app.keys = process.env.SHELF_GAUGE_SECRET_KEYS.split(' ')

export default app
