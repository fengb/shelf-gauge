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
if (window.opener) {
  window.opener.postMessage(data, "*")
  window.close()
}
window.addEventListener("message", function(evt) {
  if (evt.data === "requestCredentials") {
    evt.source.postMessage(data, "*")
    window.close()
  }
})
</script>`;
}

export function authBy(strategy: string) {
  return passport.authenticate(strategy, { session: false });
}

const router = new Router()
  .post("/", authBy("bearer"), (ctx: Context) =>
    ctx.renderSuccess("Accepted", {})
  )
  .redirect("/", "/auth/github")
  .get("/github", authBy("github"), userSuccess);

export default router;
