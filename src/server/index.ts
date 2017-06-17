import * as Koa from "koa";
import { filter } from "lodash";

import * as bodyParser from "koa-bodyparser";
import * as cors from "kcors";
const logger = require("koa-logger");
const error = require("koa-error");

import ENV from "config/env";
import monitor from "./monitor";
import passport from "./passport";
import connection from "./connection";
import router from "../router";
import render from "./render";

const app = new Koa();
app.keys = ENV.server.secretKeys;

const middlewares: Koa.Middleware[] = filter([
  monitor(app),
  cors({ origin: ENV.server.corsOrigin }),
  error(),
  ENV.server.useLogger && logger(),
  bodyParser(),
  passport.initialize(),
  connection,
  render,
  router.routes(),
  router.allowedMethods()
]);

for (const middleware of middlewares) {
  app.use(middleware);
}

export default app;
