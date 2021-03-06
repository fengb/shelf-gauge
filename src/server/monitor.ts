import * as Koa from "koa";
const Rollbar = require("rollbar");

import ENV from "config/env";

function rollbar(app: Koa, accessToken: string) {
  const rollbar = new Rollbar({
    accessToken: accessToken,
    environment: ENV.nodeEnv,
    handleUncaughtExceptions: true,
    handleUnhandledRejections: true
  });

  app.on("error", (err: Error, ctx: Koa.Context) => {
    rollbar.error(err, ctx.request);
  });

  return async function(ctx: Koa.Context, next: () => Promise<any>) {
    try {
      return await next();
    } catch (err) {
      rollbar.error(err, ctx.request);
    }
  };
}

export default (app: Koa): Koa.Middleware | undefined => {
  if (ENV.monitor.rollbarToken) {
    return rollbar(app, ENV.monitor.rollbarToken);
  }
};
