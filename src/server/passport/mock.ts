import { Strategy } from "passport";

import ENV from "config/env";
import { findOrCreate } from "./user";

function create(): Strategy {
  return {
    name: "mock",
    authenticate(this: any, req, options) {
      if (!req.query.__mock_strategy_callback) {
        return this.redirect("/auth/mock?__mock_strategy_callback=true");
      }

      if (this._error) {
        return this.fail(this._error, 401);
      }

      findOrCreate(
        { githubId: "12345" },
        {
          username: "test",
          githubToken: "abcde"
        }
      ).then(user => {
        this.success(user);
      });
    }
  };
}

export default (ENV.debug.oauthMock ? create() : undefined);
