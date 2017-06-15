import * as Router from "koa-router";
import * as passport from "koa-passport";
import { chain, flatMap, some } from "lodash";

import ENV from "config/env";

import loadCommits from "src/job/load-commits";
import * as github from "src/service/github";
import repoSerializer from "src/serializer/repo";
import { Repo, RepoAuth } from "src/entity";
import * as secureRandom from "src/util/secure-random";

export async function githubShowAll(ctx: any) {
  const githubRepos = await github.fetchUserRepos(ctx.state.user.githubToken);

  const repos = chain(githubRepos.data)
    .filter("permissions.admin")
    .map(g => github.toRepo(g))
    .value();

  ctx.renderSuccess("Ok", repoSerializer.serializeMany(repos));
}

export async function githubShow(ctx: any) {
  let repo = await ctx.conn.entityManager.findOne(Repo, {
    source: "github",
    name: ctx.params.name
  });

  if (!repo) {
    const response = await github.fetchUserRepo(
      ctx.state.user.githubToken,
      ctx.params.name
    );

    if (!response.data.permissions.admin) {
      return ctx.renderError("UnprocessableEntity");
    }

    repo = github.toRepo(response.data, {
      users: [ctx.state.user]
    });

    await ctx.conn.entityManager.persist(repo);

    loadCommits(repo.id);
  }

  ctx.renderSuccess("Ok", repoSerializer.serialize(repo));
}

export async function createAuth(ctx: any) {
  const repo = await ctx.conn.entityManager
    .createQueryBuilder(Repo, "repo")
    .leftJoinAndSelect("repo.users", "user")
    .where("repo.source=:source AND repo.name=:name", {
      source: ctx.params.source,
      name: ctx.params.name
    })
    .getOne();

  if (!repo) {
    return ctx.renderError("NotFound");
  }

  if (!some(repo.users, { id: ctx.state.user.id })) {
    return ctx.renderError("Forbidden");
  }

  const auth = new RepoAuth({
    key: await secureRandom.base64(40),
    repo: repo
  });

  await ctx.conn.entityManager.persist(auth);

  ctx.renderSuccess("Created", {
    authorization: auth.key,
    method: "POST",
    url: `${ENV.server.baseUrl}/repo/${repo.source}/${repo.name}/suite`
  });
}

export default new Router()
  .use(passport.authenticate("bearer", { session: false }))
  .get("/github", githubShowAll)
  .get("/github/:name", githubShow)
  .post("/:source/:name/auth", createAuth);
