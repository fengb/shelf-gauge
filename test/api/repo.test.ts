import { expect, db, stub, factory, server, HttpStatus } from "test/support";
import { Repo, RepoAuth, Suite, SuiteEnv, SuiteTest } from "src/entity";

function asJson(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

describe("API /repo", () => {
  db.setup();

  describe("/:source/:name GET", () => {
    it("returns the repo data", async function() {
      const repo = await factory.repo.create();
      const response = await server
        .request()
        .get(`/repo/${repo.source}/${repo.name}`);

      expect(response.status).to.equal(HttpStatus.Success.Ok);
      expect(response.body.data).to.deep.equal({
        url: repo.url,
        source: repo.source,
        name: repo.name
      });
    });
  });

  describe("/:source/:name/suite GET", () => {
    it("shows empty data", async function() {
      const repo = await factory.repo.create();
      const response = await server
        .request()
        .get(`/repo/${repo.source}/${repo.name}/suite`);

      expect(response.status).to.equal(HttpStatus.Success.Ok);
      expect(response.body.data).to.deep.equal([]);
    });

    it("shows existing suite", async function() {
      const suite = await factory.suite.create();
      const repo = suite.repoAuth.repo;
      const response = await server
        .request()
        .get(`/repo/${repo.source}/${repo.name}/suite`);

      expect(response.status).to.equal(HttpStatus.Success.Ok);
      expect(response.body.data).to.containSubset([
        {
          ref: suite.ref,
          name: suite.name,
          env: { source: suite.env.source },
          tests: suite.tests.map(t => {
            return { name: t.name, value: t.value };
          })
        }
      ]);
    });
  });

  describe("/:source/:name/suite POST", () => {
    const data = {
      ref: "abc123",
      name: "master",
      ranAt: new Date(),
      env: { source: "travis", info: "nooooooo" },
      tests: [{ name: "index", value: 13.5 }, { name: "haste", value: 0.125 }]
    };

    it("returns 403 on missing auth", async function() {
      const auth = await factory.repoAuth.create();

      const response = await server
        .request()
        .post(`/repo/${auth.repo.source}/${auth.repo.name}/suite`)
        .send({ data });

      expect(response.status).to.equal(HttpStatus.Error.Forbidden);
    });

    it("returns the suite data", async function() {
      const auth = await factory.repoAuth.create();

      const response = await server
        .request()
        .post(`/repo/${auth.repo.source}/${auth.repo.name}/suite`)
        .send({
          data,
          authorization: auth.key
        });

      expect(response.status).to.equal(HttpStatus.Success.Created);
      expect(response.body.data).to.containSubset(asJson(data));
    });

    it("saves the objects", async function() {
      const auth = await factory.repoAuth.create();

      const response = await server
        .request()
        .post(`/repo/${auth.repo.source}/${auth.repo.name}/suite`)
        .send({
          data,
          authorization: auth.key
        });

      const suite = await this.conn!.entityManager
        .createQueryBuilder(Suite, "suite")
        .leftJoinAndSelect("suite.env", "env")
        .leftJoinAndSelect("suite.tests", "test")
        .getOne();

      expect(suite!).to.containSubset({
        ref: data.ref,
        name: data.name
      });

      expect(suite!.env).to.containSubset(data.env);
      expect(suite!.tests).to.containSubset(data.tests);
    });

    it("attempts to load commits", async function() {
      const auth = await factory.repoAuth.create();

      const response = await server
        .request()
        .post(`/repo/${auth.repo.source}/${auth.repo.name}/suite`)
        .send({
          data,
          authorization: auth.key
        });

      expect(stub.job.loadCommits).to.be.calledWithMatch(
        auth.repo.id,
        data.ref
      );
    });
  });
});
