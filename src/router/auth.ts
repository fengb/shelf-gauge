import { Context } from "koa";
import * as Router from "koa-router";
import * as passport from "koa-passport";

import ENV from "config/env";

const CALLBACK_REDIRECTS = {
  successRedirect: "/",
  failureRedirect: "/auth"
};

export async function signOut(ctx: Context) {
  ctx.logout();
  ctx.redirect("/");
}

export function oauthFor(strategy: string) {
  return passport.authenticate(strategy, CALLBACK_REDIRECTS);
}

const router = new Router()
  .redirect("/", "/auth/github")
  .get("/github", oauthFor("github"));

if (ENV.debug.oauthMock) {
  router.get("/mock", oauthFor("mock"));
}

export default router;
