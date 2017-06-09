import { expect } from "test/support";

import * as secureRandom from "src/util/secure-random";

describe("util/secure-random", () => {
  describe("base64", () => {
    it("has the right length", async () => {
      const value = await secureRandom.base64(101);
      expect(value).to.have.length(101);
    });

    it("returns correct values", async () => {
      const value = await secureRandom.base64(1000);
      expect(value).to.match(/^[a-zA-Z0-9+=/]+$/);
    });

    it("returns random values", async () => {
      const a = await secureRandom.base64(100);
      const b = await secureRandom.base64(100);
      expect(a).not.to.equal(b);
    });
  });

  describe("hex", () => {
    it("has the right length", async () => {
      const value = await secureRandom.hex(101);
      expect(value).to.have.length(101);
    });

    it("returns correct values", async () => {
      const value = await secureRandom.hex(1000);
      expect(value).to.match(/^[0-9a-f]+$/);
    });

    it("returns random values", async () => {
      const a = await secureRandom.hex(100);
      const b = await secureRandom.hex(100);
      expect(a).not.to.equal(b);
    });
  });
});
