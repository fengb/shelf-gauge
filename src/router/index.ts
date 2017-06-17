import * as Router from "koa-router";

import auth from "./auth";
import repo from "./repo";
import userRepo from "./user-repo";

export default new Router()
  .use("/auth", auth.routes(), auth.allowedMethods())
  .use("/repo", repo.routes(), repo.allowedMethods())
  .use("/user/repo", userRepo.routes(), userRepo.allowedMethods());
