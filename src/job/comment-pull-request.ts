import { Suite } from "src/entity";

import * as github from "src/service/github";
import { connect, Connection } from "src/server/connection";
import { chain, map } from "lodash";

function suiteBuilder(conn: Connection) {
  return conn.entityManager
    .createQueryBuilder(Suite, "suite")
    .innerJoinAndSelect("suite.repoAuth", "repoAuth")
    .innerJoinAndSelect("repoAuth.repo", "repo")
    .leftJoinAndSelect("suite.env", "env")
    .leftJoinAndSelect("suite.tests", "tests");
}

export async function generateReport(suite: Suite): Promise<string> {
  const conn = await connect();
  const masterSuite = await suiteBuilder(conn)
    .where("suite.name=:name AND repo.id=:repo", {
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

export default async function(suiteId: number) {
  const conn = await connect();
  const suite = await suiteBuilder(conn)
    .where("suite.id=:id", { id: suiteId })
    .getOne();

  if (!suite) {
    return Promise.reject(new Error(`Cannot find Suite<id: ${suiteId}>`));
  }

  switch (suite.repo.source) {
    case "github":
      return doGithub(suite);
    default:
      return Promise.reject(
        new Error(`Cannot comment for Suite<id: ${suite.id}>`)
      );
  }
}
