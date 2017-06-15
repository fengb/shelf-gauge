import { expect, db, factory, request, stub } from "test/support";
import { Repo, RepoAuth, Suite } from "src/entity";
import * as loadCommits from "src/job/load-commits";

describe("API /user/repo", () => {
  db.setup();

  describe("/github GET", () => {
    it("rejects non-user", async function() {
      const response = await request().get("/user/repo/github");
      expect(response.status).to.equal(request.HttpStatus.Error.Unauthorized);
    });

    it("returns repo data from github", async function() {
      const user = await factory.user.create();
      const response = await request()
        .get("/user/repo/github")
        .set("Authorization", `Bearer ${user.githubToken}`);

      expect(response.status).to.equal(request.HttpStatus.Success.Ok);
      expect(response.body.data).to.deep.equal([
        {
          source: "github",
          name: "shelfgauge~shelfgauge",
          url: "https://github.com/shelfgauge/shelfgauge"
        }
      ]);
    });
  });

  describe("/github/:name GET", () => {
    it("fetches an existing repo", async function() {
      const user = await factory.user.create();
      const existing = await factory.repo.create();

      const response = await request()
        .get(`/user/repo/github/${existing.name}`)
        .set("Authorization", `Bearer ${user.githubToken}`);

      expect(response.status).to.equal(request.HttpStatus.Success.Ok);
      expect(response.body.data).to.deep.equal({
        source: existing.source,
        name: existing.name,
        url: existing.url
      });
    });

    describe("missing repo", () => {
      it("returns data from github", async function() {
        const user = await factory.user.create();

        const response = await request()
          .get("/user/repo/github/shelfgauge~shelfgauge")
          .set("Authorization", `Bearer ${user.githubToken}`);

        expect(response.status).to.equal(request.HttpStatus.Success.Ok);
        expect(response.body.data).to.deep.equal({
          source: "github",
          name: "shelfgauge~shelfgauge",
          url: "https://github.com/shelfgauge/shelfgauge"
        });

        expect(stub.service.github.fetchUserRepo).to.have.been.calledWith(
          user.githubToken,
          "shelfgauge~shelfgauge"
        );
      });

      it("saves the repo", async function() {
        const user = await factory.user.create();
        const response = await request()
          .get("/user/repo/github/shelfgauge~shelfgauge")
          .set("Authorization", `Bearer ${user.githubToken}`);

        const repo = await this.conn!.entityManager.findOne(Repo, {
          name: "shelfgauge~shelfgauge"
        });

        expect(repo).to.be.ok;
      });

      it("invokes the job loadCommits", async function() {
        const user = await factory.user.create();
        const response = await request()
          .get("/user/repo/github/shelfgauge~shelfgauge")
          .set("Authorization", `Bearer ${user.githubToken}`);

        const repo = await this.conn!.entityManager.findOne(Repo, {
          name: "shelfgauge~shelfgauge"
        });

        expect(stub.job.loadCommits).to.have.been.calledWith(repo!.id);
      });
    });
  });

  describe("/:source/:name/auth POST", () => {
    it("rejects unaffiliated user", async function() {
      const user = await factory.user.create();
      const repo = await factory.repo.create();

      const response = await request()
        .post(`/user/repo/${repo.source}/${repo.name}/auth`)
        .set("Authorization", `Bearer ${user.githubToken}`);

      expect(response.status).to.equal(request.HttpStatus.Error.Forbidden);
    });

    it("returns a new auth", async function() {
      const user = await factory.user.create();
      const repo = await factory.repo.create({ users: [user] });

      const response = await request()
        .post(`/user/repo/${repo.source}/${repo.name}/auth`)
        .set("Authorization", `Bearer ${user.githubToken}`);

      expect(response.status).to.equal(request.HttpStatus.Success.Created);

      const auth = await this.conn!.entityManager.findOne(RepoAuth);
      expect(response.body.data).to.have.property("authorization");
      expect(auth!.matches(response.body.data.authorization)).to.be.true;
    });
  });
});
