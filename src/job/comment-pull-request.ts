import { Suite, SuiteTest } from "src/entity";

import * as github from "src/service/github";
import { connect, Connection } from "src/server/connection";
import { keyBy, map } from "lodash";

function suiteBuilder(conn: Connection) {
  return conn.entityManager
    .createQueryBuilder(Suite, "suite")
    .innerJoinAndSelect("suite.repoAuth", "repoAuth")
    .innerJoinAndSelect("repoAuth.repo", "repo")
    .leftJoinAndSelect("suite.env", "env")
    .leftJoinAndSelect("suite.tests", "tests");
}

export function suiteReport(suite: Suite, oldSuite?: Suite): string {
  const oldTestLookup = oldSuite ? keyBy(oldSuite.tests, "name") : {};
  const lines = [
    "Test suite:",
    ...map(suite.tests, t => testReport(t, oldTestLookup[t.name]))
  ];
  return lines.join("\n");
}

export function testReport(test: SuiteTest, oldTest?: SuiteTest): string {
  const suffix = oldTest ? "old" : "new";
  return `${test.name}: ${test.value} — ${suffix}`;
}

export function doGithub(suite: Suite, report: string): Promise<any> {
  return github.postComment(suite.repo.name, Number(suite.pullRequest), report);
}

export default async function(suiteId: number) {
  const conn = await connect();
  const suite = await suiteBuilder(conn)
    .where("suite.id=:id", { id: suiteId })
    .getOne();

  if (!suite) {
    return Promise.reject(new Error(`Cannot find Suite<id: ${suiteId}>`));
  }

  const masterSuite = await suiteBuilder(conn)
    .where("suite.name=:name AND repo.id=:repo", {
      name: "master",
      repo: suite.repo.id
    })
    .orderBy('"createdAt"', "DESC")
    .getOne();

  const report = suiteReport(suite, masterSuite);

  switch (suite.repo.source) {
    case "github":
      return doGithub(suite, report);
    default:
      return Promise.reject(
        new Error(`Cannot comment for Suite<id: ${suite.id}>`)
      );
  }
}
