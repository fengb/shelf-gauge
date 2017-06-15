import { Context } from "koa";
import * as Router from "koa-router";
import * as passport from "koa-passport";

import ENV from "config/env";

export async function signOut(ctx: Context) {
  ctx.logout();
  ctx.redirect("/");
}

export function oauthFor(strategy: string) {
  return [
    passport.authenticate(strategy, { session: false }),
    (ctx: Context) => (ctx.body = JSON.stringify((ctx.req as any).user))
  ];
}

const router = new Router()
  .redirect("/", "/auth/github")
  .get("/github", ...oauthFor("github"));

if (ENV.debug.oauthMock) {
  router.get("/mock", ...oauthFor("mock"));
}

export default router;
