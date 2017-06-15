import { Context } from "koa";
import "src/server/render"; // TODO: fix the context
import * as Router from "koa-router";
import * as passport from "koa-passport";

import { User } from "src/entity";

export function oauthFor(strategy: string) {
  return [
    passport.authenticate(strategy, { session: false }),
    (ctx: Context) => {
      const user = ctx.state.user as User;
      ctx.renderSuccess("Ok", { authorization: user.githubToken });
    }
  ];
}

const router = new Router()
  .post(
    "/",
    passport.authenticate("bearer", { session: false }),
    (ctx: Context) => ctx.renderSuccess("Accepted", {})
  )
  .redirect("/", "/auth/github")
  .get("/github", ...oauthFor("github"));

export default router;
