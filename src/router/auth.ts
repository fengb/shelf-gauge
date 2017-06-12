import * as Router from "koa-router";
import { AuthenticateOptions } from "passport";

import { Context, Middleware, passport } from "src/server";
import ENV from "config/env";

const CALLBACK_REDIRECTS: AuthenticateOptions = {
  successRedirect: "/",
  failureRedirect: "/auth"
};

export async function signOut(ctx: Context) {
  ctx.logout();
  ctx.redirect("/");
}

export function oauthFor(strategy: string): Middleware {
  return passport.authenticate(strategy, CALLBACK_REDIRECTS);
}

const router = new Router()
  .redirect("/", "/auth/github")
  .get("/github", oauthFor("github"));

if (ENV.debug.oauthMock) {
  router.get("/mock", oauthFor("mock"));
}

export default router;
