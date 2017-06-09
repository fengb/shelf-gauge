import { Suite } from "src/entity";

import * as github from "src/service/github";
import { connect } from "src/server/connection";
import { chain, map } from "lodash";

export async function generateReport(suite: Suite): Promise<string> {
  const conn = await connect();
  const masterSuite = await conn.entityManager
    .createQueryBuilder(Suite, "suite")
    .innerJoinAndSelect("suite.repoAuth", "repoAuth")
    .leftJoinAndSelect("suite.env", "env")
    .leftJoinAndSelect("suite.tests", "tests")
    .where("suite.name=:name AND repoAuth.repo=:repo", {
      name: "master",
      repo: suite.repo.id
    })
    .orderBy("createdAt", "DESC")
    .getOne();

  const lines = [
    "Test suite:",
    ...map(suite.tests, t => `${t.name}: ${t.value}`)
  ];
  return lines.join("\n");
}

export async function doGithub(suite: Suite) {
  return github.postComment(
    suite.repo.name,
    Number(suite.pullRequest),
    await generateReport(suite)
  );
}

export default function(suite: Suite) {
  switch (suite.repo.source) {
    case "github":
      return doGithub(suite);
    default:
      return Promise.reject(new Error(`Cannot comment for Suite<${suite.id}>`));
  }
}
