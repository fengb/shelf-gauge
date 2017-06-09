import { find } from "lodash";
import { Context } from "src/server";
import { Repo, RepoAuth, Suite, SuiteEnv, SuiteTest } from "src/entity";

import * as Serializer from "src/util/serializer";
import commentPullRequest from "src/job/comment-pull-request";
import loadCommits from "src/job/load-commits";

const suiteSerializer = Serializer.object(Suite, {
  ref: Serializer.string(),
  name: Serializer.string(),
  pullRequest: Serializer.string(),
  ranAt: Serializer.isoDateTime(),
  createdAt: Serializer.isoDateTime(),

  env: Serializer.object(SuiteEnv, {
    source: Serializer.string({ only: SuiteEnv.SOURCES }),
    info: Serializer.string()
  }),

  tests: Serializer.objectArray(SuiteTest, {
    name: Serializer.string(),
    value: Serializer.number()
  })
});

export async function showAll(ctx: Context) {
  const repo = await ctx.conn.entityManager.findOne(Repo, {
    source: ctx.params.source,
    name: ctx.params.name
  });

  if (!repo) {
    return ctx.renderError("NotFound");
  }

  const suites = await ctx.conn.entityManager
    .createQueryBuilder(Suite, "suite")
    .innerJoin("suite.repoAuth", "auth")
    .leftJoinAndSelect("suite.env", "env")
    .leftJoinAndSelect("suite.tests", "test")
    .where("auth.repo=:repo", { repo: repo.id })
    .getMany();

  ctx.renderSuccess("Ok", suiteSerializer.serializeMany(suites));
}

export async function create(ctx: Context) {
  const repo = await ctx.conn.entityManager
    .createQueryBuilder(Repo, "repo")
    .leftJoinAndSelect("repo.auths", "auth")
    .where("repo.source=:source AND repo.name=:name", {
      source: ctx.params.source,
      name: ctx.params.name
    })
    .getOne();

  if (!repo) {
    return ctx.renderError("NotFound");
  }

  const requestAuth = String(ctx.request.body.authorization);
  const auth = find(repo.auths, auth => auth.matches(requestAuth));

  if (!auth) {
    return ctx.renderError("Forbidden");
  }

  const suite = suiteSerializer.deserialize(ctx.request.body.data);
  suite.createdAt = new Date();
  suite.repoAuth = auth;
  await ctx.conn.entityManager.persist(suite);

  loadCommits(repo, suite.ref);

  if (suite.pullRequest) {
    commentPullRequest(suite);
  }

  ctx.renderSuccess("Created", suiteSerializer.serialize(suite));
}
