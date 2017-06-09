import { expect, db, factory } from "test/support";

import * as loadCommits from "src/job/load-commits";
import { RepoCommit } from "src/entity";

describe("job/load-commits", () => {
  describe("upsert()", () => {
    db.setup();

    it("sets the id", async function() {
      const commit = factory.repoCommit.build();
      await loadCommits.upsert([commit]);

      expect(commit.id).to.be.ok;
    });

    it("saves the commits", async function() {
      const commit = factory.repoCommit.build();
      await loadCommits.upsert([commit]);

      const fromDb = await this.conn!.entityManager.findOne(RepoCommit);
      expect(fromDb).to.containSubset({
        ref: commit.ref,
        parent: commit.parent
      });
    });

    it("reuses existing commits", async function() {
      const existing = await factory.repoCommit.create();
      const commit = factory.repoCommit.build({
        ref: existing.ref,
        parent: existing.parent
      });
      await loadCommits.upsert([commit]);

      expect(commit.id).to.equal(existing.id);
    });
  });
});
