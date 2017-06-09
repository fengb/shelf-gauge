import * as sinon from "sinon";
import { values } from "lodash";

import * as service from "src/service/github";

const REPOS: { [key: string]: any } = {
  "octocat~Hello-World": require("./octocat~Hello-World.json"),
  "shelfgauge~shelfgauge": require("./shelfgauge~shelfgauge.json")
};

const COMMITS: { [key: string]: any } = {
  "shelfgauge~shelfgauge": require("./shelfgauge~shelfgauge~commits.json")
};

export default function stub(sinon: sinon.SinonSandbox) {
  return {
    fetchUserRepos: sinon
      .stub(service, "fetchUserRepos")
      .resolves({ data: values(REPOS) }),
    fetchUserRepo: sinon
      .stub(service, "fetchUserRepo")
      .callsFake((token, name) => {
        return Promise.resolve({ data: REPOS[name] });
      }),
    fetchCommits: sinon.stub(service, "fetchCommits").callsFake(name => {
      return Promise.resolve({ data: COMMITS[name] });
    })
  };
}
