import { Strategy, StrategyOption } from "passport-github";

import ENV from "config/env";
import { findOrCreate } from "./user";

const OPTIONS: StrategyOption = {
  clientID: ENV.github.oauthId,
  clientSecret: ENV.github.oauthSecret,
  callbackURL: ENV.server.baseUrl + "/auth/github",
  scope: ["public_repo"]
};

export default new Strategy(
  OPTIONS,
  (accessToken, refreshToken, profile, done) => {
    const search = { githubId: profile.id };
    findOrCreate(search, {
      username: profile.username,
      githubToken: accessToken
    }).asCallback(done);
  }
);
