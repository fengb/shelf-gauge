import * as Router from "koa-router";
import { Context } from "src/server";
import { Repo } from "src/entity";
import repoSerializer from "src/serializer/repo";

import * as Suite from "./suite";

export async function show(ctx: Context) {
  const repo = await ctx.conn.entityManager.findOne(Repo, {
    source: ctx.params.source,
    name: ctx.params.name
  });

  if (!repo) {
    return ctx.renderError("NotFound");
  }

  ctx.renderSuccess("Ok", repoSerializer.serialize(repo));
}

export default new Router()
  .get("/:source/:name", show)
  .get("/:source/:name/suite", Suite.showAll)
  .post("/:source/:name/suite", Suite.create);
