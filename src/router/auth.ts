import { Context } from "koa";
import "src/server/render"; // TODO: fix the context
import * as Router from "koa-router";
import * as passport from "koa-passport";

import { User } from "src/entity";

export function userSuccess(ctx: Context) {
  const user = ctx.state.user as User;
  const data = { authorization: user.githubToken };

  ctx.type = "html";
  ctx.body = `\
<script>
var data = ${JSON.stringify(data)}
window.addEventListener("message", function(evt) {
  switch (evt.data) {
    case "acknowledged": return window.close()
    case "requestCredentials": return evt.source.postMessage(data, "*")
  }
})
if (window.opener) {
  window.opener.postMessage(data, "*")
}
</script>`;
}

export function oauthFor(strategy: string) {
  return [passport.authenticate(strategy, { session: false }), userSuccess];
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
