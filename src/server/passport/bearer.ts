import { Strategy } from "passport-http-bearer";

import { find } from "./user";

export default new Strategy((token, done) => {
  find({ githubToken: token }).asCallback(done);
});
