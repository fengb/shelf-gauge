import { Context } from "koa";
import "src/server/render"; // TODO: fix the context
import * as Router from "koa-router";
import * as passport from "koa-passport";

import ENV from "config/env";

export function oauthFor(strategy: string) {
  return [
    passport.authenticate(strategy, { session: false }),
    (ctx: Context) => ctx.renderSuccess("Ok", ctx.state.user)
  ];
}

const router = new Router()
  .redirect("/", "/auth/github")
  .get("/github", ...oauthFor("github"));

export default router;
