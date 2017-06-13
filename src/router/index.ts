import * as Router from "koa-router";

import auth from "./auth";
import repo from "./repo";
import userRepo from "./user-repo";

import * as view from "src/view";

export default new Router()
  .get("/", view.index)
  .use("/auth", auth.routes(), auth.allowedMethods())
  .use("/repo", repo.routes(), repo.allowedMethods())
  .use("/user/repo", userRepo.routes(), userRepo.allowedMethods());
