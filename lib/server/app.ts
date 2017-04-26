import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
const convert = require('koa-convert')
const error = require('koa-error')
const session = require('koa-generic-session')

import passport from './passport'
import connection from './connection'
import router from './router'
import render from './render'

export default
  new Koa()
    .use(error())
    .use(bodyParser())
    .use(convert(session()))
    .use(passport.initialize())
    .use(passport.session())
    .use(connection)
    .use(render)
    .use(router.routes())
    .use(router.allowedMethods())
