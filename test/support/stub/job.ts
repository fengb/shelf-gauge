import * as commentPullRequest from "src/job/comment-pull-request";
import * as loadCommits from "src/job/load-commits";

export default function stub(sinon: sinon.SinonSandbox) {
  return {
    commentPullRequest: sinon.stub(commentPullRequest, "default"),
    loadCommits: sinon.stub(loadCommits, "default")
  };
}
