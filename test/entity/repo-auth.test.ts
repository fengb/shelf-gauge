import { expect, db, factory } from "test/support";
import RepoAuth from "src/entity/repo-auth";

describe("src/entity/repo-auth", () => {
  describe("key=", () => {
    db.setup();

    it("is not saved", async function() {
      const auth = await factory.repoAuth.create();
      expect(auth.key).to.be.ok;

      const fromDb = await this.conn!.entityManager.findOne(RepoAuth, {
        id: auth.id
      });
      expect(fromDb!.key).to.be.undefined;
    });

    it("sets prefix", function() {
      const auth = new RepoAuth({ key: "foo" });
      expect(auth.key.startsWith(auth.prefix)).to.be.true;
    });

    describe("encrypted", function() {
      it("is different from key", function() {
        const auth = new RepoAuth({ key: "foo" });
        expect(auth.encrypted).to.be.ok;
        expect(auth.encrypted).not.to.equal(auth.key);
      });

      it("matches key", function() {
        const auth = new RepoAuth({ key: "foo" });
        expect(auth.matches(auth.key)).to.be.true;
      });
    });
  });
});
