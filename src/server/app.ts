import * as Koa from "koa";
import { filter } from "lodash";

import * as bodyParser from "koa-bodyparser";
const logger = require("koa-logger");
const error = require("koa-error");
const session = require("koa-session");

import ENV from "config/env";
import monitor from "./monitor";
import passport from "./passport";
import connection from "./connection";
import router from "./router";
import render from "./render";

const app = new Koa();
app.keys = ENV.server.secretKeys;

const middlewares: Koa.Middleware[] = filter([
  monitor(app),
  error(),
  ENV.server.useLogger && logger(),
  bodyParser(),
  session(app),
  passport.initialize(),
  passport.session(),
  connection,
  render,
  router.routes(),
  router.allowedMethods()
]);

for (const middleware of middlewares) {
  app.use(middleware);
}

export default app;
