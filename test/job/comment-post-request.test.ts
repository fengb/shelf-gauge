import { expect, factory } from "test/support";

import * as commentPullRequest from "src/job/comment-pull-request";

describe("job/comment-post-request", () => {
  describe("testReport()", () => {
    describe("no oldTest", () => {
      it('attaches "new"', function() {
        const suite = factory.suiteTest.build();
        const report = commentPullRequest.testReport(suite);
        expect(report).to.contain("new");
      });
    });
  });
});
