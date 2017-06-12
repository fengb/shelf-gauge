import * as Router from "koa-router";
import { chain, flatMap, some } from "lodash";

import ENV from "config/env";

import loadCommits from "src/job/load-commits";
import * as github from "src/service/github";
import repoSerializer from "src/serializer/repo";
import { Context } from "src/server";
import { Repo, RepoAuth } from "src/entity";
import * as secureRandom from "src/util/secure-random";

export async function githubShowAll(ctx: Context) {
  if (!ctx.state.user) {
    return ctx.redirect("/auth");
  }

  const githubRepos = await github.fetchUserRepos(ctx.state.user.githubToken);

  const repos = chain(githubRepos.data)
    .filter("permissions.admin")
    .map(g => github.toRepo(g))
    .value();

  ctx.renderSuccess("Ok", repoSerializer.serializeMany(repos));
}

export async function githubShow(ctx: Context) {
  if (!ctx.state.user) {
    return ctx.redirect("/auth");
  }

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

export async function createAuth(ctx: Context) {
  if (!ctx.state.user) {
    return ctx.redirect("/auth");
  }

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
  .get("/github", githubShowAll)
  .get("/github/:name", githubShow)
  .post("/:source/:name/auth", createAuth);
