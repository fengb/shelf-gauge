import { expect, factory } from "test/support";

import * as commentPullRequest from "src/job/comment-pull-request";

describe("job/comment-post-request", () => {
  describe("testReport()", () => {
    describe("no oldTest", () => {
      it('attaches "new"', function() {
        const suite = factory.suiteTest.build();
        const report = commentPullRequest.testReport(suite);
        expect(report).to.deep.equal([
          suite.name,
          String(suite.value),
          "_new_"
        ]);
      });
    });

    describe("with oldTest", () => {
      it("shows reductions", function() {
        const oldSuite = factory.suiteTest.build();
        const suite = factory.suiteTest.build({ value: 0.9 * oldSuite.value });
        const report = commentPullRequest.testReport(suite, oldSuite);
        expect(report).to.deep.equal([
          suite.name,
          String(suite.value),
          "-10.00%"
        ]);
      });

      it("shows increases", function() {
        const oldSuite = factory.suiteTest.build();
        const suite = factory.suiteTest.build({ value: 1.05 * oldSuite.value });
        const report = commentPullRequest.testReport(suite, oldSuite);
        expect(report).to.deep.equal([
          suite.name,
          String(suite.value),
          "+5.00%"
        ]);
      });
    });
  });
});
